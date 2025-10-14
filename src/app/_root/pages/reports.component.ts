import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';
import { ComplaintService } from '../../shared/services/complaint.service';
import { Complaint, ComplaintStatus } from '../../shared/types/complaint';
import { UserService } from '../../shared/services/user.service';
import { ResidentInfo } from '../../shared/types/resident';
import Swal from 'sweetalert2';

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
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Complaints and Reports</h1>
              <p class="text-gray-500">Manage and respond to complaints submitted by residents</p>
            </div>
            <!-- Filter Controls -->
            <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Status:</label>
                <select 
                  [(ngModel)]="statusFilter" 
                  (change)="applyFilters()"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[140px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Category:</label>
                <select 
                  [(ngModel)]="categoryFilter" 
                  (change)="applyFilters()"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  <option value="complaint">Complaints</option>
                  <option value="report">Reports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Complaints Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Complaints</h2>
          </div>
          
          <div *ngIf="filteredComplaints.length > 0; else noComplaints">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attachment
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    *ngFor="let complaint of filteredComplaints"
                    class="hover:bg-gray-50 cursor-pointer transition-colors"
                    (click)="selectComplaint(complaint)"
                  >
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <div class="text-sm font-medium text-gray-900">{{ complaint.subject }}</div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">{{ complaint.description }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="text-sm text-gray-900">{{ complaint.isAnonymous ? '' : getComplainantName(complaint) }}</div>
                        <span *ngIf="complaint.isAnonymous" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Anonymous
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 capitalize">{{ complaint.category }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ complaint.createdAt | date:'short' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" (click)="$event.stopPropagation()">
                      <a 
                        *ngIf="complaint.attachments" 
                        [href]="getAttachmentUrl(complaint.attachments)" 
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center space-x-1"
                        title="View attachment"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"/>
                        </svg>
                        <span class="text-xs">View</span>
                      </a>
                      <span *ngIf="!complaint.attachments" class="text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="relative" (click)="$event.stopPropagation()">
                        <button 
                          (click)="toggleMenu(complaint.$id || '')" 
                          class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                          </svg>
                        </button>
                        <div 
                          *ngIf="openMenuId === complaint.$id" 
                          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-30"
                        >
                          <button 
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                            (click)="selectComplaint(complaint)"
                          >
                            View Details
                          </button>
                          <button 
                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
                            (click)="deleteComplaint(complaint.$id)"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <ng-template #noComplaints>
            <div class="px-6 py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
              <p class="mt-1 text-sm text-gray-500">No complaints match the current filters.</p>
            </div>
          </ng-template>
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
                <div class="flex items-center">
                  <p class="font-medium">{{ selectedComplaint.isAnonymous ? '' : getComplainantName(selectedComplaint) }}</p>
                  <span *ngIf="selectedComplaint.isAnonymous" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Anonymous Report
                  </span>
                </div>
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
      padding-right: 2.5rem;
      appearance: none;
    }
    
    /* Table hover effects */
    tbody tr:hover {
      background-color: #f9fafb;
    }
    
    /* Ensure dropdown menus appear above other content */
    .relative {
      position: relative;
    }
    
    /* Custom scrollbar for table */
    .overflow-x-auto::-webkit-scrollbar {
      height: 6px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
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

  // UPDATED: Start deletion process with SweetAlert2 confirmation
  async deleteComplaint(id: string) {
    const result = await Swal.fire({
      title: 'Delete Complaint',
      text: 'Are you sure you want to delete this complaint? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#374151',
      width: '400px',
      padding: '2rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0',
        title: 'text-xl font-bold mb-3 text-gray-900',
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-6',
        confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm mr-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
        cancelButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        actions: 'gap-3'
      },
      buttonsStyling: false,
      backdrop: 'rgba(15, 23, 42, 0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (result.isConfirmed) {
      try {
        const success = await this.complaintService.deleteComplaint(id);
        if (success) {
          this.complaints = this.complaints.filter(c => c.$id !== id);
          this.applyFilters();
          if (this.openMenuId === id) this.openMenuId = null;
          if (this.selectedComplaint && this.selectedComplaint.$id === id) this.selectedComplaint = null;
          await this.showCustomAlert('Complaint deleted successfully', 'success');
        } else {
          await this.showCustomAlert('Failed to delete complaint', 'error');
        }
      } catch (error) {
        console.error('Error deleting complaint:', error);
        await this.showCustomAlert('An error occurred while deleting the complaint', 'error');
      }
    }
  }

  async replyToComplaint(event: Event) {
    event.preventDefault();
    
    if (!this.selectedComplaint || !this.statusToUpdate) {
      await this.showCustomAlert('Please select a status', 'warning');
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
        
        await this.showCustomAlert('Complaint updated and reply sent successfully', 'success');
        this.selectedComplaint = null;
      } else {
        await this.showCustomAlert('Failed to update complaint', 'error');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      await this.showCustomAlert('An error occurred while updating the complaint', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  async showCustomAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const config: any = {
      text: message,
      confirmButtonText: 'OK',
      background: '#ffffff',
      color: '#374151',
      timer: 3000,
      timerProgressBar: true,
      width: '350px',
      padding: '1.5rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0 backdrop-blur-sm',
        title: 'text-lg font-bold mb-2 leading-tight',
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-4',
        confirmButton: 'font-semibold py-2 px-5 rounded-lg transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm',
        timerProgressBar: 'rounded-full h-1'
      },
      backdrop: 'rgba(15, 23, 42, 0.3)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false
    };

    if (type === 'success') {
      config.icon = 'success';
      config.title = 'Success!';
      config.iconColor = '#10B981';
      config.customClass.title += ' text-emerald-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-emerald-400 to-emerald-500';
    } else if (type === 'error') {
      config.icon = 'error';
      config.title = 'Error';
      config.iconColor = '#EF4444';
      config.customClass.title += ' text-red-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-red-400 to-red-500';
    } else if (type === 'warning') {
      config.icon = 'warning';
      config.title = 'Warning';
      config.iconColor = '#F59E0B';
      config.customClass.title += ' text-amber-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-amber-400 to-amber-500';
    }

    await Swal.fire(config);
  }
  
  getComplainantName(complaint: Complaint): string {
    if (complaint.isAnonymous) {
      return 'Anonymous';
    }
    return this.residentMap[complaint.userId] || 'Unknown Resident';
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
