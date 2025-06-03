import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  template: `
    <div class="container mx-auto px-4 py-6 relative">
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
                  <span class="text-xs text-gray-400">| {{ announcement.date | date:'mediumDate' }}</span>
                </div>
                <h4 class="text-lg font-bold text-gray-900 mb-1">{{ announcement.title }}</h4>
                <p class="text-gray-700 text-sm mb-2 truncate">{{ announcement.content }}</p>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">{{ announcement.date | date:'shortTime' }}</span>
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
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10">
          <button
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            (click)="closeAnnouncement()"
          >✕</button>
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
              <span class="text-xs text-gray-400">| {{ selectedAnnouncement.date | date:'mediumDate' }}</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedAnnouncement.title }}</h2>
            <p class="text-gray-700 mb-4">{{ selectedAnnouncement.content }}</p>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>Published</span>
              <span>•</span>
              <span>{{ selectedAnnouncement.date | date:'shortTime' }}</span>
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
export class HomeComponent {
  announcements = [
    {
      id: 1,
      title: 'Community Meeting',
      content: 'A community meeting will be held on April 30, 2025, at 5:00 PM in the Barangay Hall.',
      date: new Date()
    },
    {
      id: 2,
      title: 'Garbage Collection Schedule',
      content: 'Garbage collection will be every Monday and Thursday starting next week.',
      date: new Date()
    }
  ];

  selectedAnnouncement: any = null;

  openAnnouncement(announcement: any) {
    this.selectedAnnouncement = announcement;
  }

  closeAnnouncement() {
    this.selectedAnnouncement = null;
  }
}
