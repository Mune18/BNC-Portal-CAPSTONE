import { Injectable } from '@angular/core';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { ID, Query, Storage } from 'appwrite';
import { environment } from '../../environment/environment';
import { Announcement, NewAnnouncement } from '../types/announcement';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService extends BaseAppwriteService {
  protected override storage: Storage;

  constructor(
    private authService: AuthService,
    protected override router: Router
  ) {
    super(router);
    this.storage = new Storage(this.client);
  }

  // Get all announcements (admin view)
  async getAllAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        [Query.orderDesc('createdAt')]
      );

      return response.documents as unknown as Announcement[];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  }

  // Get active announcements only (resident view)
  async getActiveAnnouncements(): Promise<Announcement[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        [
          Query.equal('status', 'active'),
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents as unknown as Announcement[];
    } catch (error) {
      console.error('Error fetching active announcements:', error);
      return [];
    }
  }

  // Create a new announcement
  async createAnnouncement(announcement: NewAnnouncement): Promise<Announcement | null> {
    try {
      const account = await this.authService.getAccount();
      if (!account) throw new Error('User not authenticated');

      let imageUrl = '';
      
      // If there's an image, upload it first
      if (announcement.image) {
        try {
          console.log('Uploading announcement image...');
          const file = await this.storage.createFile(
            environment.profileImagesBucketId, // Reuse the profile images bucket
            ID.unique(),
            announcement.image
          );
          
          console.log('Image uploaded successfully, ID:', file.$id);
          
          // Generate a view URL for the file
          const fileUrl = this.storage.getFileView(
            environment.profileImagesBucketId,
            file.$id
          );
          
          // Store the complete URL
          imageUrl = fileUrl.href;
          console.log('Generated image URL:', imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      }
      
      // Create the announcement document
      const now = new Date().toISOString();
      const announcementData = {
        title: announcement.title,
        content: announcement.content,
        authorId: account.$id,
        image: imageUrl,
        createdAt: now,
        status: 'active' as const
      };
      
      const response = await this.database.createDocument(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        ID.unique(),
        announcementData
      );
      
      return response as unknown as Announcement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return null;
    }
  }

  // Update an announcement
  async updateAnnouncement(
    id: string, 
    title: string, 
    content: string, 
    image?: File, 
    status?: 'active' | 'archived'
  ): Promise<Announcement | null> {
    try {
      let data: any = {
        title,
        content,
        updatedAt: new Date().toISOString()
      };
      
      if (status) {
        data.status = status;
      }
      
      // If there's a new image, upload it first
      if (image) {
        const file = await this.storage.createFile(
          environment.profileImagesBucketId,
          ID.unique(),
          image
        );
        
        const fileUrl = this.storage.getFileView(
          environment.profileImagesBucketId,
          file.$id
        );
        
        data.image = fileUrl.href;
      }
      
      const response = await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        id,
        data
      );
      
      return response as unknown as Announcement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return null;
    }
  }

  // Archive an announcement
  async archiveAnnouncement(id: string): Promise<boolean> {
    try {
      await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        id,
        {
          status: 'archived',
          updatedAt: new Date().toISOString()
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error archiving announcement:', error);
      return false;
    }
  }

  // Delete an announcement
  async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      await this.database.deleteDocument(
        environment.appwriteDatabaseId,
        environment.announcementCollectionId,
        id
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  }

  // Get image URL
  getImageUrl(imageUrl: string): string {
    // If the image URL is already a full URL, just return it
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    
    // If it's just an ID, generate the URL (backward compatibility)
    try {
      if (imageUrl) {
        return this.storage.getFileView(
          environment.profileImagesBucketId,
          imageUrl
        ).href;
      }
    } catch (error) {
      console.error('Error getting image URL:', error);
    }
    
    return '';
  }
}