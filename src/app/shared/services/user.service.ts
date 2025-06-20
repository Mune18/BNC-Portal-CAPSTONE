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
          covidStatus: residentDoc['covidStatus'] || '',
          vaccinated: residentDoc['vaccinated'] || '',
          deceased: residentDoc['deceased'] || '',
          dateOfRegistration: residentDoc['dateOfRegistration'] || ''
        }
      };
      
      return residentInfo;
    } catch (error) {
      console.error('Error fetching user/resident information:', error);
      return this.getEmptyResidentInfo();
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
        covidStatus: '',
        vaccinated: '',
        deceased: '',
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

  async updateUser(documentId: string, userData: ResidentInfo): Promise<any> {
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
}
