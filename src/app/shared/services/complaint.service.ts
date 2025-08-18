import { Injectable } from '@angular/core';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { ID, Query, Storage } from 'appwrite';
import { environment } from '../../environment/environment';
import { Complaint, NewComplaint } from '../types/complaint';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService extends BaseAppwriteService {
  // Add the override keyword to the storage property
  protected override storage: Storage;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    // Add the override keyword to the router parameter
    protected override router: Router
  ) {
    super(router);
    this.storage = new Storage(this.client);
  }

  // Get all complaints for the current logged-in user
  async getUserComplaints(): Promise<Complaint[]> {
    try {
      const account = await this.authService.getAccount();
      if (!account) throw new Error('User not authenticated');

      const response = await this.database.listDocuments( // Fix: database not databases
        environment.appwriteDatabaseId,
        environment.complaintsCollectionId,
        [Query.equal('userId', account.$id)]
      );

      return response.documents as unknown as Complaint[];
    } catch (error) {
      console.error('Error fetching user complaints:', error);
      return [];
    }
  }

  // Get all complaints (for admin)
  async getAllComplaints(): Promise<Complaint[]> {
    try {
      const response = await this.database.listDocuments( // Fix: database not databases
        environment.appwriteDatabaseId,
        environment.complaintsCollectionId
      );

      return response.documents as unknown as Complaint[];
    } catch (error) {
      console.error('Error fetching all complaints:', error);
      return [];
    }
  }

  // Submit a new complaint
  async submitComplaint(complaint: NewComplaint): Promise<Complaint | null> {
    try {
      const account = await this.authService.getAccount();
      if (!account) throw new Error('User not authenticated');

      // Get resident info to associate with complaint
      const residentInfo = await this.userService.getUserInformation(account.$id);
      
      let attachmentId = '';
      
      // If there's an attachment, upload it first
      if (complaint.attachments) {
        try {
          console.log('Uploading attachment to profile_images bucket...');
          // Use the profile_images bucket that's already working
          const file = await this.storage.createFile(
            environment.profileImagesBucketId,  // Use your working bucket
            ID.unique(),
            complaint.attachments
          );
          
          console.log('Attachment uploaded successfully, ID:', file.$id);
          
          // Generate a view URL for the file
          const fileUrl = this.storage.getFileView(
            environment.profileImagesBucketId,
            file.$id
          );
          
          // Store the complete URL instead of just the ID
          attachmentId = fileUrl.href;
          console.log('Generated attachment URL:', attachmentId);
        } catch (error) {
          console.error('Error uploading attachment:', error);
          throw error; // Re-throw to be caught by the outer try/catch
        }
      }
      
      // Create the complaint document
      const now = new Date().toISOString();
      const complaintData = {
        userId: account.$id,
        residentId: residentInfo?.$id || '',
        subject: complaint.subject,
        description: complaint.description,
        category: complaint.category,
        status: 'pending' as const, // Type assertion to match enum
        attachments: attachmentId,
        createdAt: now,
      };
      
      const response = await this.database.createDocument( // Fix: database not databases
        environment.appwriteDatabaseId,
        environment.complaintsCollectionId,
        ID.unique(),
        complaintData
      );
      
      return response as unknown as Complaint;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return null;
    }
  }

  // Update complaint status and response (admin only)
  async updateComplaint(
    complaintId: string, 
    status: 'pending' | 'in_review' | 'resolved' | 'rejected', // Fixed type to match Complaint interface
    barangayResponse?: string
  ): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      const data: any = {
        status,
        updatedAt: now
      };
      
      if (barangayResponse) {
        data.barangayResponse = barangayResponse;
      }
      
      await this.database.updateDocument( // Fix: database not databases
        environment.appwriteDatabaseId,
        environment.complaintsCollectionId,
        complaintId,
        data
      );
      
      return true;
    } catch (error) {
      console.error('Error updating complaint:', error);
      return false;
    }
  }

  // Get attachment URL
  getAttachmentUrl(fileUrl: string): string {
    // If the attachment is already a full URL, just return it
    if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
      return fileUrl;
    }
    
    // If it's just an ID, generate the URL (backward compatibility)
    try {
      if (fileUrl) {
        return this.storage.getFileView(
          environment.profileImagesBucketId,
          fileUrl
        ).href;
      }
    } catch (error) {
      console.error('Error getting attachment URL:', error);
    }
    
    return '';
  }

  // Delete a complaint (admin only)
  async deleteComplaint(complaintId: string): Promise<boolean> {
    try {
      await this.database.deleteDocument( // Fix: database not databases
        environment.appwriteDatabaseId,
        environment.complaintsCollectionId,
        complaintId
      );
      return true;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      return false;
    }
  }
}