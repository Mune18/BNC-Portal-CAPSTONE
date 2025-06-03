import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="mb-8">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Reports and Complaints</h1>
            <p class="text-gray-500">Manage and respond to complaints submitted by residents</p>
          </div>
        </div>

        <!-- Complaints Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Complaints List -->
          <div class="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-6">Complaints</h2>
              <div *ngIf="complaints.length > 0; else noComplaints">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    *ngFor="let complaint of complaints"
                    class="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                    (click)="selectComplaint(complaint)"
                  >
                    <!-- 3 dots menu -->
                    <div class="absolute top-4 right-4 z-20" (click)="$event.stopPropagation()">
                      <button (click)="toggleMenu(complaint.id)" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <circle cx="5" cy="12" r="2" fill="#6B7280"/>
                          <circle cx="12" cy="12" r="2" fill="#6B7280"/>
                          <circle cx="19" cy="12" r="2" fill="#6B7280"/>
                        </svg>
                      </button>
                      <div *ngIf="openMenuId === complaint.id" class="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border z-30">
                        <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="deleteComplaint(complaint.id)">Delete</button>
                        <button class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" (click)="archiveComplaint(complaint)">Archive</button>
                      </div>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-800 mb-1">{{ complaint.subject }}</h3>
                      <p class="text-gray-600 text-sm mb-2 truncate">{{ complaint.message }}</p>
                      <p class="text-xs text-gray-500">Submitted by {{ complaint.residentName }} on {{ complaint.date | date:'medium' }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noComplaints>
                <p class="text-gray-600">No complaints available at the moment.</p>
              </ng-template>
            </div>
          </div>
          <!-- Side List: Complaint Details and Reply (hidden, now handled by modal) -->
          <div class="flex flex-col gap-6"></div>
        </div>
      </div>

      <!-- Complaint Detail Modal -->
      <div
        *ngIf="selectedComplaint"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/30" (click)="selectedComplaint = null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10">
          <button
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            (click)="selectedComplaint = null"
          >✕</button>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Complaint Details</h2>
          <div class="mb-4">
            <p><strong>Subject:</strong> {{ selectedComplaint.subject }}</p>
            <p><strong>Message:</strong> {{ selectedComplaint.message }}</p>
            <p><strong>Submitted by:</strong> {{ selectedComplaint.residentName }}</p>
            <p><strong>Date:</strong> {{ selectedComplaint.date | date:'medium' }}</p>
          </div>
          <form (submit)="replyToComplaint($event)" class="space-y-4">
            <div>
              <label for="reply" class="block text-sm font-medium text-gray-700">Reply</label>
              <textarea 
                id="reply" 
                [(ngModel)]="replyMessage" 
                name="reply" 
                rows="4" 
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your reply"
                required
              ></textarea>
            </div>
            <div class="flex justify-end gap-2">
              <button 
                type="button"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                (click)="selectedComplaint = null"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom styles if needed */
  `]
})
export class ReportsComponent {
  complaints = [
    {
      id: 1,
      subject: 'Noise Complaint',
      message: 'There has been excessive noise coming from the neighbor’s house late at night.',
      residentName: 'John Doe',
      date: new Date()
    },
    {
      id: 2,
      subject: 'Garbage Issue',
      message: 'Garbage has not been collected for the past two weeks in our area.',
      residentName: 'Jane Smith',
      date: new Date()
    }
  ];

  selectedComplaint: any = null;
  replyMessage: string = '';
  openMenuId: number | null = null;

  selectComplaint(complaint: any) {
    this.selectedComplaint = complaint;
    this.replyMessage = '';
  }

  replyToComplaint(event: Event) {
    event.preventDefault();
    if (this.replyMessage.trim()) {
      alert(`Reply sent to ${this.selectedComplaint.residentName}: ${this.replyMessage}`);
      this.replyMessage = '';
      this.selectedComplaint = null;
    }
  }

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  deleteComplaint(id: number) {
    this.complaints = this.complaints.filter(c => c.id !== id);
    if (this.openMenuId === id) this.openMenuId = null;
    if (this.selectedComplaint && this.selectedComplaint.id === id) this.selectedComplaint = null;
  }

  archiveComplaint(complaint: any) {
    this.openMenuId = null;
    alert('Archive clicked for: ' + complaint.subject);
  }
}
