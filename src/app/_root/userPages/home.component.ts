import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { Announcement } from '../../shared/types/announcement';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  template: `
    <div class="container mx-auto px-4 py-6 relative">
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div *ngIf="!loading">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome to BNC Portal</h1>
          <p class="text-gray-600">Stay updated with the latest announcements and access important information.</p>
        </div>

        <!-- Main Content: Announcements & Emergency Hotlines side by side -->
        <div class="flex flex-col md:flex-row md:items-start gap-8">
          <!-- Announcements Section -->
          <div class="flex-1 flex flex-col gap-6">
            <div *ngIf="announcements.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                *ngFor="let announcement of announcements"
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
            <div *ngIf="announcements.length === 0" class="bg-white rounded-xl shadow p-6">
              <p class="text-gray-600">No announcements available at the moment.</p>
            </div>
          </div>
          <!-- Emergency Hotlines Image Container -->
          <div class="w-full md:w-80 flex-shrink-0">
            <div class="bg-white shadow rounded-lg p-4 flex flex-col items-center">
              <img 
                src="/assets/emergency-hotlines.jpg" 
                alt="Emergency Hotlines" 
                class="w-full h-auto rounded-lg mb-2"
                onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400?text=Emergency+Hotlines'"
              >
              <span class="text-xs text-gray-500">Emergency Hotlines</span>
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
export class HomeComponent implements OnInit {
  announcements: Announcement[] = [];
  loading = true;
  selectedAnnouncement: Announcement | null = null;

  constructor(private announcementService: AnnouncementService) {}

  async ngOnInit() {
    await this.loadAnnouncements();
  }

  async loadAnnouncements() {
    this.loading = true;
    try {
      this.announcements = await this.announcementService.getActiveAnnouncements();
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      this.loading = false;
    }
  }

  openAnnouncement(announcement: Announcement) {
    this.selectedAnnouncement = announcement;
  }

  closeAnnouncement() {
    this.selectedAnnouncement = null;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    return this.announcementService.getImageUrl(imageUrl);
  }
}
