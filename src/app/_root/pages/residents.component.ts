import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
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
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
          
          <!-- Export Dropdown -->
          <div class="relative">
            <button 
              (click)="toggleExportDropdown()"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Export Dropdown Menu -->
            <div *ngIf="showExportDropdown" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="p-3 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-800">Export Residents Data</h3>
                <p class="text-xs text-gray-600 mt-1">Choose your export options</p>
              </div>
              
              <div class="p-3 space-y-2">
                <!-- Loading state -->
                <div *ngIf="isExporting" class="text-center py-4">
                  <div class="inline-flex items-center text-sm text-gray-600">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Preparing export...
                  </div>
                </div>
                
                <!-- Export options -->
                <div *ngIf="!isExporting">
                  <!-- Export All -->
                  <div class="border-b border-gray-100 pb-2">
                    <p class="text-xs font-medium text-gray-700 mb-2">Export Scope</p>
                    <button 
                      (click)="exportResidents('all', 'csv')"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export All Residents ({{ residents.length }}) - CSV
                    </button>
                    <button 
                      (click)="exportResidents('filtered', 'csv')"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Export Filtered Results ({{ filteredResidents.length }}) - CSV
                    </button>
                  </div>
                  
                  <!-- PDF Options -->
                  <div>
                    <p class="text-xs font-medium text-gray-700 mb-2">PDF Reports</p>
                    <button 
                      (click)="exportResidents('all', 'pdf')"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Official Report - All Residents (PDF)
                    </button>
                    <button 
                      (click)="exportResidents('filtered', 'pdf')"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Official Report - Filtered (PDF)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                      <div class="text-sm text-gray-500">
                        {{ calculateAge(resident.personalInfo.birthDate) }} years old • {{ resident.personalInfo.gender }}
                      </div>
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
  styles: [`
    select {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>');
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      padding-right: 2.5rem; /* Ensure space for the arrow */
    }
  `]
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
  
  // Export related properties
  showExportDropdown: boolean = false;
  isExporting: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadResidents();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const exportButton = target.closest('.relative');
    if (!exportButton && this.showExportDropdown) {
      this.closeExportDropdown();
    }
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

  calculateAge(birthDate: string): number | string {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : '-';
  }

  // Export functionality
  toggleExportDropdown() {
    this.showExportDropdown = !this.showExportDropdown;
  }

  closeExportDropdown() {
    this.showExportDropdown = false;
  }

  async exportResidents(scope: 'all' | 'filtered', format: 'csv' | 'pdf') {
    if (this.isExporting) return;
    
    this.isExporting = true;
    this.closeExportDropdown();
    
    try {
      const dataToExport = scope === 'all' ? this.residents : this.filteredResidents;
      
      if (format === 'csv') {
        this.exportToCSV(dataToExport, scope);
      } else if (format === 'pdf') {
        this.exportToPDF(dataToExport, scope);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      this.isExporting = false;
    }
  }

  private exportToCSV(residents: ResidentInfo[], scope: string) {
    const headers = [
      'Full Name',
      'Gender',
      'Age',
      'Birth Date',
      'Civil Status',
      'Address',
      'Contact Number',
      'Occupation',
      'Monthly Income',
      'PWD',
      'Indigent',
      'Solo Parent',
      'Senior Citizen',
      '4Ps Member',
      'Registered Voter',
      'Covid Status',
      'Vaccinated',
      'Date of Registration',
      'Status'
    ];

    const csvData = residents.map(resident => {
      const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`;
      const address = this.getFullAddress(resident);
      const age = this.calculateAge(resident.personalInfo.birthDate);
      const status = resident.otherDetails.deceased === 'Yes' ? 'Deceased' : 'Active';
      
      return [
        fullName,
        resident.personalInfo.gender || '',
        age.toString(),
        resident.personalInfo.birthDate || '',
        resident.personalInfo.civilStatus || '',
        address,
        resident.personalInfo.contactNo || '',
        resident.personalInfo.occupation || '',
        resident.personalInfo.monthlyIncome?.toString() || '',
        resident.personalInfo.pwd || '',
        resident.personalInfo.indigent || '',
        resident.personalInfo.soloParent || '',
        resident.personalInfo.seniorCitizen || '',
        resident.personalInfo.fourPsMember || '',
        resident.personalInfo.registeredVoter || '',
        resident.otherDetails.covidStatus || '',
        resident.otherDetails.vaccinated || '',
        this.formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt),
        status
      ];
    });

    // Convert to CSV format
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const today = new Date().toISOString().split('T')[0];
    const scopeText = scope === 'all' ? 'all' : 'filtered';
    link.setAttribute('download', `residents_${scopeText}_${today}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private exportToPDF(residents: ResidentInfo[], scope: string) {
    // For PDF export, we'll create a simple HTML structure and use window.print()
    // In a production environment, you might want to use a library like jsPDF or PDFMake
    
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const scopeText = scope === 'all' ? 'All Residents' : 'Filtered Residents';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barangay New Cabalan - ${scopeText} Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { width: 80px; height: 80px; margin: 0 auto 10px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .subtitle { font-size: 16px; color: #666; margin-bottom: 10px; }
          .date { font-size: 14px; color: #888; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f5f5f5; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">BARANGAY NEW CABALAN</div>
          <div class="subtitle">Residents Management Report</div>
          <div class="subtitle">${scopeText} (${residents.length} residents)</div>
          <div class="date">Generated on ${today}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Occupation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${residents.map(resident => {
              const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`;
              const address = this.getFullAddress(resident);
              const age = this.calculateAge(resident.personalInfo.birthDate);
              const status = resident.otherDetails.deceased === 'Yes' ? 'Deceased' : 'Active';
              
              return `
                <tr>
                  <td>${fullName}</td>
                  <td>${age}</td>
                  <td>${resident.personalInfo.gender || '-'}</td>
                  <td>${address}</td>
                  <td>${resident.personalInfo.contactNo || '-'}</td>
                  <td>${resident.personalInfo.occupation || '-'}</td>
                  <td>${status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This document was generated automatically by the Barangay New Cabalan Portal System.</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `;
    
    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  }
}
