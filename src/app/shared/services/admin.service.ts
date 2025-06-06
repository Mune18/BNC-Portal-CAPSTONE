import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { environment } from '../../environment/environment';
import { Query } from 'appwrite';
import { ResidentInfo } from '../types/resident';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseAppwriteService {

  constructor(
    router: Router
  ) {
    super(router);
  }

  // Add this new method to fetch all residents
  async getAllResidents() {
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
        covidStatus: doc.covidStatus || '',
        vaccinated: doc.vaccinated || '',
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

  async deleteUser(userId: string) {
    try {
      const response = await this.database.deleteDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        userId
      );
      return response;
    } catch (error) {
      console.error('Error deleting user document:', error);
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
}
