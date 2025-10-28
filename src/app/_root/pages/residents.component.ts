import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentDetailModalComponent } from './resident-detail-modal.component';
import { ResidentEditModalComponent } from './resident-edit-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-residents',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentDetailModalComponent, ResidentEditModalComponent],
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
            <option value="Deceased">Deceased</option>
            <option value="Archived">Archived</option>
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
              <tr *ngFor="let resident of filteredResidents" class="hover:bg-gray-50 cursor-pointer transition-colors" (click)="viewResident(resident)">
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
                  <span [class]="getStatusClass(resident.otherDetails.status)">
                    {{ resident.otherDetails.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors"
                      [class]="archivingResidentId === resident.$id ? 
                        'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                        'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'"
                      (click)="editResident(resident); $event.stopPropagation()"
                      title="Edit resident information"
                      [disabled]="archivingResidentId === resident.$id"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <!-- Archive/Unarchive Button -->
                    <button 
                      *ngIf="resident.otherDetails.status !== 'Archived'"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors"
                      [class]="archivingResidentId === resident.$id ? 
                        'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                        'text-orange-600 bg-orange-50 hover:bg-orange-100 hover:text-orange-700'"
                      (click)="archiveResident(resident); $event.stopPropagation()"
                      title="Archive resident"
                      [disabled]="archivingResidentId === resident.$id"
                    >
                      <div *ngIf="archivingResidentId === resident.$id" class="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400 mr-1"></div>
                      <svg *ngIf="archivingResidentId !== resident.$id" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8l4-4h6l4 4" />
                      </svg>
                      {{ archivingResidentId === resident.$id ? 'Archiving...' : 'Archive' }}
                    </button>
                    
                    <!-- Unarchive Button (only for archived residents) -->
                    <button 
                      *ngIf="resident.otherDetails.status === 'Archived'"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors"
                      [class]="archivingResidentId === resident.$id ? 
                        'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                        'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700'"
                      (click)="unarchiveResident(resident); $event.stopPropagation()"
                      title="Unarchive resident"
                      [disabled]="archivingResidentId === resident.$id"
                    >
                      <div *ngIf="archivingResidentId === resident.$id" class="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400 mr-1"></div>
                      <svg *ngIf="archivingResidentId !== resident.$id" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                      {{ archivingResidentId === resident.$id ? 'Unarchiving...' : 'Unarchive' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Load More / Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <p class="text-sm text-gray-700">
              Showing {{ filteredResidents.length }} of {{ totalResidents }} residents
            </p>
            <button 
              *ngIf="hasMore && !searchTerm && statusFilter === 'all'" 
              (click)="loadMoreResidents()"
              [disabled]="isLoadingMore"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <span *ngIf="!isLoadingMore">Load More</span>
              <span *ngIf="isLoadingMore" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                Loading...
              </span>
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ Math.min(filteredResidents.length, residents.length) }}</span> of
                <span class="font-medium">{{ totalResidents }}</span> residents
                <span *ngIf="searchTerm || statusFilter !== 'all'" class="text-gray-500">
                  ({{ filteredResidents.length }} filtered)
                </span>
              </p>
            </div>
            <div *ngIf="hasMore && !searchTerm && statusFilter === 'all'">
              <button 
                (click)="loadMoreResidents()"
                [disabled]="isLoadingMore"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span *ngIf="!isLoadingMore">Load More Residents</span>
                <span *ngIf="isLoadingMore" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  Loading...
                </span>
              </button>
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

      <!-- Resident Edit Modal (hidden by default) -->
      <app-resident-edit-modal
        [show]="showEditModal"
        [resident]="selectedResident"
        (close)="closeEditModal()"
        (save)="onResidentUpdated($event)"
      ></app-resident-edit-modal>


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
  allResidents: ResidentInfo[] = []; // Keep full list for search/filter
  Math = Math; // Make Math available in the template
  archivingResidentId: string | null = null; // Track which resident is being archived

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 20;
  totalResidents: number = 0;
  hasMore: boolean = true;
  isLoadingMore: boolean = false;

  showResidentModal: boolean = false;
  showEditModal: boolean = false;
  selectedResident: ResidentInfo | null = null;
  
  // Export related properties
  showExportDropdown: boolean = false;
  isExporting: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadResidentsOptimized();
  }

  async loadResidentsOptimized() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      // Load first page quickly
      const result = await this.adminService.getResidentsPaginated(1, this.pageSize) as any;
      this.residents = result.residents || [];
      this.totalResidents = result.total || 0;
      this.hasMore = result.hasMore || false;
      
      // Load all residents in background for search functionality
      setTimeout(() => this.loadAllResidentsBackground(), 100);
    } catch (error) {
      console.error('Failed to load residents:', error);
      this.errorMessage = 'Failed to load residents. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private async loadAllResidentsBackground() {
    try {
      this.allResidents = await this.adminService.getAllResidents();
    } catch (error) {
      console.error('Failed to load all residents in background:', error);
    }
  }

  async loadMoreResidents() {
    if (this.isLoadingMore || !this.hasMore) return;
    
    this.isLoadingMore = true;
    try {
      this.currentPage++;
      const result = await this.adminService.getResidentsPaginated(this.currentPage, this.pageSize) as any;
      this.residents = [...this.residents, ...(result.residents || [])];
      this.hasMore = result.hasMore || false;
    } catch (error) {
      console.error('Failed to load more residents:', error);
      this.currentPage--; // Revert page increment on error
    } finally {
      this.isLoadingMore = false;
    }
  }

  async loadResidents() {
    // Fallback method for manual refresh
    this.loadResidentsOptimized();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const exportButton = target.closest('.relative');
    if (!exportButton && this.showExportDropdown) {
      this.closeExportDropdown();
    }
  }

  get filteredResidents() {
    // Use all residents for filtering if search/filter is active, otherwise use paginated results
    const sourceData = (this.searchTerm || this.statusFilter !== 'all') ? this.allResidents : this.residents;
    
    return sourceData.filter(resident => {
      // Search by name, address, contact number
      const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName} ${resident.personalInfo.lastName}`;
      const address = this.getFullAddress(resident);
      
      const matchesSearch = 
        fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        resident.personalInfo.contactNo.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by status
      const status = resident.otherDetails.status;
      let matchesStatus = false;
      
      if (this.statusFilter === 'all') {
        // For "all" status, exclude archived residents (they have their own filter)
        matchesStatus = status !== 'Archived';
      } else {
        // For specific status filters, match exactly
        matchesStatus = this.statusFilter === status;
      }
      
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
      case 'Inactive':
        return baseClasses + 'bg-red-100 text-red-800';
      case 'Deceased':
        return baseClasses + 'bg-gray-100 text-gray-800';
      case 'Archived':
        return baseClasses + 'bg-purple-100 text-purple-800';
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
    this.selectedResident = resident;
    this.showResidentModal = false; // Close detail modal when opening edit
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    // Don't clear selectedResident here - keep it for when we return to detail view
    // Re-open the detail modal if we were viewing a resident before editing
    if (this.selectedResident) {
      this.showResidentModal = true;
    }
  }

  onResidentUpdated(updatedResident: ResidentInfo) {
    // Find and update the resident in the array
    const index = this.residents.findIndex(r => r.$id === updatedResident.$id);
    if (index !== -1) {
      this.residents[index] = updatedResident;
    }
    
    // Also update in allResidents array if it exists
    const allIndex = this.allResidents.findIndex(r => r.$id === updatedResident.$id);
    if (allIndex !== -1) {
      this.allResidents[allIndex] = updatedResident;
    }
    
    // Update the selected resident with the new data
    this.selectedResident = updatedResident;
    
    // Close edit modal and return to detail view
    this.showEditModal = false;
    this.showResidentModal = true;
  }

  async archiveResident(resident: ResidentInfo) {
    const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '. ' : ''}${resident.personalInfo.lastName}`;
    
    // Show SweetAlert2 confirmation for archiving
    const result = await Swal.fire({
      title: 'Archive Resident',
      html: `Are you sure you want to archive <strong>${fullName}</strong>?<br><br>
             <div class="text-left bg-orange-50 p-3 rounded-lg mt-3 border border-orange-200">
               <p class="font-semibold text-orange-800 mb-2">Archive Action:</p>
               <ul class="text-xs text-orange-700 space-y-1">
                 <li>• Resident will be moved to "Archived" status</li>
                 <li>• Will be hidden from active resident lists</li>
                 <li>• Can be viewed by selecting "Archived" filter</li>
                 <li>• Data will be preserved and can be restored later</li>
               </ul>
             </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Archive',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#374151',
      width: '500px',
      padding: '2rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0',
        title: 'text-xl font-bold mb-3 text-gray-900',
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-6',
        confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm mr-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
        cancelButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        actions: 'gap-3'
      },
      buttonsStyling: false,
      backdrop: 'rgba(15, 23, 42, 0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (result.isConfirmed) {
      try {
        // Ensure we have a valid resident ID
        if (!resident.$id) {
          throw new Error('Invalid resident ID');
        }

        // Set archiving state
        this.archivingResidentId = resident.$id;

        // Update resident status to "Archived"
        const updatedResident = { ...resident };
        updatedResident.otherDetails.status = 'Archived';

        // Update in database
        await this.adminService.updateResident(resident.$id, updatedResident);

        // Update local arrays
        const residentIndex = this.residents.findIndex(r => r.$id === resident.$id);
        if (residentIndex !== -1) {
          this.residents[residentIndex] = updatedResident;
        }

        const allResidentIndex = this.allResidents.findIndex(r => r.$id === resident.$id);
        if (allResidentIndex !== -1) {
          this.allResidents[allResidentIndex] = updatedResident;
        }

        // Update selected resident if it's the one being archived
        if (this.selectedResident && this.selectedResident.$id === resident.$id) {
          this.selectedResident = updatedResident;
        }

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Resident Archived',
          text: `${fullName} has been successfully archived.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold text-green-700',
          },
          backdrop: 'rgba(15, 23, 42, 0.3)',
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
          }
        });

      } catch (error) {
        console.error('Error archiving resident:', error);
        
        // Show error message
        await Swal.fire({
          icon: 'error',
          title: 'Archive Failed',
          text: 'Failed to archive resident. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold text-red-700',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white'
          },
          backdrop: 'rgba(15, 23, 42, 0.4)'
        });
      } finally {
        // Clear archiving state
        this.archivingResidentId = null;
      }
    }
  }

  async unarchiveResident(resident: ResidentInfo) {
    const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '. ' : ''}${resident.personalInfo.lastName}`;
    
    // Show SweetAlert2 confirmation for unarchiving
    const result = await Swal.fire({
      title: 'Unarchive Resident',
      html: `Are you sure you want to unarchive <strong>${fullName}</strong>?<br><br>
             <div class="text-left bg-green-50 p-3 rounded-lg mt-3 border border-green-200">
               <p class="font-semibold text-green-800 mb-2">Unarchive Action:</p>
               <ul class="text-xs text-green-700 space-y-1">
                 <li>• Resident will be moved to "Active" status</li>
                 <li>• Will appear in the main resident list</li>
                 <li>• Will be visible in "All Status" filter</li>
                 <li>• All data and information will be preserved</li>
               </ul>
             </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Unarchive',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#374151',
      width: '500px',
      padding: '2rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0',
        title: 'text-xl font-bold mb-3 text-gray-900',
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-6',
        confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm mr-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
        cancelButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        actions: 'gap-3'
      },
      buttonsStyling: false,
      backdrop: 'rgba(15, 23, 42, 0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true
    });

    if (result.isConfirmed) {
      try {
        // Ensure we have a valid resident ID
        if (!resident.$id) {
          throw new Error('Invalid resident ID');
        }

        // Set archiving state (reusing the same state for unarchiving)
        this.archivingResidentId = resident.$id;

        // Update resident status to "Active"
        const updatedResident = { ...resident };
        updatedResident.otherDetails.status = 'Active';

        // Update in database
        await this.adminService.updateResident(resident.$id, updatedResident);

        // Update local arrays
        const residentIndex = this.residents.findIndex(r => r.$id === resident.$id);
        if (residentIndex !== -1) {
          this.residents[residentIndex] = updatedResident;
        }

        const allResidentIndex = this.allResidents.findIndex(r => r.$id === resident.$id);
        if (allResidentIndex !== -1) {
          this.allResidents[allResidentIndex] = updatedResident;
        }

        // Update selected resident if it's the one being unarchived
        if (this.selectedResident && this.selectedResident.$id === resident.$id) {
          this.selectedResident = updatedResident;
        }

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Resident Unarchived',
          text: `${fullName} has been successfully unarchived and is now active.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold text-green-700',
          },
          backdrop: 'rgba(15, 23, 42, 0.3)',
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
          }
        });

      } catch (error) {
        console.error('Error unarchiving resident:', error);
        
        // Show error message
        await Swal.fire({
          icon: 'error',
          title: 'Unarchive Failed',
          text: 'Failed to unarchive resident. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold text-red-700',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white'
          },
          backdrop: 'rgba(15, 23, 42, 0.4)'
        });
      } finally {
        // Clear archiving state
        this.archivingResidentId = null;
      }
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
      'Date of Registration',
      'Status'
    ];

    const csvData = residents.map(resident => {
      const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`;
      const address = this.getFullAddress(resident);
      const age = this.calculateAge(resident.personalInfo.birthDate);
      const status = resident.otherDetails.status;
      
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
              const status = resident.otherDetails.status;
              
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
