import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseAppwriteService {

  constructor(
    router: Router
  ) {
    super(router);
  }

  async getUserInformation(userId: string): Promise<User | null> {
    try {
      const userDoc = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.userCollectionId,
        userId
      ) as unknown as User;
      
      return userDoc;
    } catch (error) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }
}
