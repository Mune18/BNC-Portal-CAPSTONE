import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { environment } from '../../environment/environment';
import { Query } from 'appwrite';
import { ResidentInfo } from '../types/resident';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseAppwriteService {

  constructor(
    router: Router,
    private cacheService: CacheService
  ) {
    super(router);
  }

  // Fast method to get resident counts and basic stats without full data
  async getResidentStats() {
    const cacheKey = 'resident_stats';
    const cached = this.cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      // Get total count
      const totalResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [Query.select(['$id'])]
      );

      // Get active residents (non-deceased)
      const activeResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id']),
          Query.notEqual('deceased', 'Deceased')
        ]
      );

      // Get recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentResponse = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          Query.select(['$id']),
          Query.greaterThan('$createdAt', thirtyDaysAgo.toISOString())
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
          Query.limit(limit)
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
        deceased: '',
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
          Query.orderDesc('$createdAt')
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
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        [
          // Add any filters if needed
          // Query.limit(100) // Consider adding pagination
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
        deceased: doc.deceased || '',
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
        deceased: residentData.otherDetails.deceased,
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
}
