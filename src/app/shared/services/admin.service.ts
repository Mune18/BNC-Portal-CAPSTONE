import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { environment } from '../../environment/environment';
import { Query } from 'appwrite';
import { ResidentInfo } from '../types/resident';
import { CacheService } from './cache.service';
import { EmailService, EmailNotificationData } from './email.service';
import { HouseholdService } from './household.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseAppwriteService {

  constructor(
    router: Router,
    private cacheService: CacheService,
    private emailService: EmailService,
    private householdService: HouseholdService
  ) {
    super(router);
  }

  // Fast method to get resident counts and basic stats without full data
  async getResidentStats() {
    const cacheKey = 'resident_stats';
    const cached = this.cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Get total count (exclude pending residents for accurate resident count)
      const totalResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id']),
          Query.notEqual('approvalStatus', 'Pending')
        ]
      );

      // Get active residents (exclude deceased, archived, and pending)
      const activeResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id']),
          Query.notEqual('status', 'Deceased'),
          Query.notEqual('status', 'Archived'),
          Query.notEqual('approvalStatus', 'Pending')
        ]
      );

      // Get recent registrations (last 30 days, exclude pending)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id']),
          Query.greaterThan('$createdAt', thirtyDaysAgo.toISOString()),
          Query.notEqual('approvalStatus', 'Pending')
        ]
      );

      const stats = {
        total: totalResponse.total,
        active: activeResponse.total,
        recent: recentResponse.total
      };

      this.cacheService.set(cacheKey, stats, 2 * 60 * 1000); // Cache for 2 minutes
      return stats;
    } catch (error) {
      console.error('Error fetching resident stats:', error);
      throw error;
    }
  }

  // Fast method to get newest residents with minimal data
  async getNewestResidents(limit: number = 5) {
    const cacheKey = `newest_residents_${limit}`;
    const cached = this.cacheService.get<ResidentInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id', '$createdAt', 'firstName', 'lastName', 'contactNo', 'profileImage', 'dateOfRegistration']),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          // Exclude pending residents - only show approved residents
          Query.notEqual('approvalStatus', 'Pending')
        ]
      );

      const residents = response.documents.map(doc => this.mapToLightResidentInfo(doc));
      this.cacheService.set(cacheKey, residents, 2 * 60 * 1000); // Cache for 2 minutes
      return residents;
    } catch (error) {
      console.error('Error fetching newest residents:', error);
      throw error;
    }
  }

  // Light mapping for basic resident info
  private mapToLightResidentInfo(doc: any): ResidentInfo {
    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt || '',
      $permissions: doc.$permissions || [],
      uid: doc['userId'] || '',
      role: 'resident',
      profileImage: doc.profileImage || '',
      personalInfo: {
        lastName: doc.lastName || '',
        firstName: doc.firstName || '',
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
        email: doc.email || '',
        contactNo: doc.contactNo || '',
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
        dateOfRegistration: doc.dateOfRegistration || ''
      }
    };
  }

  // Paginated method for residents
  async getResidentsPaginated(page: number = 1, limit: number = 50) {
    const cacheKey = `residents_page_${page}_${limit}`;
    const cached = this.cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const offset = (page - 1) * limit;
      
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt'),
          // Exclude pending residents - only show approved residents
          Query.notEqual('approvalStatus', 'Pending')
        ]
      );

      // Get user roles in a single query
      const userIds = [...new Set(response.documents.map(doc => doc['userId']).filter(Boolean))];
      let userRoleMap = new Map();
      
      if (userIds.length > 0) {
        const usersResponse = await this.database.listDocuments(
          environment.appwriteDatabaseId,
          environment.userCollectionId,
          [Query.equal('uid', userIds)]
        );

        usersResponse.documents.forEach(user => {
          userRoleMap.set(user['uid'], user['role']);
        });
      }

      const residents = response.documents.map(doc => {
        return this.mapToResidentInfo(doc, userRoleMap.get(doc['userId']) || 'resident');
      });

      const result = {
        residents,
        total: response.total,
        page,
        limit,
        hasMore: offset + limit < response.total
      };

      this.cacheService.set(cacheKey, result, 1 * 60 * 1000); // Cache for 1 minute
      return result;
    } catch (error) {
      console.error('Error fetching paginated residents:', error);
      throw error;
    }
  }

  // Add this new method to fetch all residents
  async getAllResidents() {
    const cacheKey = 'all_residents';
    const cached = this.cacheService.get<ResidentInfo[]>(cacheKey);
    if (cached) return cached;

    try {
      // Fetch all resident documents from the residents collection
      // Exclude pending residents - only show approved residents
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.notEqual('approvalStatus', 'Pending'),
          Query.orderDesc('$createdAt')
        ]
      );

      // Also fetch all user documents to get roles
      const usersResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId
      );

      // Create a map of userId to role for quick lookup
      const userRoleMap = new Map();
      usersResponse.documents.forEach(user => {
        userRoleMap.set(user['uid'], user['role']);
      });

      // Map resident documents to ResidentInfo format
      const residents = response.documents.map(doc => {
        return this.mapToResidentInfo(doc, userRoleMap.get(doc['userId']) || 'resident');
      });

      this.cacheService.set(cacheKey, residents, 3 * 60 * 1000); // Cache for 3 minutes
      return residents;
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw error;
    }
  }

  // Get a single resident by ID
  async getResidentById(residentId: string): Promise<ResidentInfo | null> {
    try {
      // Fetch the resident document
      const doc = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );

      // Fetch user document to get role
      let role = 'resident';
      if (doc['userId']) {
        try {
          const userDoc = await this.database.getDocument(
            environment.appwriteDatabaseId,
            environment.userCollectionId,
            doc['userId']
          );
          role = userDoc['role'] || 'resident';
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }

      return this.mapToResidentInfo(doc, role);
    } catch (error) {
      console.error('Error fetching resident by ID:', error);
      return null;
    }
  }

  // Helper method to map document to ResidentInfo type
  private mapToResidentInfo(doc: any, role: string): ResidentInfo {
    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      uid: doc.userId,
      role: role,
      profileImage: doc.profileImage || '',
      personalInfo: {
        lastName: doc.lastName || '',
        firstName: doc.firstName || '',
        middleName: doc.middleName || '',
        suffix: doc.suffix || '',
        gender: doc.gender || '',
        birthDate: doc.birthDate || '',
        birthPlace: doc.birthPlace || '',
        age: doc.age || 0,
        civilStatus: doc.civilStatus || '',
        nationality: doc.nationality || '',
        religion: doc.religion || '',
        occupation: doc.occupation || '',
        educationalAttainment: doc.educationalAttainment || '',
        employmentStatus: doc.employmentStatus || '',
        housingOwnership: doc.housingOwnership || '',
        yearsInBarangay: doc.yearsInBarangay || null,
        email: doc.email || '',
        contactNo: doc.contactNo || '',
        pwd: doc.pwd || '',
        pwdIdNo: doc.pwdIdNo || '',
        monthlyIncome: doc.monthlyIncome || 0,
        indigent: doc.indigent || '',
        soloParent: doc.soloParent || '',
        soloParentIdNo: doc.soloParentIdNo || '',
        seniorCitizen: doc.seniorCitizen || '',
        seniorCitizenIdNo: doc.seniorCitizenIdNo || '',
        fourPsMember: doc.fourPsMember || '',
        registeredVoter: doc.registeredVoter || '',
        purokNo: doc.purokNo || '',
        houseNo: doc.houseNo || '',
        street: doc.street || ''
      },
      emergencyContact: {
        fullName: doc.ecFullName || '',
        relationship: doc.ecRelation || '',
        contactNo: doc.ecContactNo || '',
        address: doc.ecAddress || ''
      },
      otherDetails: {
        nationalIdNo: doc.NationalIdNo || '',
        votersIdNo: doc.votersIdNo || '',
        status: doc.status || '',
        dateOfRegistration: doc.dateOfRegistration || ''
      }
    };
  }

  // Your existing methods...
  async getAllUsers() {
    try {
      const users = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [
          // Add any filters or queries if needed
        ],  
      )

      return users;
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        userId
      );
      return user;
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }
  
  async updateUser(userId: string, data: any) {
    try {
      const response = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        userId,
        data
      );
      return response;
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  async updateResident(residentId: string, residentData: ResidentInfo) {
    try {
      // Map ResidentInfo back to database format
      const dbData = {
        lastName: residentData.personalInfo.lastName,
        firstName: residentData.personalInfo.firstName,
        middleName: residentData.personalInfo.middleName,
        suffix: residentData.personalInfo.suffix,
        gender: residentData.personalInfo.gender,
        birthDate: residentData.personalInfo.birthDate,
        birthPlace: residentData.personalInfo.birthPlace,
        age: residentData.personalInfo.age,
        civilStatus: residentData.personalInfo.civilStatus,
        nationality: residentData.personalInfo.nationality,
        religion: residentData.personalInfo.religion,
        occupation: residentData.personalInfo.occupation,
        contactNo: residentData.personalInfo.contactNo,
        pwd: residentData.personalInfo.pwd,
        pwdIdNo: residentData.personalInfo.pwdIdNo,
        monthlyIncome: residentData.personalInfo.monthlyIncome,
        indigent: residentData.personalInfo.indigent,
        soloParent: residentData.personalInfo.soloParent,
        soloParentIdNo: residentData.personalInfo.soloParentIdNo,
        seniorCitizen: residentData.personalInfo.seniorCitizen,
        seniorCitizenIdNo: residentData.personalInfo.seniorCitizenIdNo,
        fourPsMember: residentData.personalInfo.fourPsMember,
        registeredVoter: residentData.personalInfo.registeredVoter,
        purokNo: residentData.personalInfo.purokNo,
        houseNo: residentData.personalInfo.houseNo,
        street: residentData.personalInfo.street,
        ecFullName: residentData.emergencyContact.fullName,
        ecRelation: residentData.emergencyContact.relationship,
        ecContactNo: residentData.emergencyContact.contactNo,
        ecAddress: residentData.emergencyContact.address,
        NationalIdNo: residentData.otherDetails.nationalIdNo,
        votersIdNo: residentData.otherDetails.votersIdNo,
        status: residentData.otherDetails.status,
        dateOfRegistration: residentData.otherDetails.dateOfRegistration
      };

      // Update the resident document
      const response = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId,
        dbData
      );

      // Invalidate related caches
      this.invalidateResidentCaches();

      // Return the updated resident in ResidentInfo format
      return this.mapToResidentInfo(response, residentData.role || 'resident');
    } catch (error) {
      console.error('Error updating resident document:', error);
      throw error;
    }
  }

  // Cache invalidation methods
  private invalidateResidentCaches() {
    this.cacheService.invalidatePattern('.*residents.*');
    this.cacheService.invalidate('resident_stats');
  }

  async deleteUser(userId: string) {
    try {
      const response = await this.database.deleteDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        userId
      );

      // Invalidate caches
      this.invalidateResidentCaches();
      
      return response;
    } catch (error) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  }

  // Pending approval methods
  async getPendingResidents(): Promise<ResidentInfo[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.equal('approvalStatus', 'Pending'),
          Query.orderDesc('$createdAt'),
          Query.limit(100) // Limit to reasonable number of pending requests
        ]
      );

      // Get user documents for each resident to include role information
      const residents: ResidentInfo[] = [];
      for (const doc of response.documents) {
        if (doc['userId']) {
          // Get user document to fetch role
          const userResponse = await this.database.listDocuments(
            environment.appwriteDatabaseId,
            environment.userCollectionId,
            [Query.equal('uid', doc['userId'])]
          );

          const userRole = userResponse.documents.length > 0 ? userResponse.documents[0]['role'] : 'resident';
          residents.push(this.mapToResidentInfo(doc, userRole));
        }
      }

      return residents;
    } catch (error) {
      console.error('Error fetching pending residents:', error);
      throw error;
    }
  }

  async approveResident(residentId: string, userId: string): Promise<void> {
    try {
      // First, get resident info for email notification
      const residentDoc = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );

      // Update resident document
      await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId,
        {
          approvalStatus: 'Approved',
          approvedAt: new Date().toISOString()
        }
      );

      // Update user document to set is_active to true
      const userResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [Query.equal('uid', userId)]
      );

      if (userResponse.documents.length > 0) {
        await this.database.updateDocument(
          environment.appwriteDatabaseId,
          environment.userCollectionId,
          userResponse.documents[0].$id,
          {
            is_active: true
          }
        );
      }

      // Note: Household is NOT created automatically.
      // Users can create their own household or be added as members by existing household heads
      // via the household management page.

      // Send approval email notification
      const emailData: EmailNotificationData = {
        userEmail: residentDoc['email'],
        userName: `${residentDoc['firstName']} ${residentDoc['lastName']}`,
        isApproved: true
      };

      // Send email in background (don't block the approval process)
      this.emailService.sendRegistrationStatusEmail(emailData).catch(error => {
        console.error('Failed to send approval email:', error);
        // Log but don't throw - email failure shouldn't affect approval
      });

      // Invalidate caches
      this.invalidateResidentCaches();
      
      console.log(`Resident ${residentDoc['firstName']} ${residentDoc['lastName']} approved successfully. Email notification sent to ${residentDoc['email']}`);
    } catch (error) {
      console.error('Error approving resident:', error);
      throw error;
    }
  }

  async rejectResident(residentId: string, reason?: string): Promise<void> {
    try {
      // First, get resident info for email notification BEFORE deletion
      const residentDoc = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );

      // Get the userId to delete from users collection as well
      const userId = residentDoc['userId'];

      // Send rejection email notification BEFORE deletion
      const emailData: EmailNotificationData = {
        userEmail: residentDoc['email'],
        userName: `${residentDoc['firstName']} ${residentDoc['lastName']}`,
        isApproved: false,
        reason: reason
      };

      // Send email first (don't wait for it to complete)
      this.emailService.sendRegistrationStatusEmail(emailData).catch(error => {
        console.error('Failed to send rejection email:', error);
        // Log but don't throw - email failure shouldn't affect rejection
      });

      // Delete from residents collection
      await this.database.deleteDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );

      // Delete from users collection if userId exists
      if (userId) {
        try {
          // Find the user document by uid
          const userResponse = await this.database.listDocuments(
            environment.appwriteDatabaseId,
            environment.userCollectionId,
            [Query.equal('uid', userId)]
          );

          // Delete the user document if found
          if (userResponse.documents.length > 0) {
            await this.database.deleteDocument(
              environment.appwriteDatabaseId,
              environment.userCollectionId,
              userResponse.documents[0].$id
            );
          }
        } catch (userDeleteError) {
          console.error('Error deleting user document:', userDeleteError);
          // Continue - resident is already deleted
        }
      }

      // Invalidate caches
      this.invalidateResidentCaches();
      
      console.log(`Resident ${residentDoc['firstName']} ${residentDoc['lastName']} rejected and completely removed from system. Email notification sent to ${residentDoc['email']}`);
    } catch (error) {
      console.error('Error rejecting resident:', error);
      throw error;
    }
  }

}
