import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  <div class="container mx-auto px-4 py-6">
    <!-- Header Section -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
        <p class="text-gray-600">Let us know your concerns, and we will address them as soon as possible.</p>
      </div>
      <button
        class="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        (click)="openComplaintModal()"
      >
        Submit Complaint
      </button>
    </div>

    <!-- Complaints List (Styled like admin reports.component.ts) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Complaints List -->
      <div class="lg:col-span-2 flex flex-col gap-8">
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Your Complaints</h2>
          <div *ngIf="complaints.length > 0; else noComplaints">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                *ngFor="let complaint of complaints"
                class="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between relative cursor-pointer transition hover:shadow-xl"
                (click)="viewReply(complaint)"
              >
                <!-- 3 dots menu removed -->
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-1">{{ complaint.subject }}</h3>
                  <p class="text-gray-600 text-sm mb-2 truncate">{{ complaint.message }}</p>
                  <p class="text-xs text-gray-500">Submitted on {{ complaint.date | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noComplaints>
            <p class="text-gray-600">You have not submitted any complaints yet.</p>
          </ng-template>
        </div>
      </div>
      <!-- Side List: (empty for user, for layout match) -->
      <div class="flex flex-col gap-6"></div>
    </div>

    <!-- Submit Complaint Modal -->
    <div 
      *ngIf="showComplaintModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-black/30"
        (click)="closeComplaintModal()"
      ></div>
      <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full z-10">
        <button 
          (click)="closeComplaintModal()" 
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Submit a Complaint</h2>
        <form (submit)="submitComplaint($event)" class="space-y-4">
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input 
              id="subject" 
              [(ngModel)]="newComplaint.subject" 
              name="subject" 
              type="text" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the subject of your complaint"
              required
            >
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea 
              id="message" 
              [(ngModel)]="newComplaint.message" 
              name="message" 
              rows="4" 
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your complaint in detail"
              required
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reply Modal -->
    <div 
      *ngIf="selectedComplaint" 
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div 
        class="absolute inset-0 backdrop-blur-md bg-white/40"
        (click)="closeReply()"
      ></div>
      <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full z-10">
        <button 
          (click)="closeReply()" 
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Complaint Details</h2>
        <div class="mb-4">
          <div class="mb-2">
            <span class="text-xs text-gray-400">Submitted on {{ selectedComplaint.date | date:'medium' }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ selectedComplaint.subject }}</h3>
          <p class="text-gray-700 mb-4 whitespace-pre-line">{{ selectedComplaint.message }}</p>
        </div>
        <div class="border-t pt-4 mt-4">
          <h3 class="text-base font-semibold text-gray-800 mb-2">Barangay Reply</h3>
          <p class="text-gray-600">{{ selectedComplaint.reply }}</p>
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
  `]
})
export class ComplaintsComponent {
  complaints = [
    {
      id: 1,
      subject: 'Noise Complaint',
      message: 'There has been excessive noise coming from the neighbor’s house late at night.',
      date: new Date(),
      reply: 'We have contacted the concerned party and advised them to reduce noise levels.'
    },
    {
      id: 2,
      subject: 'Garbage Issue',
      message: 'Garbage has not been collected for the past two weeks in our area.',
      date: new Date(),
      reply: 'The garbage collection schedule has been updated. Please check the announcements section.'
    }
  ];

  newComplaint = {
    subject: '',
    message: ''
  };

  selectedComplaint: any = null;
  showComplaintModal = false;

  openComplaintModal() {
    this.showComplaintModal = true;
  }

  closeComplaintModal() {
    this.showComplaintModal = false;
    this.newComplaint = { subject: '', message: '' };
  }

  submitComplaint(event: Event) {
    event.preventDefault();
    if (this.newComplaint.subject.trim() && this.newComplaint.message.trim()) {
      this.complaints.push({
        ...this.newComplaint,
        id: this.complaints.length + 1,
        date: new Date(),
        reply: 'Your complaint has been received. We will get back to you shortly.'
      });
      this.newComplaint = { subject: '', message: '' }; // Reset the form
      this.showComplaintModal = false;
      alert('Complaint submitted successfully!');
    }
  }

  viewReply(complaint: any) {
    this.selectedComplaint = complaint;
  }

  closeReply() {
    this.selectedComplaint = null;
  }
}
