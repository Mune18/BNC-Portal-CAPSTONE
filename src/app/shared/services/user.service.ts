import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { ResidentInfo } from '../types/resident';
import { Query } from 'appwrite';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseAppwriteService {

  constructor(
    router: Router
  ) {
    super(router);
  }

  // Get user document from users collection to check is_active status
  async getUserFromUsersCollection(accountId: string): Promise<any | null> {
    try {
      const userResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [
          Query.equal('uid', accountId)
        ]
      );
      
      if (userResponse.documents.length === 0) {
        console.log('No user document found for account ID:', accountId);
        return null;
      }
      
      return userResponse.documents[0];
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  }

  async getUserInformation(accountId: string): Promise<ResidentInfo | null> {
    try {
      // First get the user document that contains role and uid
      const userResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [
          Query.equal('uid', accountId)
        ]
      );
      
      if (userResponse.documents.length === 0) {
        console.log('No user document found for account ID:', accountId);
        return this.getEmptyResidentInfo();
      }
      
      const userDoc = userResponse.documents[0];
      console.log('User document found:', userDoc);
      
      // Now fetch the resident document using the userId field
      const residentResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.equal('userId', accountId)
        ]
      );
      
      // If no resident document found, return empty structure with user data
      if (residentResponse.documents.length === 0) {
        console.log('No resident document found for user ID:', accountId);
        const emptyInfo = this.getEmptyResidentInfo();
        emptyInfo.uid = userDoc['uid'];
        emptyInfo.role = userDoc['role'];
        return emptyInfo;
      }
      
      // We found a resident document
      const residentDoc = residentResponse.documents[0];
      console.log('Resident document found:', residentDoc);
      
      // Map the resident document to the ResidentInfo structure
      const residentInfo: ResidentInfo = {
        $id: residentDoc.$id,
        $createdAt: residentDoc.$createdAt,
        $updatedAt: residentDoc.$updatedAt,
        $permissions: residentDoc.$permissions,
        uid: userDoc['uid'],
        role: userDoc['role'],
        profileImage: residentDoc['profileImage'] || '',
        personalInfo: {
          lastName: residentDoc['lastName'] || '',
          firstName: residentDoc['firstName'] || '',
          middleName: residentDoc['middleName'] || '',
          suffix: residentDoc['suffix'] || '',
          gender: residentDoc['gender'] || '',
          birthDate: residentDoc['birthDate'] || '',
          birthPlace: residentDoc['birthPlace'] || '',
          age: residentDoc['age'] || 0,
          civilStatus: residentDoc['civilStatus'] || '',
          nationality: residentDoc['nationality'] || '',
          religion: residentDoc['religion'] || '',
          occupation: residentDoc['occupation'] || '',
          educationalAttainment: residentDoc['educationalAttainment'] || '',
          employmentStatus: residentDoc['employmentStatus'] || '',
          housingOwnership: residentDoc['housingOwnership'] || '',
          yearsInBarangay: residentDoc['yearsInBarangay'] || null,
          email: residentDoc['email'] || '',
          contactNo: residentDoc['contactNo'] || '',
          pwd: residentDoc['pwd'] || '',
          pwdIdNo: residentDoc['pwdIdNo'] || '',
          monthlyIncome: residentDoc['monthlyIncome'] || 0,
          indigent: residentDoc['indigent'] || '',
          soloParent: residentDoc['soloParent'] || '',
          soloParentIdNo: residentDoc['soloParentIdNo'] || '',
          seniorCitizen: residentDoc['seniorCitizen'] || '',
          seniorCitizenIdNo: residentDoc['seniorCitizenIdNo'] || '',
          fourPsMember: residentDoc['fourPsMember'] || '',
          registeredVoter: residentDoc['registeredVoter'] || '',
          purokNo: residentDoc['purokNo'] || '',
          houseNo: residentDoc['houseNo'] || '',
          street: residentDoc['street'] || ''
        },
        emergencyContact: {
          fullName: residentDoc['ecFullName'] || '',
          relationship: residentDoc['ecRelation'] || '',
          contactNo: residentDoc['ecContactNo'] || '',
          address: residentDoc['ecAddress'] || ''
        },
        otherDetails: {
          nationalIdNo: residentDoc['NationalIdNo'] || '',
          votersIdNo: residentDoc['votersIdNo'] || '',
          status: residentDoc['status'] || '',
          dateOfRegistration: residentDoc['dateOfRegistration'] || ''
        }
      };
      
      return residentInfo;
    } catch (error) {
      console.error('Error fetching user/resident information:', error);
      return this.getEmptyResidentInfo();
    }
  }

  /**
   * Get resident information by resident document ID
   */
  async getResidentById(residentId: string): Promise<{ firstName: string; lastName: string; middleName?: string } | null> {
    try {
      const resident = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );

      if (resident) {
        return {
          firstName: resident['firstName'] || '',
          lastName: resident['lastName'] || '',
          middleName: resident['middleName'] || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching resident by ID:', error);
      return null;
    }
  }

  // Helper method to create empty ResidentInfo structure
  private getEmptyResidentInfo(): ResidentInfo {
    return {
      uid: '',
      role: '',
      profileImage: '',
      personalInfo: {
        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        age: 0,
        civilStatus: '',
        nationality: '',
        religion: '',
        occupation: '',
            educationalAttainment: '',
            employmentStatus: '',
            housingOwnership: '',
            yearsInBarangay: null,
        email: '',
        contactNo: '',
        pwd: '',
        pwdIdNo: '',
        monthlyIncome: 0,
        indigent: '',
        soloParent: '',
        soloParentIdNo: '',
        seniorCitizen: '',
        seniorCitizenIdNo: '',
        fourPsMember: '',
        registeredVoter: '',
        purokNo: '',
        houseNo: '',
        street: ''
      },
      emergencyContact: {
        fullName: '',
        relationship: '',
        contactNo: '',
        address: ''
      },
      otherDetails: {
        nationalIdNo: '',
        votersIdNo: '',
        status: '',
        dateOfRegistration: ''
      }
    };
  }

  async createUser(userDoc: any) {
    try {
      const response = await this.database.createDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        'unique()', // Let Appwrite generate the document ID
        userDoc
      );
      return response;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async createResident(residentDoc: any) {
    try {
      const response = await this.database.createDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId, // Make sure this is set in your environment
        'unique()',
        residentDoc
      );
      return response;
    } catch (error) {
      console.error('Error creating resident document:', error);
      throw error;
    }
  }

  async updateUser(documentId: string, userData: any) {
    try {
      const response = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        documentId,
        userData
      );
      return response;
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  async updateUserStatus(accountId: string, newStatus: string): Promise<void> {
    try {
      // Find the resident document by userId (accountId)
      const residentResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [Query.equal('userId', accountId)]
      );

      if (residentResponse.documents.length > 0) {
        const residentDoc = residentResponse.documents[0];
        
        // Update the status field in the resident document
        await this.database.updateDocument(
          environment.appwriteDatabaseId,
          environment.residentCollectionId,
          residentDoc.$id,
          { status: newStatus }
        );
        
        console.log(`User status updated to ${newStatus} for account ID:`, accountId);
      } else {
        console.log('No resident document found to update status for userId:', accountId);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Find and delete the user document by uid
      const userResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [Query.equal('uid', userId)]
      );

      if (userResponse.documents.length > 0) {
        const userDoc = userResponse.documents[0];
        await this.database.deleteDocument(
          environment.appwriteDatabaseId,
          environment.userCollectionId,
          userDoc.$id
        );
        console.log('User document deleted successfully');
      } else {
        console.log('No user document found to delete for userId:', userId);
      }
    } catch (error) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  }

  async deleteResident(userId: string): Promise<void> {
    try {
      // Find and delete the resident document by userId
      const residentResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [Query.equal('userId', userId)]
      );

      if (residentResponse.documents.length > 0) {
        const residentDoc = residentResponse.documents[0];
        await this.database.deleteDocument(
          environment.appwriteDatabaseId,
          environment.residentCollectionId,
          residentDoc.$id
        );
        console.log('Resident document deleted successfully');
      } else {
        console.log('No resident document found to delete for userId:', userId);
      }
    } catch (error) {
      console.error('Error deleting resident document:', error);
      throw error;
    }
  }

  // Check for duplicate resident registration based on personal information
  async checkDuplicateResident(firstName: string, lastName: string, birthDate: string, contactNo?: string, email?: string): Promise<{ isDuplicate: boolean; existingResident?: any; duplicateType?: string; isHouseholdMemberPlaceholder?: boolean; placeholderResidentId?: string }> {
    try {
      console.log('Checking for duplicate resident:', { firstName, lastName, birthDate, contactNo, email });
      
      // First check for email duplicates if email is provided
      if (email) {
        const emailQuery = await this.database.listDocuments(
          environment.appwriteDatabaseId,
          environment.residentCollectionId,
          [Query.equal('email', email.trim())]
        );

        if (emailQuery.documents.length > 0) {
          const emailMatch = emailQuery.documents[0];
          return {
            isDuplicate: true,
            duplicateType: 'email',
            existingResident: {
              name: `${emailMatch['firstName']} ${emailMatch['middleName'] || ''} ${emailMatch['lastName']}`.trim(),
              contactNo: emailMatch['contactNo'],
              email: emailMatch['email'],
              registrationDate: emailMatch.$createdAt
            }
          };
        }
      }
      
      // Search for residents with the same first name, last name, and birth date
      const queries = [
        Query.equal('firstName', firstName.trim()),
        Query.equal('lastName', lastName.trim()),
        Query.equal('birthDate', birthDate)
      ];

      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        queries
      );

      if (response.documents.length > 0) {
        console.log('Found potential duplicate resident(s):', response.documents.length);
        
        const match = response.documents[0];
        
        // Check if this is a household member placeholder
        const isPlaceholder = this.isHouseholdMemberPlaceholder(match['email']);
        const isApproved = match['approvalStatus'] === 'Approved';
        // More robust userId check - handle null, undefined, empty string, or the string 'null'
        const userIdValue = match['userId'];
        const hasNoUserId = !userIdValue || userIdValue === '' || userIdValue === 'null' || userIdValue === 'undefined';
        
        // Debug logging
        console.log('🔍 Duplicate check details:', {
          residentId: match.$id,
          name: `${match['firstName']} ${match['lastName']}`,
          email: match['email'],
          isPlaceholder,
          approvalStatus: match['approvalStatus'],
          isApproved,
          userId: match['userId'],
          userIdType: typeof match['userId'],
          hasNoUserId,
          canClaim: isPlaceholder && isApproved && hasNoUserId
        });
        
        if (isPlaceholder && isApproved && hasNoUserId) {
          console.log('✅ Detected approved household member placeholder (not yet claimed) - allowing account claiming');
          // This is an approved household member placeholder that hasn't been claimed yet - allow registration with linking
          return {
            isDuplicate: false, // Not a true duplicate
            isHouseholdMemberPlaceholder: true,
            placeholderResidentId: match.$id,
            existingResident: {
              name: `${match['firstName']} ${match['middleName'] || ''} ${match['lastName']}`.trim(),
              contactNo: match['contactNo'],
              email: match['email'],
              registrationDate: match.$createdAt
            }
          };
        }
        
        // If it's a placeholder but not approved, or already has a userId (claimed), treat as duplicate
        if (isPlaceholder && (!isApproved || !hasNoUserId)) {
          console.log('Household member placeholder found but:', {
            isApproved,
            hasNoUserId,
            reason: !isApproved ? 'not yet approved by admin' : 'already claimed'
          });
          return {
            isDuplicate: true,
            duplicateType: !isApproved ? 'pending_approval' : 'already_claimed',
            existingResident: {
              name: `${match['firstName']} ${match['middleName'] || ''} ${match['lastName']}`.trim(),
              contactNo: match['contactNo'],
              email: match['email'],
              registrationDate: match.$createdAt
            }
          };
        }
        
        // It's a true duplicate - not a placeholder
        console.log('True duplicate detected - blocking registration');
        
        // If we have a contact number, do additional verification
        if (contactNo) {
          const formattedContactNo = '+63' + contactNo;
          const exactMatch = response.documents.find(doc => doc['contactNo'] === formattedContactNo);
          if (exactMatch) {
            return {
              isDuplicate: true,
              duplicateType: 'personal_info',
              existingResident: {
                name: `${exactMatch['firstName']} ${exactMatch['middleName'] || ''} ${exactMatch['lastName']}`.trim(),
                contactNo: exactMatch['contactNo'],
                email: exactMatch['email'],
                registrationDate: exactMatch.$createdAt
              }
            };
          }
        }

        // Return the first match even without contact verification
        return {
          isDuplicate: true,
          duplicateType: 'personal_info',
          existingResident: {
            name: `${match['firstName']} ${match['middleName'] || ''} ${match['lastName']}`.trim(),
            contactNo: match['contactNo'],
            email: match['email'],
            registrationDate: match.$createdAt
          }
        };
      }

      console.log('No duplicate resident found');
      return { isDuplicate: false };
    } catch (error) {
      console.error('Error checking duplicate resident:', error);
      // Return false on error to allow registration to proceed
      return { isDuplicate: false };
    }
  }

  /**
   * Check if an email is a household member placeholder
   */
  private isHouseholdMemberPlaceholder(email: string | null | undefined): boolean {
    if (!email) return false;
    const placeholderPattern = /^household_member_.*@pending\.barangay\.local$/;
    return placeholderPattern.test(email);
  }



  /**
   * Get the resident ID for the current user (if they have a linked resident record)
   */
  async getResidentIdForUser(userId: string): Promise<string | null> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [Query.equal('userId', userId)]
      );

      return response.documents.length > 0 ? response.documents[0].$id : null;
    } catch (error) {
      console.error('Error getting resident ID for user:', error);
      return null;
    }
  }

  /**
   * Update resident record (used for claiming household member accounts)
   */
  async updateResident(residentId: string, data: any): Promise<void> {
    try {
      await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId,
        data
      );
      console.log('Resident record updated successfully');
    } catch (error) {
      console.error('Error updating resident:', error);
      throw error;
    }
  }
}
