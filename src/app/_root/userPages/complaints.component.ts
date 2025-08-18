import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../shared/services/complaint.service';
import { Complaint, NewComplaint } from '../../shared/types/complaint';
import { UserService } from '../../shared/services/user.service';
import { ResidentInfo } from '../../shared/types/resident';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [FormsModule, CommonModule, StatusFormatPipe],
  template: `
  <div class="container mx-auto px-4 py-6">
    <!-- Loading Indicator -->
    <div *ngIf="loading" class="flex justify-center items-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Header Section -->
    <div *ngIf="!loading" class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
        <p class="text-gray-600">Let us know your concerns, and we will address them as soon as possible.</p>
      </div>
      <button
        class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        (click)="openComplaintModal()"
      >
        Submit Complaint
      </button>
    </div>

    <!-- Complaints List -->
    <div *ngIf="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Complaints List -->
      <div class="lg:col-span-2 flex flex-col gap-8">
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Your Complaints</h2>
          <div *ngIf="complaints.length > 0; else noComplaints">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                *ngFor="let complaint of complaints"
                class="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                (click)="viewReply(complaint)"
              >
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
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
                
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-1">{{ complaint.subject }}</h3>
                  <p class="text-gray-600 text-sm mb-2 truncate">{{ complaint.description }}</p>
                  <p class="text-xs text-gray-500">Submitted on {{ complaint.createdAt | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noComplaints>
            <p class="text-gray-600">You have not submitted any complaints yet.</p>
          </ng-template>
        </div>
      </div>
      <!-- Side List: (empty for user, for layout match) -->
      <div class="flex flex-col gap-6"></div>
    </div>

    <!-- Submit Complaint Modal -->
    <div 
      *ngIf="showComplaintModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-black/30"
        (click)="closeComplaintModal()"
      ></div>
      <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full z-10 max-h-[90vh] overflow-y-auto">
        <button 
          (click)="closeComplaintModal()" 
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Submit a Complaint</h2>
        <form (submit)="submitComplaint($event)" class="space-y-4">
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input 
              id="subject" 
              [(ngModel)]="newComplaint.subject" 
              name="subject" 
              type="text" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the subject of your complaint"
              required
            >
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              [(ngModel)]="newComplaint.category"
              name="category"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled selected>Select a category</option>
              <option value="complaint">Complaint</option>
              <option value="report">Report</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="description" 
              [(ngModel)]="newComplaint.description" 
              name="description" 
              rows="4" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your complaint in detail"
              required
            ></textarea>
          </div>
          <div>
            <label for="attachment" class="block text-sm font-medium text-gray-700">Attachment (Optional)</label>
            <div class="mt-1 flex items-center">
              <label class="cursor-pointer bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
                <span>{{ attachmentFileName || 'Choose a file' }}</span>
                <input 
                  type="file" 
                  (change)="onAttachmentChange($event)" 
                  class="hidden" 
                  accept="image/*,.pdf,.doc,.docx"
                >
              </label>
              <button 
                *ngIf="attachmentFileName"
                type="button"
                (click)="removeAttachment()"
                class="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              [disabled]="isSubmitting"
            >
              <span *ngIf="!isSubmitting">Submit Complaint</span>
              <span *ngIf="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reply Modal -->
    <div 
      *ngIf="selectedComplaint" 
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-white/40"
        (click)="closeReply()"
      ></div>
      <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full z-10 max-h-[90vh] overflow-y-auto">
        <button 
          (click)="closeReply()" 
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Complaint Details</h2>
        
        <!-- Status Badge -->
        <div class="mb-3">
          <span 
            class="px-2 py-1 text-xs font-medium rounded-full" 
            [ngClass]="{
              'bg-yellow-100 text-yellow-800': selectedComplaint.status === 'pending',
              'bg-blue-100 text-blue-800': selectedComplaint.status === 'in_review',
              'bg-green-100 text-green-800': selectedComplaint.status === 'resolved',
              'bg-red-100 text-red-800': selectedComplaint.status === 'rejected'
            }"
          >
            {{ selectedComplaint.status | statusFormat }}
          </span>
        </div>
        
        <div class="mb-4">
          <div class="mb-2">
            <span class="text-xs text-gray-400">Submitted on {{ selectedComplaint.createdAt | date:'medium' }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ selectedComplaint.subject }}</h3>
          <p class="text-gray-600 mb-1"><span class="font-semibold">Category:</span> {{ selectedComplaint.category | titlecase }}</p>
          <p class="text-gray-700 mb-4 whitespace-pre-line">{{ selectedComplaint.description }}</p>
          
          <!-- Attachment Preview -->
          <div *ngIf="selectedComplaint.attachments" class="mb-4">
            <h4 class="font-medium text-gray-800 mb-2">Attachment</h4>
            <div class="border rounded-lg p-2">
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
        </div>
        
        <div class="border-t pt-4 mt-4">
          <h3 class="text-base font-semibold text-gray-800 mb-2">Barangay Response</h3>
          <p class="text-gray-600">
            {{ selectedComplaint.barangayResponse || 'Waiting for response from the barangay officials.' }}
          </p>
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
    .max-w-screen-md {
      max-width: 768px;
    }
  `]
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  userInfo: ResidentInfo | null = null;
  loading = true;
  isSubmitting = false;

  newComplaint: NewComplaint = {
    subject: '',
    description: '',
    category: 'complaint'
  };

  attachmentFile: File | null = null;
  attachmentFileName: string = '';

  selectedComplaint: Complaint | null = null;
  showComplaintModal = false;

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
      this.complaints = await this.complaintService.getUserComplaints();
      // Sort by newest first
      this.complaints.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      this.loading = false;
    }
  }

  openComplaintModal() {
    this.showComplaintModal = true;
    this.newComplaint = {
      subject: '',
      description: '',
      category: 'complaint'
    };
    this.attachmentFile = null;
    this.attachmentFileName = '';
  }

  closeComplaintModal() {
    this.showComplaintModal = false;
  }

  onAttachmentChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.attachmentFile = file;
      this.attachmentFileName = file.name;
    }
  }

  removeAttachment() {
    this.attachmentFile = null;
    this.attachmentFileName = '';
  }

  async submitComplaint(event: Event) {
    event.preventDefault();
    
    if (!this.newComplaint.subject.trim() || !this.newComplaint.description.trim() || !this.newComplaint.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      // Create the complaint object with attachment if present
      const complaintData: NewComplaint = {
        subject: this.newComplaint.subject,
        description: this.newComplaint.description,
        category: this.newComplaint.category
      };
      
      if (this.attachmentFile) {
        complaintData.attachments = this.attachmentFile;
      }
      
      const result = await this.complaintService.submitComplaint(complaintData);
      
      if (result) {
        // Reset form and close modal
        this.newComplaint = {
          subject: '',
          description: '',
          category: 'complaint'
        };
        this.attachmentFile = null;
        this.attachmentFileName = '';
        this.showComplaintModal = false;
        
        // Reload complaints
        await this.loadComplaints();
        
        alert('Your complaint has been submitted successfully');
      } else {
        alert('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('An error occurred while submitting your complaint');
    } finally {
      this.isSubmitting = false;
    }
  }

  viewReply(complaint: Complaint) {
    this.selectedComplaint = complaint;
  }

  closeReply() {
    this.selectedComplaint = null;
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
