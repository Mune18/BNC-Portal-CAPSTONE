import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Reports and Complaints</h1>
        <p class="text-gray-600">Manage and respond to complaints submitted by residents</p>
      </div>

      <!-- Complaints List -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Complaints</h2>
        <div *ngIf="complaints.length > 0; else noComplaints">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let complaint of complaints" class="py-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-medium text-gray-800">{{ complaint.subject }}</h3>
                  <p class="text-sm text-gray-600">{{ complaint.message | slice:0:100 }}...</p>
                  <p class="text-xs text-gray-500 mt-1">Submitted by {{ complaint.residentName }} on {{ complaint.date | date:'medium' }}</p>
                </div>
                <button 
                  (click)="selectComplaint(complaint)" 
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </button>
              </div>
            </li>
          </ul>
        </div>
        <ng-template #noComplaints>
          <p class="text-gray-600">No complaints available at the moment.</p>
        </ng-template>
      </div>

      <!-- Complaint Details and Reply -->
      <div *ngIf="selectedComplaint" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Complaint Details</h2>
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
          <div class="flex justify-end">
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
  `,
  styles: []
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

  selectComplaint(complaint: any) {
    this.selectedComplaint = complaint;
    this.replyMessage = ''; // Clear the reply message when a new complaint is selected
  }

  replyToComplaint(event: Event) {
    event.preventDefault();
    if (this.replyMessage.trim()) {
      alert(`Reply sent to ${this.selectedComplaint.residentName}: ${this.replyMessage}`);
      this.replyMessage = '';
      this.selectedComplaint = null; // Deselect the complaint after replying
    }
  }
}
