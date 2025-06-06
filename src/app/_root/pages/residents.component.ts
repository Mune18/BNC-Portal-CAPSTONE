import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentDetailModalComponent } from './resident-detail-modal.component';

@Component({
  selector: 'app-residents',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentDetailModalComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Residents Management</h1>
        <p class="text-gray-600">Manage and view all registered residents in Barangay New Cabalan</p>
      </div>

      <!-- Actions and Search Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <!-- Search and Filter -->
        <div class="flex items-center gap-4 flex-1">
          <div class="relative flex-1 max-w-md">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Search residents..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <span class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <select 
            [(ngModel)]="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Resident
          </button>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="bg-white rounded-xl shadow-sm p-8 flex justify-center">
        <div class="flex flex-col items-center">
          <div class="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading residents data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage && !isLoading" class="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6 mb-6">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600">{{ errorMessage }}</p>
        </div>
        <button 
          (click)="loadResidents()" 
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
        >
          Try Again
        </button>
      </div>

      <!-- Residents Table -->
      <div *ngIf="!isLoading && !errorMessage && residents.length > 0" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Registered
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let resident of filteredResidents" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img *ngIf="resident.profileImage" [src]="resident.profileImage" alt="Profile" class="w-full h-full object-cover">
                      <span *ngIf="!resident.profileImage" class="text-gray-600 font-medium">{{ resident.personalInfo.firstName.charAt(0) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ resident.personalInfo.firstName }} {{ resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '.' : '' }} {{ resident.personalInfo.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ resident.personalInfo.age }} years old • {{ resident.personalInfo.gender }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ getFullAddress(resident) }}
                  </div>
                  <div class="text-sm text-gray-500">{{ resident.personalInfo.contactNo }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(resident.otherDetails.deceased === 'Yes' ? 'Deceased' : 'Active')">
                    {{ resident.otherDetails.deceased === 'Yes' ? 'Deceased' : 'Active' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3" (click)="viewResident(resident)">View</button>
                  <button class="text-gray-600 hover:text-gray-900 mr-3" (click)="editResident(resident)">Edit</button>
                  <button class="text-red-600 hover:text-red-900" (click)="deleteResident(resident)">Delete</button>
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
                Showing <span class="font-medium">{{ filteredResidents.length > 0 ? 1 : 0 }}</span> to 
                <span class="font-medium">{{ Math.min(filteredResidents.length, 10) }}</span> of
                <span class="font-medium">{{ filteredResidents.length }}</span> results
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
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
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

      <!-- No Results State -->
      <div *ngIf="!isLoading && !errorMessage && filteredResidents.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-600 text-lg">No residents found</p>
        <p class="text-gray-500 text-sm mt-1">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Resident Detail Modal (hidden by default) -->
      <app-resident-detail-modal
        [show]="showResidentModal"
        [resident]="selectedResident"
        (close)="closeResidentModal()"
        (edit)="editResident($event)"
      ></app-resident-detail-modal>
    </div>
  `,
  styles: []
})
export class ResidentsComponent implements OnInit {
  searchTerm: string = '';
  statusFilter: string = 'all';
  isLoading: boolean = false;
  errorMessage: string = '';
  residents: ResidentInfo[] = [];
  Math = Math; // Make Math available in the template

  showResidentModal: boolean = false;
  selectedResident: ResidentInfo | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadResidents();
  }

  async loadResidents() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      this.residents = await this.adminService.getAllResidents();
    } catch (error) {
      console.error('Failed to load residents:', error);
      this.errorMessage = 'Failed to load residents. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  get filteredResidents() {
    return this.residents.filter(resident => {
      // Search by name, address, contact number
      const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName} ${resident.personalInfo.lastName}`;
      const address = this.getFullAddress(resident);
      
      const matchesSearch = 
        fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        resident.personalInfo.contactNo.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by status (active/deceased)
      const status = resident.otherDetails.deceased === 'Yes' ? 'Deceased' : 'Active';
      const matchesStatus = this.statusFilter === 'all' || 
                            (this.statusFilter === 'Active' && status === 'Active') ||
                            (this.statusFilter === 'Inactive' && status === 'Deceased');
      
      return matchesSearch && matchesStatus;
    });
  }

  getFullAddress(resident: ResidentInfo): string {
    const parts = [];
    if (resident.personalInfo.houseNo) parts.push(resident.personalInfo.houseNo);
    if (resident.personalInfo.street) parts.push(resident.personalInfo.street);
    if (resident.personalInfo.purokNo) parts.push(`Purok ${resident.personalInfo.purokNo}`);
    return parts.join(', ') + ', New Cabalan';
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ';
    switch (status) {
      case 'Active':
        return baseClasses + 'bg-green-100 text-green-800';
      case 'Deceased':
        return baseClasses + 'bg-gray-100 text-gray-800';
      case 'Pending':
        return baseClasses + 'bg-yellow-100 text-yellow-800';
      default:
        return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  viewResident(resident: ResidentInfo) {
    this.selectedResident = resident;
    this.showResidentModal = true;
  }

  closeResidentModal() {
    this.showResidentModal = false;
    this.selectedResident = null;
  }

  editResident(resident: ResidentInfo) {
    console.log('Edit resident:', resident);
    // Implement edit functionality
  }

  deleteResident(resident: ResidentInfo) {
    if (confirm(`Are you sure you want to delete ${resident.personalInfo.firstName} ${resident.personalInfo.lastName}?`)) {
      console.log('Delete resident:', resident);
      // Implement delete functionality
    }
  }
}
