import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { DataRefreshService } from '../../shared/services/data-refresh.service';
import { Announcement, NewAnnouncement } from '../../shared/types/announcement';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent],
  template: `
  <div class="container mx-auto px-4 py-6">
    <!-- Unified Loading Indicator -->
    <div *ngIf="loading" class="w-full">
      <app-loading type="spinner" [fullScreen]="true" message="Loading announcements..."></app-loading>
    </div>

    <div *ngIf="!loading" class="mb-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Announcements</h1>
          <p class="text-gray-500">Manage and create announcements for the community</p>
        </div>
        <button
          class="mt-4 sm:mt-0 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold shadow"
          (click)="showCreate = true"
        >
          Add Announcement
        </button>
      </div>

      <!-- Create Announcement Modal -->
      <div
        *ngIf="showCreate"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Background overlay -->
        <div
          class="absolute inset-0 bg-black/50"
          (click)="showCreate = false"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Create Announcement</h2>
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              (click)="showCreate = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <form (submit)="createAnnouncement($event)" class="p-6">
            <div class="space-y-6">
              <!-- Title Field -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Title <span class="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  [(ngModel)]="newAnnouncement.title"
                  name="title"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter the title of your announcement"
                  required
                />
              </div>

              <!-- Content Field -->
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                  Content <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  [(ngModel)]="newAnnouncement.content"
                  name="content"
                  rows="5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="Describe your announcement in detail..."
                  required
                ></textarea>
                <p class="text-sm text-gray-500 mt-2">Please provide as much detail as possible</p>
              </div>

              <!-- Image Upload Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Attachment (Optional)
                </label>
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  (click)="fileInput.click()"
                >
                  <div class="flex flex-col items-center">
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                    </div>
                    <p class="text-gray-600 font-medium">
                      {{ imageFileName || 'Tap to choose a file' }}
                    </p>
                  </div>
                  <input 
                    #fileInput
                    type="file" 
                    (change)="onImageChange($event)" 
                    class="hidden" 
                    accept="image/*"
                  >
                </div>
                <p class="text-sm text-gray-500 mt-2">Supported: Images, PDF, DOC, DOCX (Max 10MB)</p>
                
                <!-- Remove file button -->
                <div *ngIf="imageFileName" class="mt-3">
                  <button 
                    type="button"
                    (click)="removeImage()"
                    class="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                (click)="showCreate = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="isSubmitting"
              >
                <svg *ngIf="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg *ngIf="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ isSubmitting ? 'Publishing...' : 'Publish Announcement' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Announcement Modal -->
      <div
        *ngIf="showEdit"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Blurred background overlay -->
        <div
          class="absolute inset-0 backdrop-blur-lg bg-white/40"
          (click)="closeEditModal()"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl z-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Edit Announcement</h2>
          <form (submit)="submitEditAnnouncement($event)" class="space-y-6">
            <div>
              <label for="editTitle" class="block text-base font-semibold text-gray-700 mb-1">Title</label>
              <input
                id="editTitle"
                type="text"
                [(ngModel)]="editingAnnouncement.title"
                name="title"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div>
              <label for="editContent" class="block text-base font-semibold text-gray-700 mb-1">Content</label>
              <textarea
                id="editContent"
                [(ngModel)]="editingAnnouncement.content"
                name="content"
                rows="4"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement content"
                required
              ></textarea>
            </div>
            <div>
              <label for="editImage" class="block text-base font-semibold text-gray-700 mb-1">Image (Optional)</label>
              
              <!-- Current image preview if available -->
              <div *ngIf="editingAnnouncement.image && !editImageFile" class="mt-2 mb-2">
                <img [src]="getImageUrl(editingAnnouncement.image)" class="h-32 w-auto object-cover rounded" alt="Current image" />
                <p class="text-sm text-gray-500 mt-1">Current image</p>
              </div>
              
              <div class="mt-1 flex items-center">
                <label class="cursor-pointer bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
                  <span>{{ editImageFileName || 'Choose a new image' }}</span>
                  <input 
                    type="file" 
                    (change)="onEditImageChange($event)" 
                    class="hidden" 
                    accept="image/*"
                  >
                </label>
                <button 
                  *ngIf="editImageFileName"
                  type="button"
                  (click)="removeEditImage()"
                  class="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                (click)="closeEditModal()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold"
                [disabled]="isSubmitting"
              >
                <span *ngIf="!isSubmitting">Update</span>
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

      <!-- Announcements Table -->
      <div *ngIf="announcements.length > 0" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Announcement
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content Preview
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                *ngFor="let announcement of announcements" 
                class="hover:bg-gray-50 cursor-pointer"
                (click)="openDetail(announcement)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div *ngIf="announcement.image" class="h-12 w-12 rounded-lg overflow-hidden">
                        <img [src]="getImageUrl(announcement.image)" class="h-12 w-12 object-cover" alt="Announcement">
                      </div>
                      <div *ngIf="!announcement.image" class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ announcement.title }}</div>
                      <div class="text-sm text-gray-500">Announcement ID: #{{ announcement.$id?.slice(-8) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">{{ announcement.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    [ngClass]="{
                      'bg-green-100 text-green-800': announcement.status === 'active',
                      'bg-gray-100 text-gray-800': announcement.status === 'archived'
                    }"
                  >
                    {{ announcement.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ announcement.createdAt | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" (click)="$event.stopPropagation()">
                  <div class="relative inline-block text-left">
                    <button 
                      (click)="toggleMenu(announcement.$id || '')" 
                      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Actions
                      <svg class="-mr-1 ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <div *ngIf="openMenuId === announcement.$id" class="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                      <div class="py-1">
                        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" (click)="editAnnouncement(announcement)">
                          Edit
                        </button>
                        <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" (click)="archiveAnnouncementPrompt(announcement.$id || '')">
                          {{ announcement.status === 'active' ? 'Archive' : 'Activate' }}
                        </button>
                        <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" (click)="deleteAnnouncementPrompt(announcement.$id || '')">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="announcements.length === 0" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h3>
        <p class="text-gray-600 mb-6">Create your first announcement to share important information with residents.</p>
        <button
          (click)="showCreate = true"
          class="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold"
        >
          Create Announcement
        </button>
      </div>

      <!-- Announcement Detail Modal -->
      <div
        *ngIf="selectedAnnouncement"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/40" (click)="closeDetail()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                  ANNOUNCEMENT
                </span>
                <span class="text-sm text-gray-500">{{ selectedAnnouncement.createdAt | date:'mediumDate' }}</span>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
                (click)="closeDetail()"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Title -->
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {{ selectedAnnouncement.title }}
            </h2>
            
            <!-- Meta Information -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Published {{ selectedAnnouncement.createdAt | date:'medium' }}</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>Community Announcement</span>
              </div>
            </div>
            
            <!-- Image Section -->
            <div *ngIf="selectedAnnouncement.image" class="flex justify-center bg-gray-50 rounded-xl p-4">
              <img 
                [src]="getImageUrl(selectedAnnouncement.image)" 
                class="w-full h-auto object-contain max-h-80 rounded-lg shadow-sm" 
                alt="Announcement image"
              >
            </div>
            
            <!-- Content Section -->
            <div class="bg-gray-50 rounded-xl p-6">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Announcement Details</h3>
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ selectedAnnouncement.content }}</p>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Last updated: {{ selectedAnnouncement.createdAt | date:'short' }}</span>
                </div>
                <button
                  (click)="closeDetail()"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium text-sm"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .material-icons {
      font-family: 'Material Icons';
      font-style: normal;
      font-weight: normal;
      font-size: 20px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
  `]
})
export class AnnouncementComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  loading = true;
  isSubmitting = false;
  private refreshSubscription?: Subscription;
  
  // New announcement form data
  newAnnouncement: NewAnnouncement = {
    title: '',
    content: ''
  };
  imageFile: File | null = null;
  imageFileName: string = '';

  // Edit announcement data
  editingAnnouncement: Partial<Announcement> = {};
  editImageFile: File | null = null;
  editImageFileName: string = '';

  // UI state
  showCreate = false;
  showEdit = false;
  openMenuId: string | null = null;
  selectedAnnouncement: Announcement | null = null;

  constructor(
    private announcementService: AnnouncementService,
    private dataRefreshService: DataRefreshService
  ) {}

  async ngOnInit() {
    await this.loadAnnouncements();
    
    // Subscribe to refresh notifications from other instances/components
    this.refreshSubscription = this.dataRefreshService.onRefresh('announcements').subscribe(() => {
      this.loadAnnouncements(false); // Refresh without showing loading
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  async loadAnnouncements(showLoading: boolean = true) {
    if (showLoading) {
      this.loading = true;
    }
    try {
      this.announcements = await this.announcementService.getAllAnnouncements();
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      if (showLoading) {
        this.loading = false;
      }
    }
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.imageFileName = file.name;
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imageFileName = '';
  }

  onEditImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editImageFile = file;
      this.editImageFileName = file.name;
    }
  }

  removeEditImage() {
    this.editImageFile = null;
    this.editImageFileName = '';
  }

  async createAnnouncement(event: Event) {
    event.preventDefault();
    
    if (!this.newAnnouncement.title.trim() || !this.newAnnouncement.content.trim()) {
      await this.showCustomAlert('Please fill in all required fields', 'warning');
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const announcementData: NewAnnouncement = {
        title: this.newAnnouncement.title.trim(),
        content: this.newAnnouncement.content.trim()
      };
      
      if (this.imageFile) {
        announcementData.image = this.imageFile;
      }
      
      const result = await this.announcementService.createAnnouncement(announcementData);
      
      if (result) {
        // Reset form
        this.newAnnouncement = { title: '', content: '' };
        this.imageFile = null;
        this.imageFileName = '';
        this.showCreate = false;
        
        await this.showCustomAlert('Announcement published successfully', 'success');
      } else {
        await this.showCustomAlert('Failed to publish announcement', 'error');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      await this.showCustomAlert('An error occurred while publishing the announcement', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  editAnnouncement(announcement: Announcement) {
    this.editingAnnouncement = {
      $id: announcement.$id,
      title: announcement.title,
      content: announcement.content,
      status: announcement.status,
      image: announcement.image
    };
    this.editImageFile = null;
    this.editImageFileName = '';
    this.showEdit = true;
    this.openMenuId = null;
  }

  closeEditModal() {
    this.showEdit = false;
    this.editingAnnouncement = {};
    this.editImageFile = null;
    this.editImageFileName = '';
  }

  async submitEditAnnouncement(event: Event) {
    event.preventDefault();
    
    if (!this.editingAnnouncement.title?.trim() || !this.editingAnnouncement.content?.trim() || !this.editingAnnouncement.$id) {
      await this.showCustomAlert('Please fill in all required fields', 'warning');
      return;
    }

    // Show confirmation dialog before updating
    const confirmResult = await Swal.fire({
      icon: 'question',
      title: 'Confirm Update',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-3">Are you sure you want to save these changes to the announcement?</p>
          <div class="bg-blue-50 p-3 rounded-lg text-sm border border-blue-200">
            <strong class="text-blue-800">Announcement:</strong> 
            <span class="text-gray-700">${this.editingAnnouncement.title?.substring(0, 50)}${(this.editingAnnouncement.title?.length || 0) > 50 ? '...' : ''}</span>
          </div>
          <p class="text-xs text-gray-500 mt-3">All community members will see the updated announcement.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl border-0 swal2-popup-blur-bg',
        title: 'text-xl font-bold text-gray-800 mb-2',
        htmlContainer: 'text-gray-600',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg mr-3',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg'
      },
      backdrop: `
        rgba(0, 0, 0, 0.4)
        left top
        no-repeat
      `,
      allowOutsideClick: false,
      allowEscapeKey: true
    });

    // If user cancelled, return early
    if (!confirmResult.isConfirmed) {
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const result = await this.announcementService.updateAnnouncement(
        this.editingAnnouncement.$id,
        this.editingAnnouncement.title.trim(),
        this.editingAnnouncement.content.trim(),
        this.editImageFile || undefined,
        this.editingAnnouncement.status as 'active' | 'archived'
      );
      
      if (result) {
        // Close edit form
        this.showEdit = false;
        this.editingAnnouncement = {};
        this.editImageFile = null;
        this.editImageFileName = '';
        
        await this.showCustomAlert('Announcement updated successfully', 'success');
      } else {
        await this.showCustomAlert('Failed to update announcement', 'error');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      await this.showCustomAlert('An error occurred while updating the announcement', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  async archiveAnnouncementPrompt(id: string) {
    const announcement = this.announcements.find(a => a.$id === id);
    if (!announcement) return;
    
    const action = announcement.status === 'active' ? 'archive' : 'activate';
    const actionTitle = announcement.status === 'active' ? 'Archive Announcement' : 'Activate Announcement';
    const actionText = announcement.status === 'active' 
      ? 'This will hide the announcement from users. You can reactivate it later.'
      : 'This will make the announcement visible to users again.';
    
    // Set button colors based on action
    const confirmButtonClass = announcement.status === 'active' 
      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white';
    
    const result = await Swal.fire({
      title: actionTitle,
      text: actionText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it`,
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
        confirmButton: `font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm mr-3 ${confirmButtonClass}`,
        cancelButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        actions: 'gap-3'
      },
      buttonsStyling: false,
      backdrop: 'rgba(15, 23, 42, 0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (result.isConfirmed) {
      if (announcement.status === 'active') {
        await this.archiveAnnouncement(id);
      } else {
        await this.activateAnnouncement(id);
      }
    }
    
    this.openMenuId = null;
  }

  async archiveAnnouncement(id: string) {
    try {
      const success = await this.announcementService.archiveAnnouncement(id);
      if (success) {
        await this.showCustomAlert('Announcement archived successfully', 'success');
      } else {
        await this.showCustomAlert('Failed to archive announcement', 'error');
      }
    } catch (error) {
      console.error('Error archiving announcement:', error);
      await this.showCustomAlert('An error occurred while archiving the announcement', 'error');
    }
  }

  async activateAnnouncement(id: string) {
    try {
      const success = await this.announcementService.updateAnnouncement(id, 
        // Get existing title and content from the announcement
        this.announcements.find(a => a.$id === id)?.title || '',
        this.announcements.find(a => a.$id === id)?.content || '',
        undefined,
        'active');
      
      if (success) {
        await this.showCustomAlert('Announcement activated successfully', 'success');
      } else {
        await this.showCustomAlert('Failed to activate announcement', 'error');
      }
    } catch (error) {
      console.error('Error activating announcement:', error);
      await this.showCustomAlert('An error occurred while activating the announcement', 'error');
    }
  }

  async deleteAnnouncementPrompt(id: string) {
    const result = await Swal.fire({
      title: 'Delete Announcement',
      text: 'This action cannot be undone. The announcement will be permanently removed.',
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
      await this.deleteAnnouncement(id);
    }
    
    this.openMenuId = null;
  }

  async deleteAnnouncement(id: string) {
    try {
      const success = await this.announcementService.deleteAnnouncement(id);
      if (success) {
        this.announcements = this.announcements.filter(a => a.$id !== id);
        await this.showCustomAlert('Announcement deleted successfully', 'success');
      } else {
        await this.showCustomAlert('Failed to delete announcement', 'error');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      await this.showCustomAlert('An error occurred while deleting the announcement', 'error');
    }
  }

  openDetail(announcement: Announcement) {
    this.selectedAnnouncement = announcement;
  }

  closeDetail() {
    this.selectedAnnouncement = null;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    return this.announcementService.getImageUrl(imageUrl);
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
}
