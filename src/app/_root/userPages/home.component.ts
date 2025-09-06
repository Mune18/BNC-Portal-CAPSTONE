import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { DataRefreshService } from '../../shared/services/data-refresh.service';
import { Announcement } from '../../shared/types/announcement';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
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
            <h1 class="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Welcome to BNC Portal</h1>
            <p class="text-gray-500">Stay updated with the latest announcements and access important information.</p>
          </div>
          <button
            class="mt-4 sm:mt-0 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow"
            (click)="showEmergencyContact = true"
          >
            Emergency Contact
          </button>
        </div>

        <!-- Announcements Grid -->
        <div *ngIf="announcements.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Feature Announcement -->
          <div class="lg:col-span-2 flex flex-col gap-8">
            <div
              class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row relative cursor-pointer transition hover:shadow-xl"
              (click)="openAnnouncement(announcements[0])"
            >
              <div class="flex-1 p-8 flex flex-col justify-center">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs text-orange-600 font-semibold uppercase">
                    Announcement
                  </span>
                  <span class="text-xs text-gray-400">| {{ announcements[0].createdAt | date:'mediumDate' }}</span>
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
                  (click)="openAnnouncement(announcement)"
                >
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                      <span class="text-xs text-gray-400">| {{ announcement.createdAt | date:'mediumDate' }}</span>
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
                  (click)="openAnnouncement(announcement)"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                    <span class="text-xs text-gray-400">| {{ announcement.createdAt | date:'mediumDate' }}</span>
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
          <p class="text-gray-600 mb-6">Stay tuned for important updates and announcements from the community.</p>
        </div>

        <!-- Emergency Contact Modal -->
        <div
          *ngIf="showEmergencyContact"
          class="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="closeEmergencyContact()"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
            <button
              class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              (click)="closeEmergencyContact()"
            >✕</button>
            <div class="mb-4">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Emergency Contact</h2>
              <img 
                src="/assets/emergency-hotlines.jpg" 
                alt="Emergency Hotlines" 
                class="w-full h-auto rounded-lg"
                onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600?text=Emergency+Hotlines'"
              >
            </div>
          </div>
        </div>

        <!-- Announcement Detail Modal -->
        <div
          *ngIf="selectedAnnouncement"
          class="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="closeAnnouncement()"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
            <button
              class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              (click)="closeAnnouncement()"
            >✕</button>
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                <span class="text-xs text-gray-400">| {{ selectedAnnouncement.createdAt | date:'mediumDate' }}</span>
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
      max-width: 450px;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  loading = true;
  selectedAnnouncement: Announcement | null = null;
  showEmergencyContact = false;
  private refreshSubscription?: Subscription;

  constructor(
    private announcementService: AnnouncementService,
    private dataRefreshService: DataRefreshService
  ) {}

  async ngOnInit() {
    // Show content immediately, load announcements in background
    this.loading = false;
    this.loadAnnouncements();
    
    // Subscribe to refresh notifications
    this.refreshSubscription = this.dataRefreshService.onRefresh('announcements').subscribe(() => {
      this.loadAnnouncements();
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  async loadAnnouncements() {
    try {
      this.announcements = await this.announcementService.getActiveAnnouncements();
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  openAnnouncement(announcement: Announcement) {
    this.selectedAnnouncement = announcement;
  }

  closeAnnouncement() {
    this.selectedAnnouncement = null;
  }

  closeEmergencyContact() {
    this.showEmergencyContact = false;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    return this.announcementService.getImageUrl(imageUrl);
  }
}
