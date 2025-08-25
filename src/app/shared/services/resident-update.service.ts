import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { ResidentUpdate, ResidentUpdateRequest, ResidentUpdateReview } from '../types/resident-update';
import { ResidentInfo } from '../types/resident';
import { Query, ID } from 'appwrite';

@Injectable({
  providedIn: 'root'
})
export class ResidentUpdateService extends BaseAppwriteService {

  constructor(router: Router) {
    super(router);
  }

  /**
   * Submit a request to update resident information
   */
  async submitUpdateRequest(request: ResidentUpdateRequest): Promise<ResidentUpdate> {
    try {
      const updateData = {
        residentId: request.residentId,
        userId: request.userId,
        changesJSON: JSON.stringify(request.changes),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      const response = await this.database.createDocument(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId, // We'll need to add this to environment
        ID.unique(),
        updateData
      );

      return response as unknown as ResidentUpdate;
    } catch (error) {
      console.error('Error submitting update request:', error);
      throw error;
    }
  }

  /**
   * Get update requests for a specific user
   */
  async getUserUpdateRequests(userId: string): Promise<ResidentUpdate[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents as unknown as ResidentUpdate[];
    } catch (error) {
      console.error('Error fetching user update requests:', error);
      throw error;
    }
  }

  /**
   * Get all pending update requests (for admin)
   */
  async getPendingUpdateRequests(): Promise<ResidentUpdate[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId,
        [
          Query.equal('status', 'pending'),
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents as unknown as ResidentUpdate[];
    } catch (error) {
      console.error('Error fetching pending update requests:', error);
      throw error;
    }
  }

  /**
   * Get all update requests (for admin)
   */
  async getAllUpdateRequests(): Promise<ResidentUpdate[]> {
    try {
      const response = await this.database.listDocuments(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId,
        [
          Query.orderDesc('createdAt')
        ]
      );

      return response.documents as unknown as ResidentUpdate[];
    } catch (error) {
      console.error('Error fetching all update requests:', error);
      throw error;
    }
  }

  /**
   * Get resident information by resident ID
   */
  async getResidentById(residentId: string): Promise<ResidentInfo | null> {
    try {
      const response = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentCollectionId,
        residentId
      );
      
      // Transform the raw document to match ResidentInfo structure
      const residentInfo: ResidentInfo = {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        $permissions: response.$permissions,
        personalInfo: {
          lastName: response['lastName'] || '',
          firstName: response['firstName'] || '',
          middleName: response['middleName'] || '',
          suffix: response['suffix'] || '',
          gender: response['gender'] || '',
          birthDate: response['birthDate'] || '',
          birthPlace: response['birthPlace'] || '',
          age: response['age'] || 0,
          civilStatus: response['civilStatus'] || '',
          nationality: response['nationality'] || '',
          religion: response['religion'] || '',
          occupation: response['occupation'] || '',
          contactNo: response['contactNo'] || '',
          pwd: response['pwd'] || '',
          pwdIdNo: response['pwdIdNo'] || '',
          monthlyIncome: response['monthlyIncome'] || 0,
          indigent: response['indigent'] || '',
          soloParent: response['soloParent'] || '',
          soloParentIdNo: response['soloParentIdNo'] || '',
          seniorCitizen: response['seniorCitizen'] || '',
          seniorCitizenIdNo: response['seniorCitizenIdNo'] || '',
          fourPsMember: response['fourPsMember'] || '',
          registeredVoter: response['registeredVoter'] || '',
          purokNo: response['purokNo'] || '',
          houseNo: response['houseNo'] || '',
          street: response['street'] || ''
        },
        emergencyContact: {
          fullName: response['ecFullName'] || '',
          relationship: response['ecRelation'] || '',
          contactNo: response['ecContactNo'] || '',
          address: response['ecAddress'] || ''
        },
        otherDetails: {
          nationalIdNo: response['nationalIdNo'] || '',
          votersIdNo: response['votersIdNo'] || '',
          covidStatus: response['covidStatus'] || '',
          vaccinated: response['vaccinated'] || '',
          deceased: response['deceased'] || '',
          dateOfRegistration: response['dateOfRegistration'] || ''
        }
      };
      
      return residentInfo;
    } catch (error) {
      console.error('Error fetching resident by ID:', residentId, error);
      return null;
    }
  }

  /**
   * Review an update request (approve or reject)
   */
  async reviewUpdateRequest(review: ResidentUpdateReview): Promise<void> {
    try {
      const updateRequest = await this.database.getDocument(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId,
        review.updateId
      ) as unknown as ResidentUpdate;

      if (review.action === 'approve') {
        // Apply the changes to the resident document
        const changes = JSON.parse(updateRequest.changesJSON);
        const flattenedChanges = this.flattenChangesForDatabase(changes);
        
        await this.database.updateDocument(
          environment.appwriteDatabaseId,
          environment.residentCollectionId,
          updateRequest.residentId,
          flattenedChanges
        );
      }

      // Update the request status
      await this.database.updateDocument(
        environment.appwriteDatabaseId,
        environment.residentUpdatesCollectionId,
        review.updateId,
        {
          status: review.action === 'approve' ? 'approved' : 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: review.reviewedBy,
          reason: review.reason || ''
        }
      );
    } catch (error) {
      console.error('Error reviewing update request:', error);
      throw error;
    }
  }

  /**
   * Parse changes JSON to get human-readable field names and values
   */
  parseChanges(changesJSON: string, originalData?: ResidentInfo): Array<{field: string, oldValue: any, newValue: any}> {
    try {
      const changes = JSON.parse(changesJSON);
      const result: Array<{field: string, oldValue: any, newValue: any}> = [];
      
      Object.keys(changes).forEach(key => {
        if (typeof changes[key] === 'object' && changes[key] !== null) {
          // Handle nested objects like personalInfo, emergencyContact, etc.
          Object.keys(changes[key]).forEach(subKey => {
            const fieldLabel = this.getFieldLabel(key, subKey);
            const oldValue = originalData ? this.getNestedValue(originalData, key, subKey) : '';
            result.push({
              field: fieldLabel,
              oldValue: oldValue,
              newValue: changes[key][subKey]
            });
          });
        } else {
          const fieldLabel = this.getFieldLabel(key);
          const oldValue = originalData ? (originalData as any)[key] : '';
          result.push({
            field: fieldLabel,
            oldValue: oldValue,
            newValue: changes[key]
          });
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error parsing changes:', error);
      return [];
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, key: string, subKey: string): any {
    return obj && obj[key] && obj[key][subKey] ? obj[key][subKey] : '';
  }

  /**
   * Get human-readable field labels
   */
  private getFieldLabel(category: string, field?: string): string {
    const fieldLabels: Record<string, Record<string, string> | string> = {
      personalInfo: {
        firstName: 'First Name',
        lastName: 'Last Name',
        middleName: 'Middle Name',
        suffix: 'Suffix',
        gender: 'Gender',
        birthDate: 'Birth Date',
        birthPlace: 'Birth Place',
        civilStatus: 'Civil Status',
        nationality: 'Nationality',
        religion: 'Religion',
        occupation: 'Occupation',
        contactNo: 'Contact Number',
        pwd: 'PWD',
        pwdIdNo: 'PWD ID Number',
        monthlyIncome: 'Monthly Income',
        indigent: 'Indigent',
        soloParent: 'Solo Parent',
        soloParentIdNo: 'Solo Parent ID Number',
        seniorCitizen: 'Senior Citizen',
        seniorCitizenIdNo: 'Senior Citizen ID Number',
        fourPsMember: '4Ps Member',
        registeredVoter: 'Registered Voter',
        purokNo: 'Purok Number',
        houseNo: 'House Number',
        street: 'Street'
      },
      emergencyContact: {
        fullName: 'Emergency Contact Name',
        relationship: 'Relationship',
        contactNo: 'Emergency Contact Number',
        address: 'Emergency Contact Address'
      },
      otherDetails: {
        nationalIdNo: 'National ID Number',
        votersIdNo: 'Voter\'s ID Number',
        covidStatus: 'COVID Status',
        vaccinated: 'Vaccinated',
        deceased: 'Deceased',
        dateOfRegistration: 'Date of Registration'
      }
    };

    if (field && typeof fieldLabels[category] === 'object') {
      return (fieldLabels[category] as Record<string, string>)[field] || `${category}.${field}`;
    }
    
    return fieldLabels[category] as string || category;
  }

  /**
   * Flatten nested changes to match database schema
   */
  private flattenChangesForDatabase(changes: any): any {
    const flattened: any = {};
    
    Object.keys(changes).forEach(key => {
      if (key === 'personalInfo' && typeof changes[key] === 'object') {
        // Map personalInfo fields directly to root level
        Object.keys(changes[key]).forEach(field => {
          flattened[field] = changes[key][field];
        });
      } else if (key === 'emergencyContact' && typeof changes[key] === 'object') {
        // Map emergencyContact fields with 'ec' prefix
        Object.keys(changes[key]).forEach(field => {
          if (field === 'fullName') {
            flattened['ecFullName'] = changes[key][field];
          } else if (field === 'relationship') {
            flattened['ecRelation'] = changes[key][field];
          } else if (field === 'contactNo') {
            flattened['ecContactNo'] = changes[key][field];
          } else if (field === 'address') {
            flattened['ecAddress'] = changes[key][field];
          }
        });
      } else if (key === 'otherDetails' && typeof changes[key] === 'object') {
        // Map otherDetails fields directly to root level
        Object.keys(changes[key]).forEach(field => {
          flattened[field] = changes[key][field];
        });
      } else {
        // Direct field mapping
        flattened[key] = changes[key];
      }
    });
    
    return flattened;
  }
}
