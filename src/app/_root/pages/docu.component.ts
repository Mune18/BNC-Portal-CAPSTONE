import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DocumentRequest {
  id: string;
  name: string;
  type: string;
  purpose: string;
  date: string;
  qty: number;
  status: 'Request' | 'Approved' | 'Disapproved' | 'Completed';
}

@Component({
  selector: 'app-docu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Document Request</h1>
        <p class="text-gray-600">Manage and view all document requests</p>
      </div>

      <!-- Actions and Search Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <!-- Status Dropdown -->
        <div class="flex items-center gap-4 flex-1">
          <div class="relative flex-1 max-w-md">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Search..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <span class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <select 
            [(ngModel)]="selectedStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Request">Request</option>
            <option value="Approved">Approved</option>
            <option value="Disapproved">Disapproved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate List
          </button>
        </div>
      </div>

      <!-- Document Requests Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let request of filteredRequests" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-600 font-medium">{{request.name.charAt(0)}}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{request.name}}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{request.type}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{request.purpose}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{request.date}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{request.qty}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
                <span class="font-medium">17</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DocuComponent {
  searchTerm: string = '';
  selectedStatus: string = 'Request';

  // Sample data - replace with actual data from your service
  documentRequests: DocumentRequest[] = [
    { id: '1', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '2', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '3', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '4', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '5', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '6', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '7', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Request' },
    { id: '8', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Approved' },
    { id: '9', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Disapproved' },
    { id: '10', name: 'Muni, Rodge Romer B.', type: 'Barangay Indigency', purpose: 'Educational Assistance', date: '03/05/2025 10:20 AM', qty: 1, status: 'Completed' },
  ];

  get filteredRequests() {
    return this.documentRequests.filter(request => {
      const matchesSearch = 
        request.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || request.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  getStatusButtonClass(status: string, selectedStatus: string): string {
    const isSelected = status === selectedStatus;
    return isSelected 
      ? 'bg-blue-700 text-white text-xs px-3 py-1 rounded-full'
      : 'bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-200';
  }

  generateList() {
    console.log('Generating list...');
    // Implement your list generation logic here
  }
}