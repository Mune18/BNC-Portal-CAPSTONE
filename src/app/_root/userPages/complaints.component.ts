import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../shared/services/complaint.service';
import { Complaint, NewComplaint } from '../../shared/types/complaint';
import { UserService } from '../../shared/services/user.service';
import { ResidentInfo } from '../../shared/types/resident';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';
import Swal from 'sweetalert2';

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
    <div *ngIf="!loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
          <p class="text-gray-600">Let us know your concerns, and we will address them as soon as possible.</p>
        </div>
        <button
          class="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          (click)="openComplaintModal()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Submit Complaint</span>
        </button>
      </div>
    </div>

    <!-- Complaints List -->
    <div *ngIf="!loading" class="grid grid-cols-1 gap-8">
      <!-- Main Complaints List -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Your Complaints</h2>
        </div>
        
        <div *ngIf="complaints.length > 0; else noComplaints">
          <!-- Desktop/Tablet Table View (hidden on mobile) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  *ngFor="let complaint of complaints"
                  class="hover:bg-gray-50 cursor-pointer transition-colors"
                  (click)="viewReply(complaint)"
                >
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <div class="text-sm font-medium text-gray-900">{{ complaint.subject }}</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">{{ complaint.description }}</div>
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
                    <div *ngIf="complaint.attachments; else noAttachment" class="w-16 h-16">
                      <!-- Try to display as image first -->
                      <img 
                        [src]="getAttachmentUrl(complaint.attachments)" 
                        alt="Attachment preview" 
                        class="w-full h-full object-cover rounded-lg border border-gray-200"
                        (error)="onTableImageError($event, complaint.$id || '')"
                        (load)="onTableImageLoad($event, complaint.$id || '')"
                        [style.display]="isTableImageError(complaint.$id || '') ? 'none' : 'block'"
                      >
                      <!-- Fallback file icon when image fails to load -->
                      <div *ngIf="isTableImageError(complaint.$id || '')" class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                        <div class="text-center">
                          <svg class="w-6 h-6 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
                            <path d="M6 5h8v2H6V5zM6 8h8v2H6V8zM6 11h4v2H6v-2z"/>
                          </svg>
                          <span class="text-xs text-gray-500 mt-1">File</span>
                        </div>
                      </div>
                    </div>
                    <ng-template #noAttachment>
                      <span class="text-gray-400">-</span>
                    </ng-template>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span *ngIf="complaint.barangayResponse" class="text-green-600 font-medium">
                      <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      Response
                    </span>
                    <span *ngIf="!complaint.barangayResponse" class="text-gray-400">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View (visible only on mobile) -->
          <div class="md:hidden space-y-4 p-4">
            <div
              *ngFor="let complaint of complaints"
              class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 active:bg-gray-50 transition-all duration-200 touch-manipulation"
              (click)="viewReply(complaint)"
            >
              <!-- Header with status -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 truncate pr-2">{{ complaint.subject }}</h3>
                  <p class="text-sm text-gray-500 capitalize mt-1">{{ complaint.category }}</p>
                </div>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0" 
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

              <!-- Description -->
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ complaint.description }}</p>

              <!-- Bottom row with metadata -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center space-x-4">
                  <!-- Date -->
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>{{ complaint.createdAt | date:'MMM d' }}</span>
                  </div>

                  <!-- Attachment indicator -->
                  <div *ngIf="complaint.attachments" class="flex items-center">
                    <!-- Try to display as image first -->
                    <div class="w-8 h-8 mr-2">
                      <img 
                        [src]="getAttachmentUrl(complaint.attachments)" 
                        alt="Attachment preview" 
                        class="w-full h-full object-cover rounded border border-gray-200"
                        (error)="onTableImageError($event, complaint.$id || '')"
                        (load)="onTableImageLoad($event, complaint.$id || '')"
                        [style.display]="isTableImageError(complaint.$id || '') ? 'none' : 'block'"
                      >
                      <!-- Fallback file icon when image fails to load -->
                      <div *ngIf="isTableImageError(complaint.$id || '')" class="w-full h-full flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-blue-600">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
                          <path d="M6 5h8v2H6V5zM6 8h8v2H6V8zM6 11h4v2H6v-2z"/>
                        </svg>
                      </div>
                    </div>
                    <span *ngIf="!isTableImageError(complaint.$id || '')" class="text-blue-600">Image</span>
                    <span *ngIf="isTableImageError(complaint.$id || '')" class="text-blue-600">File</span>
                  </div>
                </div>

                <!-- Response status -->
                <div class="flex items-center">
                  <div *ngIf="complaint.barangayResponse" class="flex items-center text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                    </svg>
                    <span class="font-medium">Reply</span>
                  </div>
                  <div *ngIf="!complaint.barangayResponse" class="text-gray-400">
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              <!-- Tap indicator -->
              <div class="flex justify-center mt-3 pt-2 border-t border-gray-100">
                <div class="flex items-center text-xs text-gray-400">
                  <span>Tap to view details</span>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #noComplaints>
          <div class="px-6 py-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
            <p class="mt-1 text-sm text-gray-500">You have not submitted any complaints yet.</p>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Submit Complaint Modal -->
    <div 
      *ngIf="showComplaintModal"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-black/30"
        (click)="closeComplaintModal()"
      ></div>
      <div class="bg-white rounded-2xl shadow-2xl relative w-full max-w-md md:max-w-2xl z-10 max-h-[95vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg md:text-xl font-semibold text-gray-800">Submit a Complaint</h2>
          <button 
            (click)="closeComplaintModal()" 
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-4 md:px-6 py-4">
          <form (submit)="submitComplaint($event)" class="space-y-5">
            <!-- Subject Field -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Subject <span class="text-red-500">*</span>
              </label>
              <input 
                id="subject" 
                [(ngModel)]="newComplaint.subject" 
                name="subject" 
                type="text" 
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter the subject of your complaint"
                required
              >
            </div>

            <!-- Category Field -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                id="category"
                [(ngModel)]="newComplaint.category"
                name="category"
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                required
              >
                <option value="" disabled selected>Select a category</option>
                <option value="complaint">Complaint</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Description Field -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="description" 
                [(ngModel)]="newComplaint.description" 
                name="description" 
                rows="4" 
                class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your complaint in detail..."
                required
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Please provide as much detail as possible</p>
            </div>

            <!-- Anonymous Option -->
            <div>
              <div class="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div class="flex items-center h-5">
                  <input 
                    id="anonymous" 
                    [(ngModel)]="newComplaint.isAnonymous" 
                    name="anonymous" 
                    type="checkbox" 
                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  >
                </div>
                <div class="flex-1">
                  <label for="anonymous" class="cursor-pointer block text-sm font-medium text-blue-800 mb-1">
                    Submit as Anonymous
                  </label>
                  <p class="text-xs text-blue-700">
                    Your identity will be kept confidential. Only the Barangay officials will know who submitted this complaint for administrative purposes, but your name will not be visible in any reports or public records.
                  </p>
                </div>
              </div>
            </div>

            <!-- Attachment Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Attachment (Optional)
              </label>
              <div class="space-y-3">
                <label class="cursor-pointer block">
                  <div class="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">
                    <div class="text-center">
                      <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span class="text-sm text-gray-600">
                        {{ attachmentFileName || 'Tap to choose a file' }}
                      </span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    (change)="onAttachmentChange($event)" 
                    class="hidden" 
                    accept="image/*,.pdf,.doc,.docx"
                  >
                </label>
                
                <!-- Selected File Display -->
                <div *ngIf="attachmentFileName" class="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"/>
                    </svg>
                    <span class="text-sm text-blue-800 font-medium truncate max-w-48">{{ attachmentFileName }}</span>
                  </div>
                  <button 
                    type="button"
                    (click)="removeAttachment()"
                    class="ml-2 p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                
                <p class="text-xs text-gray-500">Supported: Images, PDF, DOC, DOCX (Max 10MB)</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button"
                class="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                (click)="closeComplaintModal()"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isSubmitting"
              >
                <span *ngIf="!isSubmitting" class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  Submit Complaint
                </span>
                <span *ngIf="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>

    <!-- Reply Modal -->
    <div 
      *ngIf="selectedComplaint" 
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-black/40"
        (click)="closeReply()"
      ></div>
      <div class="bg-white rounded-2xl shadow-2xl relative w-full max-w-md md:max-w-3xl z-10 max-h-[95vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-4 md:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <h2 class="text-lg md:text-xl font-semibold text-gray-800">Complaint Details</h2>
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
            <button 
              (click)="closeReply()" 
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-4 md:px-6 py-4 space-y-6">
          <!-- Complaint Info Section -->
          <div class="space-y-4">
            <!-- Date and ID -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Submitted on {{ selectedComplaint.createdAt | date:'medium' }}</span>
              </div>
              <div class="text-xs text-gray-500 mt-1 sm:mt-0">
                ID: {{ selectedComplaint.$id?.slice(-8) }}
              </div>
            </div>

            <!-- Subject -->
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">{{ selectedComplaint.subject }}</h3>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <span class="font-medium">Category:</span>
                <span class="ml-1 capitalize">{{ selectedComplaint.category }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="p-4 bg-gray-50 rounded-xl">
              <h4 class="font-medium text-gray-800 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Description
              </h4>
              <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ selectedComplaint.description }}</p>
            </div>

            <!-- Attachment Preview -->
            <div *ngIf="selectedComplaint.attachments" class="p-4 border border-gray-200 rounded-xl">
              <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"/>
                </svg>
                Attachment
              </h4>
              <div class="space-y-3">
                <!-- Try to display as image first, fallback to file display if it fails -->
                <div class="rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    [src]="getAttachmentUrl(selectedComplaint.attachments)" 
                    alt="Attachment" 
                    class="w-full h-auto max-h-96 object-contain"
                    (error)="onImageError($event)"
                    (load)="onImageLoad($event)"
                    [style.display]="showImageError ? 'none' : 'block'"
                  >
                  
                  <!-- File Display (shown when image fails to load) -->
                  <div *ngIf="showImageError" class="flex items-center justify-center p-6 bg-gray-50 rounded-xl">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
                        <path d="M6 5h8v2H6V5zM6 8h8v2H6V8zM6 11h4v2H6v-2z"/>
                      </svg>
                      <p class="text-sm text-gray-600 font-medium">File Attachment</p>
                      <p class="text-xs text-gray-500 mt-1">Non-image file attached</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Response Section -->
          <div class="border-t pt-6">
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">Barangay Response</h3>
              </div>
            </div>
            
            <div class="p-4 rounded-xl" [ngClass]="{
              'bg-green-50 border border-green-200': selectedComplaint.barangayResponse,
              'bg-yellow-50 border border-yellow-200': !selectedComplaint.barangayResponse
            }">
              <div *ngIf="selectedComplaint.barangayResponse" class="flex items-start">
                <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-green-800 leading-relaxed">{{ selectedComplaint.barangayResponse }}</p>
                  <p class="text-xs text-green-600 mt-2">Response received</p>
                </div>
              </div>
              
              <div *ngIf="!selectedComplaint.barangayResponse" class="flex items-start">
                <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-yellow-800 font-medium">Waiting for response from barangay officials</p>
                  <p class="text-xs text-yellow-600 mt-1">You will be notified when a response is available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-4">
            <button
              (click)="closeReply()"
              class="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
            >
              Close
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
    .max-w-screen-md {
      max-width: 768px;
    }
    
    /* Table hover effects */
    tbody tr:hover {
      background-color: #f9fafb;
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
    
    /* Button hover effects */
    button:hover {
      transform: translateY(-1px);
    }
    
    /* Table cell transitions */
    td a {
      transition: all 0.2s ease;
    }
    
    td a:hover {
      transform: scale(1.05);
    }
    
    /* Mobile-specific styles */
    @media (max-width: 767px) {
      /* Optimize touch targets */
      .touch-manipulation {
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
      }
      
      /* Active state for mobile cards */
      .active\\:bg-gray-50:active {
        background-color: #f9fafb;
        transform: scale(0.98);
      }
      
      /* Line clamp for mobile descriptions */
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 1.4;
        max-height: 2.8em;
      }
      
      /* Better spacing for mobile */
      .space-y-4 > * + * {
        margin-top: 1rem;
      }
      
      /* Mobile card animations */
      .mobile-card {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .mobile-card:active {
        transform: scale(0.98);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      
      /* Modal optimizations */
      .modal-content {
        margin: 0.5rem;
        max-height: calc(100vh - 1rem);
      }
      
      /* Form field optimizations */
      input, textarea, select {
        font-size: 16px !important; /* Prevents zoom on iOS */
        -webkit-appearance: none;
        border-radius: 12px;
      }
      
      /* File upload area */
      .file-upload-area {
        min-height: 60px;
        padding: 1rem;
      }
      
      /* Button optimizations */
      .mobile-button {
        min-height: 48px;
        font-size: 16px;
        font-weight: 500;
      }
      
      /* Better modal backdrop */
      .modal-backdrop {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
    }
    
    /* Ensure proper text truncation */
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* Responsive container */
    @media (max-width: 640px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      /* Stack form buttons vertically on small screens */
      .form-actions {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .form-actions button {
        width: 100%;
      }
    }
    
    /* Touch-friendly attachment links */
    @media (max-width: 767px) {
      .mobile-attachment-link {
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 6px;
      }
      
      .mobile-attachment-link:active {
        background-color: rgba(59, 130, 246, 0.1);
      }
    }
    
    /* Enhanced focus states for accessibility */
    input:focus, textarea:focus, select:focus, button:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
    
    /* Smooth modal animations */
    .modal-enter {
      animation: modalFadeIn 0.3s ease-out;
    }
    
    .modal-exit {
      animation: modalFadeOut 0.2s ease-in;
    }
    
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes modalFadeOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }
    }
    
    /* File preview optimizations */
    .file-preview {
      max-width: 100%;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
    }
    
    /* Status badge improvements */
    .status-badge {
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      font-weight: 500;
    }
    
    /* Loading state improvements */
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Improved hover states for desktop */
    @media (min-width: 768px) {
      .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
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
    category: 'complaint',
    isAnonymous: false
  };

  attachmentFile: File | null = null;
  attachmentFileName: string = '';

  selectedComplaint: Complaint | null = null;
  showComplaintModal = false;
  
  // New properties for custom notification
  notificationMessage = '';
  
  // Properties for image error handling
  showImageError = false;
  tableImageErrors: { [key: string]: boolean } = {};

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
      category: 'complaint',
      isAnonymous: false
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
      await this.showNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      // Create the complaint object with attachment if present
      const complaintData: NewComplaint = {
        subject: this.newComplaint.subject,
        description: this.newComplaint.description,
        category: this.newComplaint.category,
        isAnonymous: this.newComplaint.isAnonymous || false
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
          category: 'complaint',
          isAnonymous: false
        };
        this.attachmentFile = null;
        this.attachmentFileName = '';
        this.showComplaintModal = false;
        
        // Reload complaints
        await this.loadComplaints();
        
        // Show success notification with SweetAlert2
        await this.showNotification('Your complaint has been submitted successfully', 'success');
      } else {
        await this.showNotification('Failed to submit complaint. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      await this.showNotification('An error occurred while submitting your complaint', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  // New method to show custom notifications with SweetAlert2
  async showNotification(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const config: any = {
      text: message,
      confirmButtonText: 'OK',
      background: '#ffffff',
      color: '#374151',
      timer: 3000,
      timerProgressBar: true,
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
        confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm',
        timerProgressBar: 'rounded-full h-1'
      },
      backdrop: 'rgba(15, 23, 42, 0.4)',
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

  // Method to close the notification (no longer needed but kept for compatibility)
  closeSuccessNotification() {
    // This method is no longer needed with SweetAlert2 but kept for any remaining references
  }

  viewReply(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showImageError = false; // Reset image error state for modal
  }

  closeReply() {
    this.selectedComplaint = null;
  }

  getAttachmentUrl(fileId: string): string {
    return this.complaintService.getAttachmentUrl(fileId);
  }

  isImageAttachment(fileUrl: string): boolean {
    if (!fileUrl) return false;
    
    // First try to check if URL has image extension
    const hasImageExtension = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?|$)/i) !== null;
    if (hasImageExtension) return true;
    
    // If no extension found, assume it's an image since most complaints use images
    // This is a fallback for file IDs or URLs without extensions
    return true;
  }

  onImageError(event: any): void {
    this.showImageError = true;
  }

  onImageLoad(event: any): void {
    this.showImageError = false;
  }

  onTableImageError(event: any, complaintId: string): void {
    this.tableImageErrors[complaintId] = true;
  }

  onTableImageLoad(event: any, complaintId: string): void {
    this.tableImageErrors[complaintId] = false;
  }

  isTableImageError(complaintId: string): boolean {
    return this.tableImageErrors[complaintId] || false;
  }
}
