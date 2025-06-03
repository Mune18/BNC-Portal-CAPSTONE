import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseAppwriteService {

  constructor(
    router: Router
  ) {
    super(router);
  }
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
