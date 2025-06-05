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
      // Query for documents where uid equals the account ID
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        [
          // Use a query to find where uid equals the account ID
          Query.equal('uid', accountId)
        ]
      );
      
      // If a matching document was found, return the first one
      if (response.documents.length > 0) {
        return response.documents[0] as unknown as ResidentInfo;
      }
      
      return null; // No matching document found
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
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
}
