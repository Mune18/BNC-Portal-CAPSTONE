import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  template: `
    <div class="container mx-auto px-4 py-6 relative">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome to BNC Portal</h1>
          <p class="text-gray-600">Stay updated with the latest announcements and access important information.</p>
        </div>
        <button 
          (click)="toggleEmergencyHotline()" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Emergency Hotlines
        </button>
      </div>

      <!-- Announcements Section -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Announcements</h2>
        <div *ngIf="announcements.length > 0; else noAnnouncements">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let announcement of announcements" class="py-4">
              <h3 class="text-lg font-medium text-gray-800">{{ announcement.title }}</h3>
              <p class="text-sm text-gray-600">{{ announcement.content }}</p>
              <p class="text-xs text-gray-500 mt-1">Published on {{ announcement.date | date:'medium' }}</p>
            </li>
          </ul>
        </div>
        <ng-template #noAnnouncements>
          <p class="text-gray-600">No announcements available at the moment.</p>
        </ng-template>
      </div>

      <!-- Emergency Hotline Modal -->
      <div 
        *ngIf="showEmergencyHotline" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full">
          <button 
            (click)="toggleEmergencyHotline()" 
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>
          <img 
            src="/assets/emergency-hotlines.jpg" 
            alt="Emergency Hotlines" 
            class="w-full h-auto rounded-lg"
          >
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

  showEmergencyHotline = false;

  toggleEmergencyHotline() {
    this.showEmergencyHotline = !this.showEmergencyHotline;
  }
}
