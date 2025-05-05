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
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Submit a Complaint</h1>
        <p class="text-gray-600">Let us know your concerns, and we will address them as soon as possible.</p>
      </div>

      <!-- Complaint Form -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">New Complaint</h2>
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

      <!-- Complaints List -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Your Complaints</h2>
        <div *ngIf="complaints.length > 0; else noComplaints">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let complaint of complaints" class="py-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-medium text-gray-800">{{ complaint.subject }}</h3>
                  <p class="text-sm text-gray-600">{{ complaint.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">Submitted on {{ complaint.date | date:'medium' }}</p>
                </div>
                <button 
                  (click)="viewReply(complaint)" 
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Reply
                </button>
              </div>
            </li>
          </ul>
        </div>
        <ng-template #noComplaints>
          <p class="text-gray-600">You have not submitted any complaints yet.</p>
        </ng-template>
      </div>

      <!-- Reply Modal -->
      <div 
        *ngIf="selectedComplaint" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 relative max-w-screen-md w-full">
          <button 
            (click)="closeReply()" 
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            ✕
          </button>
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Admin Reply</h2>
          <p class="text-sm text-gray-600">{{ selectedComplaint.reply }}</p>
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
