import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { DataRefreshService } from '../../shared/services/data-refresh.service';
import { Announcement, NewAnnouncement } from '../../shared/types/announcement';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Blurred background overlay -->
        <div
          class="absolute inset-0 backdrop-blur-lg bg-white/40"
          (click)="showCreate = false"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl z-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Announcement</h2>
          <form (submit)="createAnnouncement($event)" class="space-y-6">
            <div>
              <label for="title" class="block text-base font-semibold text-gray-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                [(ngModel)]="newAnnouncement.title"
                name="title"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div>
              <label for="content" class="block text-base font-semibold text-gray-700 mb-1">Content</label>
              <textarea
                id="content"
                [(ngModel)]="newAnnouncement.content"
                name="content"
                rows="4"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement content"
                required
              ></textarea>
            </div>
            <div>
              <label for="image" class="block text-base font-semibold text-gray-700 mb-1">Image (Optional)</label>
              <div class="mt-1 flex items-center">
                <label class="cursor-pointer bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition">
                  <span>{{ imageFileName || 'Choose an image' }}</span>
                  <input 
                    type="file" 
                    (change)="onImageChange($event)" 
                    class="hidden" 
                    accept="image/*"
                  >
                </label>
                <button 
                  *ngIf="imageFileName"
                  type="button"
                  (click)="removeImage()"
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
                (click)="showCreate = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold"
                [disabled]="isSubmitting"
              >
                <span *ngIf="!isSubmitting">Publish</span>
                <span *ngIf="isSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
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

      <!-- Announcements Grid -->
      <div *ngIf="announcements.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Feature Announcement -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <div
            class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row relative cursor-pointer transition hover:shadow-xl"
            (click)="openDetail(announcements[0])"
          >
            <!-- 3 dots menu -->
            <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
              <button (click)="toggleMenu(announcements[0].$id || '')" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                  <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                  <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                </svg>
              </button>
              <div *ngIf="openMenuId === announcements[0].$id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcements[0])">Edit</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncementPrompt(announcements[0].$id || '')">Delete</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncementPrompt(announcements[0].$id || '')">
                  {{ announcements[0].status === 'active' ? 'Archive' : 'Activate' }}
                </button>
              </div>
            </div>
            <div class="flex-1 p-8 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-orange-600 font-semibold uppercase">
                  Announcement
                </span>
                <span class="text-xs text-gray-400">| {{ announcements[0].createdAt | date:'mediumDate' }}</span>
                <span *ngIf="announcements[0].status === 'archived'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Archived</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ announcements[0].title }}</h2>
              <p class="text-gray-700 mb-4">{{ announcements[0].content }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span>Published</span>
                <span>•</span>
                <span>{{ announcements[0].createdAt | date:'shortTime' }}</span>
              </div>
            </div>
            <div *ngIf="announcements[0].image" class="md:w-72 bg-gray-200 flex items-center justify-center">
              <img [src]="getImageUrl(announcements[0].image)" class="w-full h-full object-cover" alt="Announcement image">
            </div>
            <div *ngIf="!announcements[0].image" class="md:w-72 bg-gray-200 flex items-center justify-center">
              <svg class="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"></path>
              </svg>
            </div>
          </div>
          <!-- Latest Articles Section -->
          <div *ngIf="announcements.length > 1">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Latest Announcements</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                *ngFor="let announcement of announcements.slice(1, 3)"
                class="bg-white rounded-xl shadow p-6 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                (click)="openDetail(announcement)"
              >
                <!-- 3 dots menu -->
                <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
                  <button (click)="toggleMenu(announcement.$id || '')" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                    </svg>
                  </button>
                  <div *ngIf="openMenuId === announcement.$id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcement)">Edit</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncementPrompt(announcement.$id || '')">Delete</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncementPrompt(announcement.$id || '')">
                      {{ announcement.status === 'active' ? 'Archive' : 'Activate' }}
                    </button>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                    <span class="text-xs text-gray-400">| {{ announcement.createdAt | date:'mediumDate' }}</span>
                    <span *ngIf="announcement.status === 'archived'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Archived</span>
                  </div>
                  <h4 class="text-lg font-bold text-gray-900 mb-1">{{ announcement.title }}</h4>
                  <p class="text-gray-700 text-sm mb-2 truncate">{{ announcement.content }}</p>
                  <img *ngIf="announcement.image" [src]="getImageUrl(announcement.image)" class="w-full h-32 object-cover rounded my-2" alt="Announcement image">
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-gray-500">{{ announcement.createdAt | date:'shortTime' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Side List -->
        <div class="flex flex-col gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-base font-semibold text-gray-900 mb-4">More Announcements</h3>
            <ul class="divide-y divide-gray-200">
              <li
                *ngFor="let announcement of announcements.slice(3)"
                class="py-4 flex flex-col gap-1 relative cursor-pointer transition hover:bg-gray-100"
                (click)="openDetail(announcement)"
              >
                <!-- 3 dots menu -->
                <div class="absolute top-2 right-2 z-20" (click)="$event.stopPropagation()">
                  <button (click)="toggleMenu(announcement.$id || '')" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                    </svg>
                  </button>
                  <div *ngIf="openMenuId === announcement.$id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcement)">Edit</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncementPrompt(announcement.$id || '')">Delete</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncementPrompt(announcement.$id || '')">
                      {{ announcement.status === 'active' ? 'Archive' : 'Activate' }}
                    </button>
                  </div>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                  <span class="text-xs text-gray-400">| {{ announcement.createdAt | date:'mediumDate' }}</span>
                  <span *ngIf="announcement.status === 'archived'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Archived</span>
                </div>
                <span class="text-sm font-semibold text-gray-800">{{ announcement.title }}</span>
                <span class="text-xs text-gray-500 truncate">{{ announcement.content }}</span>
              </li>
            </ul>
          </div>
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
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="closeDetail()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
          <button
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            (click)="closeDetail()"
          >✕</button>
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
              <span class="text-xs text-gray-400">| {{ selectedAnnouncement.createdAt | date:'mediumDate' }}</span>
              <span *ngIf="selectedAnnouncement.status === 'archived'" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Archived</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedAnnouncement.title }}</h2>
            <img *ngIf="selectedAnnouncement.image" [src]="getImageUrl(selectedAnnouncement.image)" class="w-full h-auto rounded my-4" alt="Announcement image">
            <p class="text-gray-700 mb-4">{{ selectedAnnouncement.content }}</p>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>Published</span>
              <span>•</span>
              <span>{{ selectedAnnouncement.createdAt | date:'shortTime' }}</span>
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
    
    if (confirm(`Are you sure you want to ${action} this announcement?`)) {
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
    if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
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
