import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DocumentRequest {
  id: string;
  type: string;
  purpose: string;
  qty: number;
  date: string;
  status: 'Request' | 'Approved' | 'Disapproved' | 'Completed';
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6 relative">
      <!-- Header with Request Document Button aligned -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Document Requests</h1>
          <p class="text-gray-600">View and manage your document requests below.</p>
        </div>
        <button
          (click)="showRequestForm = true"
          class="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
        >
          Request Document
        </button>
      </div>

      <!-- Main Content (blurred when modal is open) -->
      <div [class.blur-sm]="showRequestForm" [class.pointer-events-none]="showRequestForm" [class.select-none]="showRequestForm" class="transition-all duration-200">
        <!-- User's Requests Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let req of requests">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ req.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.purpose }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.qty }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span [ngClass]="statusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="requests.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-gray-400">No requests yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Request Form Modal (centered, no black bg, just overlay) -->
      <div
        *ngIf="showRequestForm"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="backdrop-filter: blur(6px);"
      >
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
          <button
            (click)="showRequestForm = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
            type="button"
          >&times;</button>
          <h2 class="text-xl font-bold text-gray-800 mb-4">Request a Document</h2>
          <form (ngSubmit)="submitRequest()" #requestForm="ngForm">
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">Document Type</label>
              <select
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
                [(ngModel)]="newRequest.type"
                name="type"
              >
                <option value="" disabled selected>Select document</option>
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Barangay Indigency">Barangay Indigency</option>
                <option value="Barangay Certificate">Barangay Certificate</option>
                <option value="Barangay Residency">Barangay Residency</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">Purpose</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
                [(ngModel)]="newRequest.purpose"
                name="purpose"
                placeholder="Enter purpose"
              >
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 mb-1 font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
                [(ngModel)]="newRequest.qty"
                name="qty"
              >
            </div>
            <button
              type="submit"
              [disabled]="requestForm.invalid"
              class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocumentsComponent {
  requests: DocumentRequest[] = [];

  newRequest: Partial<DocumentRequest> = {
    type: '',
    purpose: '',
    qty: 1
  };

  showRequestForm = false;

  submitRequest() {
    if (!this.newRequest.type || !this.newRequest.purpose || !this.newRequest.qty) return;
    const now = new Date();
    this.requests.unshift({
      id: (Math.random() * 100000).toFixed(0),
      type: this.newRequest.type!,
      purpose: this.newRequest.purpose!,
      qty: this.newRequest.qty!,
      date: now.toLocaleString(),
      status: 'Request'
    });
    this.newRequest = { type: '', purpose: '', qty: 1 };
    this.showRequestForm = false;
  }

  statusClass(status: string) {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Disapproved':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
      default:
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    }
  }
}
