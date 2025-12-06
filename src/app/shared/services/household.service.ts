import { Injectable } from '@angular/core';
import { ID, Query } from 'appwrite';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { environment } from '../../environment/environment';
import { 
  Household, 
  HouseholdMember, 
  HouseholdWithMembers, 
  HouseholdMemberWithResident,
  AddHouseholdMemberRequest,
  SearchResidentResult,
  Relationship 
} from '../types/household';
import { ResidentInfo } from '../types/resident';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService extends BaseAppwriteService {
  private readonly HOUSEHOLDS_COLLECTION = environment.householdsCollectionId;
  private readonly HOUSEHOLD_MEMBERS_COLLECTION = environment.householdMembersCollectionId;
  private readonly RESIDENTS_COLLECTION = environment.residentCollectionId;

  /**
   * Generate a unique household code
   */
  private generateHouseholdCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `HH-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Create a new household (called automatically on resident approval)
   */
  async createHousehold(
    headOfHouseholdId: string,
    purokNo: string,
    houseNo: string,
    street: string
  ): Promise<Household> {
    try {
      const householdCode = this.generateHouseholdCode();
      const now = new Date().toISOString();

      const household = await this.database.createDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLDS_COLLECTION,
        ID.unique(),
        {
          headOfHouseholdId,
          householdCode,
          purokNo,
          houseNo,
          street,
          createdAt: now,
          updatedAt: now
        }
      );

      // Create household member entry for the head
      await this.addHouseholdHead(household.$id, headOfHouseholdId);

      return household as unknown as Household;
    } catch (error) {
      console.error('Error creating household:', error);
      throw error;
    }
  }

  /**
   * Add the head of household as the first member
   */
  private async addHouseholdHead(
    householdId: string,
    residentId: string
  ): Promise<HouseholdMember> {
    try {
      const now = new Date().toISOString();

      const member = await this.database.createDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        ID.unique(),
        {
          householdId,
          linkedResidentId: residentId,
          relationship: 'Head',
          memberType: 'linked',
          status: 'active',
          canClaimAccount: false,
          createdAt: now,
          updatedAt: now
        }
      );

      return member as unknown as HouseholdMember;
    } catch (error) {
      console.error('Error adding household head:', error);
      throw error;
    }
  }

  /**
   * Get household by head of household ID
   */
  async getHouseholdByHeadId(headOfHouseholdId: string): Promise<Household | null> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLDS_COLLECTION,
        [Query.equal('headOfHouseholdId', headOfHouseholdId)]
      );

      return response.documents.length > 0 ? response.documents[0] as unknown as Household : null;
    } catch (error) {
      console.error('Error getting household:', error);
      return null;
    }
  }

  /**
   * Get household by ID
   */
  async getHouseholdById(householdId: string): Promise<Household | null> {
    try {
      const household = await this.database.getDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLDS_COLLECTION,
        householdId
      );

      return household as unknown as Household;
    } catch (error) {
      console.error('Error getting household by ID:', error);
      return null;
    }
  }

  /**
   * Get household by household code
   */
  async getHouseholdByCode(householdCode: string): Promise<Household | null> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLDS_COLLECTION,
        [Query.equal('householdCode', householdCode)]
      );

      return response.documents.length > 0 ? response.documents[0] as unknown as Household : null;
    } catch (error) {
      console.error('Error getting household by code:', error);
      return null;
    }
  }

  /**
   * Get household by resident ID (checks if resident is head OR member)
   */
  async getHouseholdForResident(residentId: string): Promise<Household | null> {
    try {
      console.log('🏠 Looking for household for resident:', residentId);
      
      // First check if they're the head of household
      const headHousehold = await this.getHouseholdByHeadId(residentId);
      if (headHousehold) {
        console.log('✅ Resident is head of household:', headHousehold.$id);
        return headHousehold;
      }

      // If not head, check if they're a member of any household
      console.log('🔍 Checking if resident is a household member...');
      const memberResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        [
          Query.equal('linkedResidentId', residentId),
          Query.equal('status', 'active')
        ]
      );

      console.log('📋 Found household member records:', memberResponse.documents.length);
      if (memberResponse.documents.length > 0) {
        const householdMember = memberResponse.documents[0];
        const householdId = householdMember['householdId'];
        console.log('✅ Resident is member of household:', householdId);
        const household = await this.getHouseholdById(householdId);
        console.log('📊 Household details:', household ? household.$id : 'null');
        return household;
      }

      console.log('⚠️ Resident is not part of any household');
      return null;
    } catch (error) {
      console.error('❌ Error getting household for resident:', error);
      return null;
    }
  }

  /**
   * Get all household members for a household
   */
  async getHouseholdMembers(householdId: string): Promise<HouseholdMemberWithResident[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        [
          Query.equal('householdId', householdId),
          Query.orderAsc('createdAt')
        ]
      );

      const members = response.documents as unknown as HouseholdMember[];
      
      // Enrich with resident information
      const enrichedMembers = await Promise.all(
        members.map(async (member) => {
          const enriched: HouseholdMemberWithResident = { ...member };

          if (member.linkedResidentId) {
            try {
              const resident = await this.database.getDocument(
                environment.appwriteDatabaseId,
                this.RESIDENTS_COLLECTION,
                member.linkedResidentId
              ) as unknown as any;

              // Handle flat structure (resident data is at root level)
              if (resident) {
                enriched.residentInfo = {
                  firstName: resident.firstName || '',
                  lastName: resident.lastName || '',
                  middleName: resident.middleName || '',
                  birthDate: resident.birthDate || '',
                  age: resident.age || this.calculateAge(resident.birthDate),
                  gender: resident.gender || '',
                  contactNo: resident.contactNo || '',
                  email: resident.email || '',
                  profileImage: resident.profileImage || ''
                };
              }
            } catch (error) {
              console.error('Could not fetch resident info for member:', member.$id, 'linkedResidentId:', member.linkedResidentId, error);
            }
          } else if (member.memberType === 'pending_registration') {
            // Use the basic info stored in household_member
            enriched.residentInfo = {
              firstName: member.firstName || '',
              lastName: member.lastName || '',
              birthDate: member.birthDate,
              age: member.birthDate ? this.calculateAge(member.birthDate) : undefined
            };
          }

          return enriched;
        })
      );

      return enrichedMembers;
    } catch (error) {
      console.error('Error getting household members:', error);
      return [];
    }
  }

  /**
   * Get household with all members
   */
  async getHouseholdWithMembers(householdId: string): Promise<HouseholdWithMembers | null> {
    try {
      const household = await this.getHouseholdById(householdId);
      if (!household) return null;

      const members = await this.getHouseholdMembers(householdId);

      return {
        ...household,
        members,
        totalMembers: members.length
      };
    } catch (error) {
      console.error('Error getting household with members:', error);
      return null;
    }
  }

  /**
   * Search for existing residents to add as household members
   */
  async searchResidents(
    query: string,
    currentHouseholdId: string
  ): Promise<SearchResidentResult[]> {
    try {
      // Get current household members to exclude them
      const currentMembers = await this.getHouseholdMembers(currentHouseholdId);
      const existingResidentIds = currentMembers
        .filter(m => m.linkedResidentId)
        .map(m => m.linkedResidentId!);

      // Search residents
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.RESIDENTS_COLLECTION,
        [
          Query.or([
            Query.search('personalInfo.firstName', query),
            Query.search('personalInfo.lastName', query),
            Query.search('otherDetails.nationalIdNo', query),
            Query.search('otherDetails.votersIdNo', query)
          ]),
          Query.equal('otherDetails.status', ['Active', 'Inactive']),
          Query.limit(10)
        ]
      );

      const residents = response.documents as unknown as ResidentInfo[];

      // Check if each resident is head of household
      const householdHeadChecks = await Promise.all(
        residents.map(async (r) => {
          const household = await this.getHouseholdByHeadId(r.$id!);
          return { residentId: r.$id!, isHead: !!household };
        })
      );

      const headMap = new Map(
        householdHeadChecks.map(h => [h.residentId, h.isHead])
      );

      return residents.map(resident => ({
        $id: resident.$id!,
        fullName: `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`.trim(),
        firstName: resident.personalInfo.firstName,
        lastName: resident.personalInfo.lastName,
        middleName: resident.personalInfo.middleName,
        birthDate: resident.personalInfo.birthDate,
        age: resident.personalInfo.age,
        gender: resident.personalInfo.gender,
        contactNo: resident.personalInfo.contactNo,
        purokNo: resident.personalInfo.purokNo,
        alreadyInHousehold: existingResidentIds.includes(resident.$id!),
        isHouseholdHead: headMap.get(resident.$id!) || false
      }));
    } catch (error) {
      console.error('Error searching residents:', error);
      return [];
    }
  }

  /**
   * Add a household member (either linked or pending registration)
   * For pending_registration: Creates resident record directly with comprehensive data
   */
  async addHouseholdMember(request: AddHouseholdMemberRequest): Promise<HouseholdMember> {
    try {
      const now = new Date().toISOString();

      // Validate relationship
      if (request.relationship === 'Head') {
        throw new Error('Cannot manually add another Head of Household');
      }

      // Check if it's a linked member or pending registration
      if (request.memberType === 'linked' && !request.linkedResidentId) {
        throw new Error('linkedResidentId is required for linked members');
      }

      if (request.memberType === 'pending_registration') {
        // Validate required fields for pending registration
        const requiredFields = [
          'firstName', 'lastName', 'gender', 'birthDate', 'birthPlace',
          'civilStatus', 'nationality', 'religion', 'educationalAttainment',
          'employmentStatus', 'contactNo', 'purokNo', 'houseNo', 'street',
          'housingOwnership', 'pwd', 'soloParent', 'seniorCitizen',
          'indigent', 'fourPsMember', 'registeredVoter'
        ];
        
        const missingFields = requiredFields.filter(field => !request[field as keyof AddHouseholdMemberRequest]);
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Create resident record directly with all comprehensive data
        const residentId = ID.unique();
        const placeholderEmail = `household_member_${residentId}@pending.barangay.local`;
        
        const residentData = {
          profileImage: '',
          userId: '', // Explicitly set empty userId for unclaimed household members
          email: placeholderEmail,
          lastName: request.lastName!,
          firstName: request.firstName!,
          middleName: request.middleName || '',
          suffix: request.suffix || '',
          gender: request.gender!,
          birthDate: request.birthDate!,
          birthPlace: request.birthPlace!,
          civilStatus: request.civilStatus!,
          nationality: request.nationality!,
          religion: request.religion!,
          occupation: request.occupation || '',
          educationalAttainment: request.educationalAttainment!,
          employmentStatus: request.employmentStatus!,
          housingOwnership: request.housingOwnership!,
          yearsInBarangay: request.yearsInBarangay || '0',
          contactNo: request.contactNo!.startsWith('+63') ? request.contactNo! : `+63${request.contactNo!}`,
          pwd: request.pwd!,
          pwdIdNo: request.pwdIdNo || '',
          monthlyIncome: typeof request.monthlyIncome === 'number' ? request.monthlyIncome : parseInt(request.monthlyIncome || '0', 10),
          indigent: request.indigent!,
          soloParent: request.soloParent!,
          soloParentIdNo: request.soloParentIdNo || '',
          seniorCitizen: request.seniorCitizen!,
          seniorCitizenIdNo: request.seniorCitizenIdNo || '',
          fourPsMember: request.fourPsMember!,
          registeredVoter: request.registeredVoter!,
          purokNo: request.purokNo!,
          houseNo: request.houseNo!,
          street: request.street!,
          ecFullName: '',
          ecRelation: '',
          ecContactNo: '',
          ecAddress: '',
          NationalIdNo: request.nationalIdNo || '',
          votersIdNo: request.votersIdNo || '',
          status: 'Active',
          dateOfRegistration: now,
          approvalStatus: 'Pending',
          approvedAt: null,
          updatedAt: now
        };

        // Create resident document
        const resident = await this.database.createDocument(
          environment.appwriteDatabaseId,
          this.RESIDENTS_COLLECTION,
          residentId,
          residentData
        );

        // Create household member record linking to the resident
        const memberData = {
          householdId: request.householdId,
          linkedResidentId: residentId,
          relationship: request.relationship,
          memberType: 'linked', // Now linked to resident
          status: 'pending_verification',
          canClaimAccount: true,
          createdAt: now,
          updatedAt: now
        };

        const member = await this.database.createDocument(
          environment.appwriteDatabaseId,
          this.HOUSEHOLD_MEMBERS_COLLECTION,
          ID.unique(),
          memberData
        );

        return member as unknown as HouseholdMember;
      } else {
        // Linked member - just create the household member record
        const memberData = {
          householdId: request.householdId,
          linkedResidentId: request.linkedResidentId,
          relationship: request.relationship,
          memberType: 'linked',
          status: 'active',
          canClaimAccount: false,
          createdAt: now,
          updatedAt: now
        };

        const member = await this.database.createDocument(
          environment.appwriteDatabaseId,
          this.HOUSEHOLD_MEMBERS_COLLECTION,
          ID.unique(),
          memberData
        );

        return member as unknown as HouseholdMember;
      }
    } catch (error) {
      console.error('Error adding household member:', error);
      throw error;
    }
  }

  /**
   * Update household member status (for admin approval)
   */
  async updateHouseholdMemberStatus(
    memberId: string,
    status: 'active' | 'pending_verification',
    rejectionReason?: string
  ): Promise<HouseholdMember> {
    try {
      // First, get the current member data
      const currentMember = await this.database.getDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        memberId
      ) as unknown as HouseholdMember;

      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      };

      // If approving, update the linked resident's approval status
      if (status === 'active' && currentMember.linkedResidentId) {
        try {
          // Update the resident's approvalStatus to 'Approved'
          await this.database.updateDocument(
            environment.appwriteDatabaseId,
            this.RESIDENTS_COLLECTION,
            currentMember.linkedResidentId,
            {
              approvalStatus: 'Approved',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          );
          console.log('Updated resident approval status for:', currentMember.linkedResidentId);
        } catch (error) {
          console.error('Error updating resident approval status:', error);
          throw new Error('Failed to approve resident. Please try again.');
        }
      }

      const member = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        memberId,
        updateData
      );

      return member as unknown as HouseholdMember;
    } catch (error) {
      console.error('Error updating household member status:', error);
      throw error;
    }
  }

  /**
   * Create a resident record from household member data
   */
  private async createResidentFromHouseholdMember(
    member: HouseholdMember,
    household: Household
  ): Promise<string> {
    try {
      const now = new Date().toISOString();
      
      const residentData = {
        // Personal Information
        firstName: member.firstName || '',
        middleName: '',
        lastName: member.lastName || '',
        suffix: '',
        gender: 'Male', // Default value, will be updated when they register
        birthDate: member.birthDate || null,
        birthPlace: '',
        age: member.birthDate ? this.calculateAge(member.birthDate) : null,
        civilStatus: 'Single', // Default value, will be updated when they register
        nationality: 'Filipino',
        religion: '',
        
        // Contact Information
        contactNo: '',
        email: `household_member_${member.$id}@pending.barangay.local`, // Placeholder email until they register
        
        // Address Information (from household)
        purokNo: household.purokNo,
        houseNo: household.houseNo,
        street: household.street,
        
        // Emergency Contact
        ecFullName: '',
        ecRelation: '',
        ecContactNo: '',
        ecAddress: '',
        
        // Government IDs
        votersIdNo: '',
        NationalIdNo: '',
        pwdIdNo: '',
        seniorCitizenIdNo: '',
        soloParentIdNo: '',
        
        // Status Information
        status: 'Active',
        approvalStatus: 'Approved', // Household members are auto-approved
        registeredVoter: 'No',
        pwd: 'No',
        seniorCitizen: 'No',
        soloParent: 'No',
        fourPsMember: 'No',
        indigent: 'No',
        vaccinated: null,
        covidStatus: null,
        
        // Employment & Education
        employmentStatus: 'Unemployed', // Default value, will be updated when they register
        occupation: '',
        monthlyIncome: 0,
        educationalAttainment: 'ElementaryGraduate', // Default value, will be updated when they register
        
        // Housing
        housingOwnership: 'Owned', // Default value, will be updated when they register
        yearsInBarangay: 0,
        
        // System fields
        dateOfRegistration: now,
        approvedAt: now,
        userId: '', // No user account yet
        profileImage: '',
        updatedAt: null,
        rejectionReason: null
      };

      const resident = await this.database.createDocument(
        environment.appwriteDatabaseId,
        this.RESIDENTS_COLLECTION,
        ID.unique(),
        residentData
      );

      console.log('Created resident record for household member:', resident.$id);
      return resident.$id;
    } catch (error) {
      console.error('Error creating resident from household member:', error);
      throw error;
    }
  }

  /**
   * Remove household member
   */
  async removeHouseholdMember(memberId: string): Promise<void> {
    try {
      // First, get the household member to check if it has a linked resident
      const member = await this.database.getDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        memberId
      ) as unknown as HouseholdMember;

      // If there's a linked resident with pending status, delete it too
      if (member.linkedResidentId) {
        try {
          const resident = await this.database.getDocument(
            environment.appwriteDatabaseId,
            this.RESIDENTS_COLLECTION,
            member.linkedResidentId
          );

          // Only delete if the resident is still pending (not yet claimed/approved)
          if (resident['approvalStatus'] === 'Pending') {
            await this.database.deleteDocument(
              environment.appwriteDatabaseId,
              this.RESIDENTS_COLLECTION,
              member.linkedResidentId
            );
            console.log('Deleted pending resident record:', member.linkedResidentId);
          }
        } catch (error) {
          console.warn('Could not delete linked resident:', error);
          // Continue with household member deletion even if resident deletion fails
        }
      }

      // Delete the household member
      await this.database.deleteDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        memberId
      );
    } catch (error) {
      console.error('Error removing household member:', error);
      throw error;
    }
  }

  /**
   * Get pending household members (for admin approval)
   */
  async getPendingHouseholdMembers(): Promise<HouseholdMemberWithResident[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        [
          Query.equal('status', 'pending_verification'),
          Query.orderDesc('createdAt')
        ]
      );

      const members = response.documents as unknown as HouseholdMember[];
      
      // Enrich with household and resident information
      const enrichedMembers = await Promise.all(
        members.map(async (member) => {
          const enriched: HouseholdMemberWithResident = { ...member };

          // Fetch resident information if linked
          if (member.linkedResidentId) {
            try {
              const resident = await this.database.getDocument(
                environment.appwriteDatabaseId,
                this.RESIDENTS_COLLECTION,
                member.linkedResidentId
              );

              if (resident) {
                enriched.residentInfo = {
                  firstName: resident['firstName'] || '',
                  lastName: resident['lastName'] || '',
                  middleName: resident['middleName'],
                  birthDate: resident['birthDate'],
                  age: resident['birthDate'] ? this.calculateAge(resident['birthDate']) : undefined,
                  gender: resident['gender'],
                  contactNo: resident['contactNo'],
                  email: resident['email'],
                  profileImage: resident['profileImage']
                };
              }
            } catch (error) {
              console.warn('Could not fetch resident info for member:', member.$id, error);
            }
          }

          return enriched;
        })
      );

      return enrichedMembers;
    } catch (error) {
      console.error('Error getting pending household members:', error);
      return [];
    }
  }

  /**
   * Check if a resident can claim an account
   */
  async findClaimableAccount(
    firstName: string,
    lastName: string,
    birthDate?: string
  ): Promise<HouseholdMember | null> {
    try {
      const queries: any[] = [
        Query.equal('memberType', 'pending_registration'),
        Query.equal('canClaimAccount', true),
        Query.equal('status', 'active'),
        Query.equal('firstName', firstName),
        Query.equal('lastName', lastName)
      ];

      if (birthDate) {
        queries.push(Query.equal('birthDate', birthDate));
      }

      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        queries
      );

      return response.documents.length > 0 ? response.documents[0] as unknown as HouseholdMember : null;
    } catch (error) {
      console.error('Error finding claimable account:', error);
      return null;
    }
  }

  /**
   * Claim a household member account
   */
  async claimHouseholdMember(
    memberId: string,
    linkedResidentId: string
  ): Promise<HouseholdMember> {
    try {
      const member = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        this.HOUSEHOLD_MEMBERS_COLLECTION,
        memberId,
        {
          linkedResidentId,
          memberType: 'linked',
          status: 'claimed',
          canClaimAccount: false,
          updatedAt: new Date().toISOString()
        }
      );

      return member as unknown as HouseholdMember;
    } catch (error) {
      console.error('Error claiming household member:', error);
      throw error;
    }
  }

  /**
   * Update resident record with complete information from profile completion
   */
  async updateResidentWithCompleteInfo(
    residentId: string,
    userId: string,
    completeInfo: {
      email: string;
      contactNo: string;
      birthPlace: string;
      civilStatus: string;
      nationality: string;
      religion: string;
      occupation?: string;
      monthlyIncome?: number;
      employmentStatus: string;
      educationalAttainment: string;
      housingOwnership: string;
      ecFullName: string;
      ecRelation: string;
      ecContactNo: string;
      ecAddress: string;
      votersIdNo?: string;
      NationalIdNo?: string;
      pwdIdNo?: string;
      seniorCitizenIdNo?: string;
      soloParentIdNo?: string;
      pwd: string;
      indigent: string;
      soloParent: string;
      seniorCitizen: string;
      fourPsMember: string;
      registeredVoter: string;
    }
  ): Promise<void> {
    try {
      const now = new Date().toISOString();

      await this.database.updateDocument(
        environment.appwriteDatabaseId,
        this.RESIDENTS_COLLECTION,
        residentId,
        {
          // Personal information
          email: completeInfo.email,
          contactNo: completeInfo.contactNo,
          birthPlace: completeInfo.birthPlace,
          civilStatus: completeInfo.civilStatus,
          nationality: completeInfo.nationality,
          religion: completeInfo.religion,
          occupation: completeInfo.occupation || '',
          monthlyIncome: completeInfo.monthlyIncome || 0,
          
          // Employment & Education
          employmentStatus: completeInfo.employmentStatus,
          educationalAttainment: completeInfo.educationalAttainment,
          
          // Housing
          housingOwnership: completeInfo.housingOwnership,
          
          // Emergency Contact
          ecFullName: completeInfo.ecFullName,
          ecRelation: completeInfo.ecRelation,
          ecContactNo: completeInfo.ecContactNo,
          ecAddress: completeInfo.ecAddress,
          
          // Government IDs
          votersIdNo: completeInfo.votersIdNo || '',
          NationalIdNo: completeInfo.NationalIdNo || '',
          pwdIdNo: completeInfo.pwdIdNo || '',
          seniorCitizenIdNo: completeInfo.seniorCitizenIdNo || '',
          soloParentIdNo: completeInfo.soloParentIdNo || '',
          
          // Categories
          pwd: completeInfo.pwd,
          indigent: completeInfo.indigent,
          soloParent: completeInfo.soloParent,
          seniorCitizen: completeInfo.seniorCitizen,
          fourPsMember: completeInfo.fourPsMember,
          registeredVoter: completeInfo.registeredVoter,
          
          // Link to user account
          userId: userId,
          
          // Update timestamp
          updatedAt: now
        }
      );

      console.log('Successfully updated resident record with complete information');
    } catch (error) {
      console.error('Error updating resident with complete info:', error);
      throw error;
    }
  }

  /**
   * Find resident record by user ID (for checking if user has claimed account)
   */
  async getResidentByUserId(userId: string): Promise<any | null> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.RESIDENTS_COLLECTION,
        [Query.equal('userId', userId)]
      );

      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('Error getting resident by user ID:', error);
      return null;
    }
  }

  /**
   * Find placeholder resident by name and birthdate (for account claiming during signup)
   */
  async findPlaceholderResident(
    firstName: string,
    lastName: string,
    birthDate: string
  ): Promise<any | null> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.RESIDENTS_COLLECTION,
        [
          Query.equal('firstName', firstName),
          Query.equal('lastName', lastName),
          Query.equal('birthDate', birthDate),
          Query.search('email', 'household_member_'),
          Query.equal('approvalStatus', 'Approved')
        ]
      );

      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('Error finding placeholder resident:', error);
      return null;
    }
  }

  /**
   * Get all households (for admin)
   */
  async getAllHouseholds(): Promise<Household[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        this.HOUSEHOLDS_COLLECTION,
        [Query.orderDesc('createdAt')]
      );

      return response.documents as unknown as Household[];
    } catch (error) {
      console.error('Error getting all households:', error);
      return [];
    }
  }

  /**
   * Get household statistics
   */
  async getHouseholdStats() {
    try {
      const households = await this.getAllHouseholds();
      
      let totalMembers = 0;
      const householdSizes: number[] = [];

      for (const household of households) {
        const members = await this.getHouseholdMembers(household.$id!);
        totalMembers += members.length;
        householdSizes.push(members.length);
      }

      const avgHouseholdSize = households.length > 0 
        ? (totalMembers / households.length).toFixed(2) 
        : '0';

      return {
        totalHouseholds: households.length,
        totalMembers,
        avgHouseholdSize: parseFloat(avgHouseholdSize),
        largestHousehold: householdSizes.length > 0 ? Math.max(...householdSizes) : 0,
        smallestHousehold: householdSizes.length > 0 ? Math.min(...householdSizes) : 0
      };
    } catch (error) {
      console.error('Error getting household stats:', error);
      return {
        totalHouseholds: 0,
        totalMembers: 0,
        avgHouseholdSize: 0,
        largestHousehold: 0,
        smallestHousehold: 0
      };
    }
  }

  /**
   * Calculate age from birthdate
   */
  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : 0;
  }
}
