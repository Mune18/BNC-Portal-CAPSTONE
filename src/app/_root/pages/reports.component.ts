import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';
import { ComplaintService } from '../../shared/services/complaint.service';
import { Complaint, ComplaintStatus } from '../../shared/types/complaint';
import { UserService } from '../../shared/services/user.service';
import { ResidentInfo } from '../../shared/types/resident';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusFormatPipe],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div *ngIf="!loading" class="mb-8">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Complaints and Reports</h1>
            <p class="text-gray-500">Manage and respond to complaints submitted by residents</p>
          </div>
          <!-- Filter Controls -->
          <div class="mt-4 sm:mt-0 flex items-center space-x-4">
            <select 
              [(ngModel)]="statusFilter" 
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select 
              [(ngModel)]="categoryFilter" 
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="complaint">Complaints</option>
              <option value="report">Reports</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <!-- Complaints Grid - MODIFIED TO USE FULL WIDTH -->
        <div>
          <!-- Main Complaints List -->
          <div class="flex flex-col gap-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-6">Complaints</h2>
              <div *ngIf="filteredComplaints.length > 0; else noComplaints">
                <!-- Modified grid to use 3 columns on large screens -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div
                    *ngFor="let complaint of filteredComplaints"
                    class="bg-white rounded-2xl shadow-lg p-5 pb-9 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                    (click)="selectComplaint(complaint)"
                  >
                    <!-- Status Badge -->
                    <div class="absolute bottom-3 right-4 z-10">
                      <span 
                        class="px-2 py-1 text-xs font-medium rounded-full" 
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800': complaint.status === 'pending',
                          'bg-blue-100 text-blue-800': complaint.status === 'in_review',
                          'bg-green-100 text-green-800': complaint.status === 'resolved',
                          'bg-red-100 text-red-800': complaint.status === 'rejected'
                        }"
                      >
                        {{ complaint.status | statusFormat }}
                      </span>
                    </div>
                    
                    <!-- 3 dots menu -->
                    <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
                      <button (click)="toggleMenu(complaint.$id || '')" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                          <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                          <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                        </svg>
                      </button>
                      <div *ngIf="openMenuId === complaint.$id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                        <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteComplaint(complaint.$id)">Delete</button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 class="text-lg font-bold text-gray-800 mb-1 mt-2">{{ complaint.subject }}</h3>
                      <p class="text-gray-600 text-sm mb-2 truncate">{{ complaint.description }}</p>
                      <p class="text-xs text-gray-500">
                        Submitted by {{ getResidentName(complaint.userId) }} on {{ complaint.createdAt | date:'medium' }}
                      </p>
                      <p *ngIf="complaint.attachments" class="text-xs text-blue-500 mt-1">Has attachment</p>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noComplaints>
                <p class="text-gray-600">No complaints available matching the current filters.</p>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Complaint Detail Modal -->
      <div
        *ngIf="selectedComplaint"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="selectedComplaint = null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto">
          <button
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            (click)="selectedComplaint = null"
          >✕</button>
          
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            Complaint Details
            <span 
              class="ml-4 px-2 py-1 text-xs font-medium rounded-full" 
              [ngClass]="{
                'bg-yellow-100 text-yellow-800': selectedComplaint.status === 'pending',
                'bg-blue-100 text-blue-800': selectedComplaint.status === 'in_review',
                'bg-green-100 text-green-800': selectedComplaint.status === 'resolved',
                'bg-red-100 text-red-800': selectedComplaint.status === 'rejected'
              }"
            >
              {{ selectedComplaint.status | statusFormat }}
            </span>
          </h2>
          
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-500">Submitted by</p>
                <p class="font-medium">{{ getResidentName(selectedComplaint.userId) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Date Submitted</p>
                <p class="font-medium">{{ selectedComplaint.createdAt | date:'medium' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Category</p>
                <p class="font-medium">{{ selectedComplaint.category | titlecase }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Last Updated</p>
                <p class="font-medium">{{ selectedComplaint.updatedAt ? (selectedComplaint.updatedAt | date:'medium') : 'Not updated yet' }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">Subject</p>
              <p class="text-xl font-bold">{{ selectedComplaint.subject }}</p>
            </div>
            
            <div class="mb-4">
              <p class="text-sm text-gray-500">Description</p>
              <p class="whitespace-pre-line">{{ selectedComplaint.description }}</p>
            </div>
            
            <!-- Attachment Preview -->
            <div *ngIf="selectedComplaint.attachments" class="mb-6">
              <p class="text-sm text-gray-500 mb-2">Attachment</p>
              <div class="border rounded-lg p-3">
                <img 
                  *ngIf="isImageAttachment(selectedComplaint.attachments)" 
                  [src]="getAttachmentUrl(selectedComplaint.attachments)" 
                  alt="Attachment" 
                  class="max-w-full h-auto rounded"
                >
                <a 
                  *ngIf="!isImageAttachment(selectedComplaint.attachments)"
                  [href]="getAttachmentUrl(selectedComplaint.attachments)" 
                  target="_blank"
                  class="text-blue-600 hover:underline flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"></path>
                  </svg>
                  View Attachment
                </a>
              </div>
            </div>
            
            <!-- Previous Response (if any) -->
            <div *ngIf="selectedComplaint.barangayResponse" class="mb-6">
              <p class="text-sm text-gray-500">Current Response</p>
              <p class="italic border-l-4 border-gray-300 pl-3 py-2">{{ selectedComplaint.barangayResponse }}</p>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <h3 class="font-semibold text-gray-900 mb-3">Update Status & Reply</h3>
            <form (submit)="replyToComplaint($event)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <div class="flex flex-wrap gap-3">
                  <label 
                    *ngFor="let status of statusOptions" 
                    class="flex items-center p-2 border rounded-lg cursor-pointer transition"
                    [class.bg-blue-50]="statusToUpdate === status.value"
                    [class.border-blue-300]="statusToUpdate === status.value"
                    [class.border-gray-200]="statusToUpdate !== status.value"
                  >
                    <input 
                      type="radio" 
                      [value]="status.value" 
                      [(ngModel)]="statusToUpdate" 
                      name="status" 
                      class="mr-2"
                    >
                    <span>{{ status.label }}</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label for="reply" class="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                <textarea 
                  id="reply" 
                  [(ngModel)]="replyMessage" 
                  name="reply" 
                  rows="4" 
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your reply to the resident"
                ></textarea>
              </div>
              
              <div class="flex justify-end gap-2">
                <button 
                  type="button"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  (click)="selectedComplaint = null"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  [disabled]="isSubmitting"
                >
                  <span *ngIf="!isSubmitting">Update & Send Reply</span>
                  <span *ngIf="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Custom Notification Modal -->
      <div 
        *ngIf="showNotificationModal"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div 
          class="absolute inset-0 backdrop-blur-md bg-black/30"
          (click)="closeNotification()"
        ></div>
        <div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md z-10">
          <div class="text-center">
            <!-- Success icon without the green background strip -->
            <div class="mx-auto flex items-center justify-center mb-4">
              <svg *ngIf="notificationType === 'success'" class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <svg *ngIf="notificationType === 'error'" class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ notificationType === 'success' ? 'Success!' : 'Error' }}
            </h3>
            <p class="text-gray-600 mb-6">{{ notificationMessage }}</p>
            <button
              (click)="closeNotification()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <!-- New Delete Confirmation Modal -->
      <div 
        *ngIf="showDeleteConfirmation"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div 
          class="absolute inset-0 backdrop-blur-md bg-black/30"
          (click)="cancelDelete()"
        ></div>
        <div class="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Confirm Deletion</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this complaint?</p>
            <div class="flex justify-center space-x-4">
              <button
                (click)="cancelDelete()"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                (click)="confirmDelete()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fixed {
      position: fixed;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .z-50 {
      z-index: 50;
    }
    select {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>');
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      padding-right: 2.5rem; /* Ensure space for the arrow */
    }
  `]
})
export class ReportsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  residentMap: { [key: string]: string } = {}; // Maps userId to resident name
  
  loading = true;
  isSubmitting = false;
  selectedComplaint: Complaint | null = null;
  replyMessage: string = '';
  statusToUpdate: ComplaintStatus = 'pending'; // Fix: Use the proper type
  openMenuId: string | null = null;
  
  // Filters
  statusFilter: string = 'all';
  categoryFilter: string = 'all';

  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_review', label: 'In Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Notification system properties
  showNotificationModal = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  
  // New delete confirmation properties
  showDeleteConfirmation = false;
  complaintToDeleteId: string | null = null;
  
  constructor(
    private complaintService: ComplaintService,
    private userService: UserService
  ) {}
  
  async ngOnInit() {
    await this.loadComplaints();
  }

  async loadComplaints() {
    this.loading = true;
    try {
      this.complaints = await this.complaintService.getAllComplaints();
      
      // Sort by newest first
      this.complaints.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      // Preload resident information for display
      for (const complaint of this.complaints) {
        if (!this.residentMap[complaint.userId]) {
          try {
            const residentInfo = await this.userService.getUserInformation(complaint.userId);
            if (residentInfo) {
              this.residentMap[complaint.userId] = `${residentInfo.personalInfo.firstName} ${residentInfo.personalInfo.lastName}`;
            } else {
              this.residentMap[complaint.userId] = 'Unknown Resident';
            }
          } catch (error) {
            console.error('Error fetching resident info:', error);
            this.residentMap[complaint.userId] = 'Unknown Resident';
          }
        }
      }
      
      this.applyFilters();
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      this.loading = false;
    }
  }

  applyFilters() {
    this.filteredComplaints = this.complaints.filter(complaint => {
      // Apply status filter
      if (this.statusFilter !== 'all' && complaint.status !== this.statusFilter) {
        return false;
      }
      
      // Apply category filter
      if (this.categoryFilter !== 'all' && complaint.category !== this.categoryFilter) {
        return false;
      }
      
      return true;
    });
  }

  selectComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.statusToUpdate = complaint.status;
    this.replyMessage = complaint.barangayResponse || '';
  }

  toggleMenu(id: string | undefined) {
    // Fix: Handle potential undefined
    if (!id) return;
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  // UPDATED: Start deletion process with confirmation
  deleteComplaint(id: string) {
    this.complaintToDeleteId = id;
    this.showDeleteConfirmation = true;
  }
  
  // NEW: Cancel deletion
  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.complaintToDeleteId = null;
  }
  
  // NEW: Confirm and execute deletion
  async confirmDelete() {
    if (!this.complaintToDeleteId) return;
    
    const id = this.complaintToDeleteId;
    this.showDeleteConfirmation = false;
    this.complaintToDeleteId = null;
    
    try {
      const success = await this.complaintService.deleteComplaint(id);
      if (success) {
        this.complaints = this.complaints.filter(c => c.$id !== id);
        this.applyFilters();
        if (this.openMenuId === id) this.openMenuId = null;
        if (this.selectedComplaint && this.selectedComplaint.$id === id) this.selectedComplaint = null;
        this.showSuccessNotification('Complaint deleted successfully.');
      } else {
        this.showErrorNotification('Failed to delete complaint.');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      this.showErrorNotification('An error occurred while deleting the complaint.');
    }
  }

  async replyToComplaint(event: Event) {
    event.preventDefault();
    
    if (!this.selectedComplaint || !this.statusToUpdate) {
      alert('Please select a status.');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      // Use optional chaining and nullish coalescing to handle potential undefined
      const complaintId = this.selectedComplaint.$id || '';
      
      const success = await this.complaintService.updateComplaint(
        complaintId,
        this.statusToUpdate, // Now properly typed
        this.replyMessage
      );
      
      if (success) {
        // Update the local complaint
        const index = this.complaints.findIndex(c => c.$id === this.selectedComplaint!.$id);
        if (index !== -1) {
          this.complaints[index] = {
            ...this.complaints[index],
            status: this.statusToUpdate, // Now properly typed
            barangayResponse: this.replyMessage,
            updatedAt: new Date().toISOString()
          };
          this.applyFilters();
        }
        
        this.showSuccessNotification('Complaint updated successfully.');
        this.selectedComplaint = null;
      } else {
        this.showErrorNotification('Failed to update complaint.');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      this.showErrorNotification('An error occurred while updating the complaint.');
    } finally {
      this.isSubmitting = false;
    }
  }

  showSuccessNotification(message: string) {
    this.notificationType = 'success';
    this.notificationMessage = message;
    this.showNotificationModal = true;
  }
  
  showErrorNotification(message: string) {
    this.notificationType = 'error';
    this.notificationMessage = message;
    this.showNotificationModal = true;
  }
  
  closeNotification() {
    this.showNotificationModal = false;
  }
  
  getResidentName(userId: string): string {
    return this.residentMap[userId] || 'Unknown Resident';
  }

  getAttachmentUrl(fileId: string): string {
    return this.complaintService.getAttachmentUrl(fileId);
  }

  isImageAttachment(fileUrl: string): boolean {
    // Works with both full URLs and file IDs
    if (!fileUrl) return false;
    return fileUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) !== null;
  }
}
