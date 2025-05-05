import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-announcement',
  standalone: true, // Ensure this is a standalone component
  imports: [FormsModule, CommonModule], // Include FormsModule for ngModel
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Announcements</h1>
        <p class="text-gray-600">Manage and create announcements for the community</p>
      </div>

      <!-- Create Announcement Section -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Create New Announcement</h2>
        <form (submit)="createAnnouncement($event)" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
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
            <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
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
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </div>

      <!-- Announcements List -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Announcements</h2>
        <div *ngIf="announcements.length > 0; else noAnnouncements">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let announcement of announcements" class="py-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-medium text-gray-800">{{ announcement.title }}</h3>
                  <p class="text-sm text-gray-600">{{ announcement.content }}</p>
                  <p class="text-xs text-gray-500 mt-1">Published on {{ announcement.date | date:'medium' }}</p>
                </div>
                <button 
                  (click)="deleteAnnouncement(announcement.id)" 
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
        <ng-template #noAnnouncements>
          <p class="text-gray-600">No announcements available. Create a new one above.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class AnnouncementComponent {
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

  newAnnouncement = {
    title: '',
    content: ''
  };

  createAnnouncement(event: Event) {
    event.preventDefault();
    const newId = this.announcements.length + 1;
    const newAnnouncement = {
      id: newId,
      title: this.newAnnouncement.title,
      content: this.newAnnouncement.content,
      date: new Date()
    };
    this.announcements.unshift(newAnnouncement);
    this.newAnnouncement = { title: '', content: '' };
  }

  deleteAnnouncement(id: number) {
    this.announcements = this.announcements.filter(announcement => announcement.id !== id);
  }
}
