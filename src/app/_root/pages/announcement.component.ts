import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  <div class="container mx-auto px-4 py-6">
    <div class="mb-8">
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
          <form (submit)="createAnnouncement($event); showCreate = false" class="space-y-6">
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
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Announcements Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Feature Announcement -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <div *ngIf="announcements.length > 0"
            class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row relative cursor-pointer transition hover:shadow-xl"
            (click)="openDetail(announcements[0])"
          >
            <!-- 3 dots menu -->
            <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
              <button (click)="toggleMenu(announcements[0].id)" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                  <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                  <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                </svg>
              </button>
              <div *ngIf="openMenuId === announcements[0].id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcements[0])">Edit</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncement(announcements[0].id)">Delete</button>
                <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncement(announcements[0])">Archive</button>
              </div>
            </div>
            <div class="flex-1 p-8 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                <span class="text-xs text-gray-400">| {{ announcements[0].date | date:'mediumDate' }}</span>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ announcements[0].title }}</h2>
              <p class="text-gray-700 mb-4">{{ announcements[0].content }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span>Published</span>
                <span>•</span>
                <span>{{ announcements[0].date | date:'shortTime' }}</span>
              </div>
            </div>
            <div class="md:w-72 bg-gray-200 flex items-center justify-center">
              <svg class="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
          </div>
          <!-- Latest Articles Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Latest Announcements</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                *ngFor="let announcement of announcements.slice(1, 3)"
                class="bg-white rounded-xl shadow p-6 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                (click)="openDetail(announcement)"
              >
                <!-- 3 dots menu -->
                <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
                  <button (click)="toggleMenu(announcement.id)" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                    </svg>
                  </button>
                  <div *ngIf="openMenuId === announcement.id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcement)">Edit</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncement(announcement.id)">Delete</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncement(announcement)">Archive</button>
                  </div>
                </div>
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
                  <button (click)="toggleMenu(announcement.id)" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                      <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                    </svg>
                  </button>
                  <div *ngIf="openMenuId === announcement.id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="editAnnouncement(announcement)">Edit</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteAnnouncement(announcement.id)">Delete</button>
                    <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveAnnouncement(announcement)">Archive</button>
                  </div>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-orange-600 font-semibold uppercase">Announcement</span>
                  <span class="text-xs text-gray-400">| {{ announcement.date | date:'mediumDate' }}</span>
                </div>
                <span class="text-sm font-semibold text-gray-800">{{ announcement.title }}</span>
                <span class="text-xs text-gray-500 truncate">{{ announcement.content }}</span>
              </li>
            </ul>
            <div *ngIf="announcements.length > 3" class="flex justify-end mt-2">
              <button class="text-sm text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1">
                Show More <span class="material-icons text-base"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Announcement Detail Modal -->
    <div
      *ngIf="selectedAnnouncement"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="closeDetail()"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10">
        <button
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
          (click)="closeDetail()"
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
    },
    {
      id: 3,
      title: 'Water Interruption Notice',
      content: 'There will be a scheduled water interruption on May 2, 2025, from 8:00 AM to 5:00 PM.',
      date: new Date()
    },
    {
      id: 4,
      title: 'Barangay Fiesta',
      content: 'Join us for the Barangay Fiesta on May 10, 2025! Food, games, and fun for everyone.',
      date: new Date()
    },
    {
      id: 5,
      title: 'Health Mission',
      content: 'Free medical check-up at the Barangay Hall on May 15, 2025, 9:00 AM to 3:00 PM.',
      date: new Date()
    }
  ];

  newAnnouncement = {
    title: '',
    content: ''
  };

  showCreate = false;
  openMenuId: number | null = null;
  selectedAnnouncement: any = null;

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

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
    if (this.openMenuId === id) this.openMenuId = null;
  }

  editAnnouncement(announcement: any) {
    // Implement your edit logic here
    this.openMenuId = null;
    alert('Edit clicked for: ' + announcement.title);
  }

  archiveAnnouncement(announcement: any) {
    // Implement your archive logic here
    this.openMenuId = null;
    alert('Archive clicked for: ' + announcement.title);
  }

  openDetail(announcement: any) {
    this.selectedAnnouncement = announcement;
  }

  closeDetail() {
    this.selectedAnnouncement = null;
  }
}
