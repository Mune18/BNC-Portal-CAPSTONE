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

      <!-- Tab Navigation -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button 
              (click)="setActiveTab('residents')"
              [class]="activeTab === 'residents' 
                ? 'border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'"
            >
              All Residents
              <span class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {{ totalResidents }}
              </span>
            </button>
            <button 
              (click)="setActiveTab('pending')"
              [class]="activeTab === 'pending' 
                ? 'border-yellow-500 text-yellow-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'"
            >
              Pending Approvals
              <span class="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2.5 rounded-full text-xs font-medium" *ngIf="pendingResidents.length > 0">
                {{ pendingResidents.length }}
              </span>
              <span class="ml-2 bg-gray-100 text-gray-500 py-0.5 px-2.5 rounded-full text-xs font-medium" *ngIf="pendingResidents.length === 0">
                0
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div [ngSwitch]="activeTab">

        <!-- All Residents Tab -->
        <div *ngSwitchCase="'residents'">
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
            <div *ngIf="showExportDropdown" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="p-3 border-b border-gray-200">
                <h3 class="text-sm font-semibold text-gray-800">Export Residents Data</h3>
                <p class="text-xs text-gray-600 mt-1">Choose your export options and customize columns</p>
              </div>
              
              <div class="p-3 space-y-3">
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
                  <!-- Column Selection Toggle -->
                  <div class="mb-4">
                    <button 
                      (click)="showColumnSelection = !showColumnSelection"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center justify-between border border-gray-200"
                    >
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                        <span>Customize Columns ({{ getSelectedColumnsCount() }} selected)</span>
                      </div>
                      <svg class="w-4 h-4 transition-transform" [class.rotate-180]="showColumnSelection" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                    
                    <!-- Column Selection Panel -->
                    <div *ngIf="showColumnSelection" class="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-medium text-gray-700">Select columns to export:</span>
                        <div class="flex gap-2">
                          <button 
                            (click)="selectAllColumns()"
                            class="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Select All
                          </button>
                          <button 
                            (click)="deselectAllColumns()"
                            class="text-xs text-gray-600 hover:text-gray-800"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <label *ngFor="let column of availableColumns" class="flex items-center">
                          <input 
                            type="checkbox" 
                            [(ngModel)]="column.selected"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          >
                          <span class="ml-2 text-xs text-gray-700">{{ column.label }}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Export All -->
                  <div class="border-b border-gray-100 pb-3">
                    <p class="text-xs font-medium text-gray-700 mb-2">Export Scope</p>
                    <button 
                      (click)="exportResidents('all', 'csv')"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 mb-2"
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
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 mb-2"
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
                  <div class="text-sm text-gray-500">{{ resident.personalInfo.email || 'No email' }}</div>
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
        </div> <!-- End All Residents Tab -->

        <!-- Pending Approvals Tab -->
        <div *ngSwitchCase="'pending'">
          <!-- Pending Header -->
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Pending Resident Approvals</h2>
                <p class="text-sm text-gray-600 mt-1">Review and approve new resident registrations</p>
              </div>
              <button 
                (click)="loadPendingResidents()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                [disabled]="isLoadingPending"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ isLoadingPending ? 'Loading...' : 'Refresh' }}
              </button>
            </div>
          </div>

          <!-- Loading State for Pending -->
          <div *ngIf="isLoadingPending" class="bg-white rounded-xl shadow-sm p-8 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="h-12 w-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-gray-600">Loading pending approvals...</p>
            </div>
          </div>

          <!-- Error State for Pending -->
          <div *ngIf="pendingErrorMessage && !isLoadingPending" class="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6 mb-6">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-red-600">{{ pendingErrorMessage }}</p>
            </div>
            <button 
              (click)="loadPendingResidents()" 
              class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
            >
              Try Again
            </button>
          </div>

          <!-- Pending Residents Table -->
          <div *ngIf="!isLoadingPending && !pendingErrorMessage && pendingResidents.length > 0" class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-yellow-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant Information
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let resident of pendingResidents" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center overflow-hidden">
                          <img *ngIf="resident.profileImage" [src]="resident.profileImage" alt="Profile" class="w-full h-full object-cover">
                          <span *ngIf="!resident.profileImage" class="text-yellow-700 font-medium">{{ resident.personalInfo.firstName.charAt(0) }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ resident.personalInfo.firstName }} {{ resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '.' : '' }} {{ resident.personalInfo.lastName }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ calculateAge(resident.personalInfo.birthDate) }} years old • {{ resident.personalInfo.gender }}
                          </div>
                          <div class="text-xs text-yellow-600 font-medium mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending Approval
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ getFullAddress(resident) }}
                      </div>
                      <div class="text-sm text-gray-500">{{ resident.personalInfo.contactNo }}</div>
                      <div class="text-sm text-gray-500">{{ resident.personalInfo.email || 'No email' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(resident.$createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="flex items-center justify-center space-x-2">
                        <!-- View Details Button -->
                        <button 
                          class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-md"
                          (click)="viewResident(resident)"
                          title="View applicant details"
                          [disabled]="approvingResidentId === resident.$id"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        
                        <!-- Approve Button -->
                        <button 
                          class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors rounded-md"
                          [class]="approvingResidentId === resident.$id ? 
                            'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                            'text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700'"
                          (click)="approveResident(resident)"
                          title="Approve registration"
                          [disabled]="approvingResidentId === resident.$id"
                        >
                          <div *ngIf="approvingResidentId === resident.$id" class="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gray-400 mr-1"></div>
                          <svg *ngIf="approvingResidentId !== resident.$id" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {{ approvingResidentId === resident.$id ? 'Processing...' : 'Approve' }}
                        </button>

                        <!-- Reject Button -->
                        <button 
                          class="inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors rounded-md"
                          [class]="approvingResidentId === resident.$id ? 
                            'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                            'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700'"
                          (click)="rejectResident(resident)"
                          title="Reject registration"
                          [disabled]="approvingResidentId === resident.$id"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- No Pending Approvals State -->
          <div *ngIf="!isLoadingPending && !pendingErrorMessage && pendingResidents.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 text-lg">No pending approvals</p>
            <p class="text-gray-500 text-sm mt-1">All registration requests have been processed</p>
          </div>
        </div> <!-- End Pending Approvals Tab -->

      </div> <!-- End Tab Content -->

      <!-- Resident Detail Modal (hidden by default) -->
      <app-resident-detail-modal
        [show]="showResidentModal"
        [resident]="selectedResident"
        [showApprovalActions]="activeTab === 'pending'"
        (close)="closeResidentModal()"
        (edit)="editResident($event)"
        (approve)="approveResident($event)"
        (reject)="rejectResident($event)"
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

  // Tab management
  activeTab: 'residents' | 'pending' = 'residents';
  
  // Pending residents properties
  pendingResidents: ResidentInfo[] = [];
  isLoadingPending: boolean = false;
  pendingErrorMessage: string = '';
  approvingResidentId: string | null = null; // Track which resident is being approved/rejected

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
  
  // Column selection for export
  availableColumns = [
    { key: 'fullName', label: 'Full Name', selected: true },
    { key: 'gender', label: 'Gender', selected: true },
    { key: 'age', label: 'Age', selected: true },
    { key: 'birthDate', label: 'Birth Date', selected: false },
    { key: 'civilStatus', label: 'Civil Status', selected: false },
    { key: 'address', label: 'Address', selected: true },
    { key: 'contactNo', label: 'Contact Number', selected: true },
    { key: 'occupation', label: 'Occupation', selected: false },
    { key: 'monthlyIncome', label: 'Monthly Income', selected: false },
    { key: 'pwd', label: 'PWD', selected: false },
    { key: 'indigent', label: 'Indigent', selected: false },
    { key: 'soloParent', label: 'Solo Parent', selected: false },
    { key: 'seniorCitizen', label: 'Senior Citizen', selected: false },
    { key: 'fourPsMember', label: '4Ps Member', selected: false },
    { key: 'registeredVoter', label: 'Registered Voter', selected: false },
    { key: 'dateOfRegistration', label: 'Date of Registration', selected: false },
    { key: 'status', label: 'Status', selected: true }
  ];
  
  showColumnSelection: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadResidentsOptimized();
    this.loadPendingResidents();
  }

  // Tab management
  setActiveTab(tab: 'residents' | 'pending') {
    this.activeTab = tab;
    if (tab === 'pending' && this.pendingResidents.length === 0) {
      this.loadPendingResidents();
    } else if (tab === 'residents') {
      // Refresh residents data when switching back to ensure newly approved residents appear
      this.loadResidentsOptimized();
    }
  }

  // Load pending residents
  async loadPendingResidents() {
    this.isLoadingPending = true;
    this.pendingErrorMessage = '';
    try {
      this.pendingResidents = await this.adminService.getPendingResidents();
    } catch (error) {
      console.error('Failed to load pending residents:', error);
      this.pendingErrorMessage = 'Failed to load pending residents. Please try again.';
    } finally {
      this.isLoadingPending = false;
    }
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

  // Column selection methods
  getSelectedColumnsCount(): number {
    return this.availableColumns.filter(col => col.selected).length;
  }

  selectAllColumns() {
    this.availableColumns.forEach(col => col.selected = true);
  }

  deselectAllColumns() {
    this.availableColumns.forEach(col => col.selected = false);
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
    // Get selected columns
    const selectedColumns = this.availableColumns.filter(col => col.selected);
    
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export.');
      return;
    }

    const headers = selectedColumns.map(col => col.label);

    const csvData = residents.map(resident => {
      const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`;
      const address = this.getFullAddress(resident);
      const age = this.calculateAge(resident.personalInfo.birthDate);
      const status = resident.otherDetails.status;
      
      const rowData: { [key: string]: string } = {
        fullName: fullName,
        gender: resident.personalInfo.gender || '',
        age: age.toString(),
        birthDate: resident.personalInfo.birthDate || '',
        civilStatus: resident.personalInfo.civilStatus || '',
        address: address,
        contactNo: resident.personalInfo.contactNo || '',
        occupation: resident.personalInfo.occupation || '',
        monthlyIncome: resident.personalInfo.monthlyIncome?.toString() || '',
        pwd: resident.personalInfo.pwd || '',
        indigent: resident.personalInfo.indigent || '',
        soloParent: resident.personalInfo.soloParent || '',
        seniorCitizen: resident.personalInfo.seniorCitizen || '',
        fourPsMember: resident.personalInfo.fourPsMember || '',
        registeredVoter: resident.personalInfo.registeredVoter || '',
        dateOfRegistration: this.formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt),
        status: status
      };
      
      return selectedColumns.map(col => rowData[col.key] || '');
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
    // Get selected columns
    const selectedColumns = this.availableColumns.filter(col => col.selected);
    
    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export.');
      return;
    }
    
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const timeGenerated = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const scopeText = scope === 'all' ? 'Complete Residents Registry' : 'Filtered Residents Report';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barangay New Cabalan - ${scopeText}</title>
        <meta charset="UTF-8">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body { 
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 0;
            padding: 20px;
          }
          
          .document-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
          }
          
          .letterhead {
            position: relative;
            text-align: center;
            padding: 20px 0 30px;
            border-bottom: 3px solid #1e40af;
            margin-bottom: 30px;
          }
          
          .logo-left {
            position: absolute;
            left: 0;
            top: 10px;
            width: 80px;
            height: 80px;
          }
          
          .logo-right {
            position: absolute;
            right: 0;
            top: 10px;
            width: 80px;
            height: 80px;
          }
          
          .header-text {
            margin: 0 100px;
          }
          
          .republic {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .province {
            font-size: 13px;
            color: #666;
            margin: 2px 0;
          }
          
          .city {
            font-size: 16px;
            font-weight: bold;
            color: #1e40af;
            margin: 5px 0;
          }
          
          .barangay {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 5px 0;
          }
          
          .office {
            font-size: 12px;
            color: #666;
            font-style: italic;
            margin-top: 5px;
          }
          
          .report-title {
            margin: 30px 0 20px;
            text-align: center;
          }
          
          .title-main {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          
          .title-sub {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
          }
          
          .report-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
          }
          
          .info-item {
            text-align: center;
          }
          
          .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          
          .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #1e40af;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .data-table thead tr {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
          }
          
          .data-table th {
            padding: 12px 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #1e40af;
          }
          
          .data-table td {
            padding: 8px;
            border: 1px solid #e2e8f0;
            font-size: 9px;
            vertical-align: top;
          }
          
          .data-table tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .data-table tbody tr:hover {
            background: #e2e8f0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #1e40af;
            text-align: center;
          }
          
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin: 40px 0 20px;
          }
          
          .signature-box {
            text-align: center;
            width: 200px;
          }
          
          .signature-line {
            border-bottom: 1px solid #333;
            margin: 30px 0 5px;
            height: 1px;
          }
          
          .signature-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .document-info {
            font-size: 9px;
            color: #666;
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 4px;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          @media print {
            body { 
              margin: 0; 
              padding: 15px;
              font-size: 12px;
            }
            
            .document-container {
              max-width: none;
              margin: 0;
            }
            
            .no-print { 
              display: none; 
            }
            
            .data-table {
              page-break-inside: auto;
            }
            
            .data-table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            .data-table thead {
              display: table-header-group;
            }
            
            .letterhead {
              position: relative;
              margin-bottom: 20px;
            }
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="document-container">
          <!-- Letterhead -->
          <div class="letterhead">
            <div class="logo-left">
              <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                <circle cx="50" cy="50" r="45" fill="#1e40af" stroke="#fff" stroke-width="2"/>
                <text x="50" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="bold">BARANGAY</text>
                <text x="50" y="50" text-anchor="middle" fill="white" font-size="6">NEW</text>
                <text x="50" y="65" text-anchor="middle" fill="white" font-size="6">CABALAN</text>
              </svg>
            </div>
            
            <div class="logo-right">
              <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
                <circle cx="50" cy="50" r="45" fill="#dc2626" stroke="#fff" stroke-width="2"/>
                <text x="50" y="30" text-anchor="middle" fill="white" font-size="6" font-weight="bold">OLONGAPO</text>
                <text x="50" y="45" text-anchor="middle" fill="white" font-size="6">CITY</text>
                <text x="50" y="60" text-anchor="middle" fill="white" font-size="5">GOVERNMENT</text>
              </svg>
            </div>
            
            <div class="header-text">
              <div class="republic">Republic of the Philippines</div>
              <div class="province">Province of Zambales</div>
              <div class="city">City of Olongapo</div>
              <div class="barangay">Barangay New Cabalan</div>
              <div class="office">Office of the Punong Barangay</div>
            </div>
          </div>
          
          <!-- Report Title -->
          <div class="report-title">
            <div class="title-main">${scopeText}</div>
            <div class="title-sub">Official Residents Database Report</div>
          </div>
          
          <!-- Report Information -->
          <div class="report-info">
            <div class="info-item">
              <div class="info-label">Total Records</div>
              <div class="info-value">${residents.length.toLocaleString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Report Type</div>
              <div class="info-value">${scope === 'all' ? 'Complete Database' : 'Filtered Results'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Generated On</div>
              <div class="info-value">${today}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Time</div>
              <div class="info-value">${timeGenerated}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Columns</div>
              <div class="info-value">${selectedColumns.length}</div>
            </div>
          </div>
          
          <!-- Data Table -->
          <table class="data-table">
            <thead>
              <tr>
                ${selectedColumns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${residents.map(resident => {
                const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName || ''} ${resident.personalInfo.lastName}`.trim();
                const address = this.getFullAddress(resident);
                const age = this.calculateAge(resident.personalInfo.birthDate);
                const status = resident.otherDetails.status;
                
                const rowData: { [key: string]: string } = {
                  fullName: fullName,
                  gender: resident.personalInfo.gender || '-',
                  age: age.toString(),
                  birthDate: resident.personalInfo.birthDate ? new Date(resident.personalInfo.birthDate).toLocaleDateString() : '-',
                  civilStatus: resident.personalInfo.civilStatus || '-',
                  address: address,
                  contactNo: resident.personalInfo.contactNo || '-',
                  occupation: resident.personalInfo.occupation || '-',
                  monthlyIncome: resident.personalInfo.monthlyIncome ? '₱' + resident.personalInfo.monthlyIncome.toLocaleString() : '-',
                  pwd: resident.personalInfo.pwd || '-',
                  indigent: resident.personalInfo.indigent || '-',
                  soloParent: resident.personalInfo.soloParent || '-',
                  seniorCitizen: resident.personalInfo.seniorCitizen || '-',
                  fourPsMember: resident.personalInfo.fourPsMember || '-',
                  registeredVoter: resident.personalInfo.registeredVoter || '-',
                  dateOfRegistration: this.formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt),
                  status: status
                };
                
                return `
                  <tr>
                    ${selectedColumns.map(col => `<td>${rowData[col.key] || '-'}</td>`).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <!-- Signature Section -->
          <div class="signature-section">
            <div class="signature-box">
              <div>Prepared by:</div>
              <div class="signature-line"></div>
              <div class="signature-label">Database Administrator</div>
            </div>
            <div class="signature-box">
              <div>Reviewed by:</div>
              <div class="signature-line"></div>
              <div class="signature-label">Barangay Secretary</div>
            </div>
            <div class="signature-box">
              <div>Approved by:</div>
              <div class="signature-line"></div>
              <div class="signature-label">Punong Barangay</div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="document-info">
              <strong>Document Reference:</strong> BNC-RES-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}<br>
              <strong>Generated by:</strong> Barangay New Cabalan Portal System v1.0<br>
              <strong>Authorized for:</strong> Official Use Only - Confidential<br>
              <em>This document contains sensitive personal information. Handle with care and dispose of securely.</em>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }, 500);
          }
        </script>
      </body>
      </html>
    `;
    
    // Open in new window and print
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      alert('Please allow pop-ups to export PDF reports.');
    }
  }

  // Approval action methods
  async approveResident(resident: ResidentInfo) {
    const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '. ' : ''}${resident.personalInfo.lastName}`;
    
    // Show SweetAlert2 confirmation for approval
    const result = await Swal.fire({
      title: 'Approve Registration',
      html: `Are you sure you want to approve <strong>${fullName}</strong>'s registration?<br><br>
             <div class="text-left bg-green-50 p-3 rounded-lg mt-3 border border-green-200">
               <p class="font-semibold text-green-800 mb-2">Approval Action:</p>
               <ul class="text-xs text-green-700 space-y-1">
                 <li>• User account will be activated</li>
                 <li>• User will be able to log in immediately</li>
                 <li>• Approval status will be set to "Approved"</li>
                 <li>• Approval timestamp will be recorded</li>
               </ul>
             </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
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

    if (result.isConfirmed && resident.$id && resident.uid) {
      this.approvingResidentId = resident.$id;
      try {
        await this.adminService.approveResident(resident.$id, resident.uid);
        
        // Remove from pending list
        this.pendingResidents = this.pendingResidents.filter(r => r.$id !== resident.$id);
        
        // Refresh the All Residents data to include the newly approved resident
        // Use setTimeout to ensure the approval process is fully complete
        setTimeout(() => {
          this.loadResidentsOptimized();
        }, 500);
        
        // Show success message
        await Swal.fire({
          title: 'Registration Approved!',
          html: `<strong>${fullName}</strong>'s registration has been approved successfully.<br><br>
                 <div class="text-left bg-green-50 p-3 rounded-lg border border-green-200">
                   <p class="text-green-700 text-sm">
                     <strong>Actions completed:</strong><br>
                     ✅ Account activated and user can now log in<br>
                     ✅ User added to residents list<br>
                     📧 Email notification sent to ${resident.personalInfo.email}<br><br>
                     <strong>What's next:</strong><br>
                     • User will receive approval email notification<br>
                     • User can access all barangay services<br>
                     • User profile appears in residents management
                   </p>
                 </div>`,
          icon: 'success',
          confirmButtonText: 'Great!',
          background: '#ffffff',
          color: '#374151',
          width: '550px',
          padding: '2rem',
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
          },
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold mb-3 text-green-700',
            htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-6',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
          },
          buttonsStyling: false,
          backdrop: 'rgba(15, 23, 42, 0.4)',
          timer: 6000,
          timerProgressBar: true
        });
        
      } catch (error) {
        console.error('Error approving resident:', error);
        await Swal.fire({
          title: 'Approval Failed',
          text: 'Failed to approve the registration. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl'
          },
          buttonsStyling: false
        });
      } finally {
        this.approvingResidentId = null;
      }
    }
  }

  async rejectResident(resident: ResidentInfo) {
    const fullName = `${resident.personalInfo.firstName} ${resident.personalInfo.middleName ? resident.personalInfo.middleName[0] + '. ' : ''}${resident.personalInfo.lastName}`;
    
    // Show SweetAlert2 input prompt for rejection reason
    const { value: reason, isConfirmed } = await Swal.fire({
      title: 'Reject Registration',
      html: `Are you sure you want to reject <strong>${fullName}</strong>'s registration?<br><br>
             <div class="text-left bg-red-50 p-3 rounded-lg mt-3 border border-red-200">
               <p class="font-semibold text-red-800 mb-2">Rejection Action:</p>
               <ul class="text-xs text-red-700 space-y-1">
                 <li>• User account will remain inactive</li>
                 <li>• User will not be able to log in</li>
                 <li>• Registration status will be set to "Rejected"</li>
                 <li>• Rejection reason will be recorded</li>
               </ul>
             </div>`,
      input: 'textarea',
      inputLabel: 'Reason for rejection (optional)',
      inputPlaceholder: 'Please provide a reason for rejecting this registration...',
      inputAttributes: {
        'aria-label': 'Rejection reason',
        'class': 'mt-3'
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
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
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-4',
        confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm mr-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
        cancelButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        actions: 'gap-3'
      },
      buttonsStyling: false,
      backdrop: 'rgba(15, 23, 42, 0.4)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      preConfirm: (inputValue) => {
        return inputValue || 'No reason provided';
      }
    });

    if (isConfirmed && resident.$id) {
      this.approvingResidentId = resident.$id;
      try {
        await this.adminService.rejectResident(resident.$id, reason);
        
        // Remove from pending list
        this.pendingResidents = this.pendingResidents.filter(r => r.$id !== resident.$id);
        
        // Show success message
        await Swal.fire({
          title: 'Registration Rejected',
          html: `<strong>${fullName}</strong>'s registration has been rejected and completely removed from the system.<br><br>
                 <div class="text-left bg-red-50 p-3 rounded-lg border border-red-200">
                   <p class="text-red-700 text-sm">
                     <strong>Actions completed:</strong><br>
                     ❌ Registration completely rejected<br>
                     �️ User account deleted from system<br>
                     🗑️ Resident record deleted from database<br>
                     📧 Email notification sent to ${resident.personalInfo.email}<br>
                     📝 Rejection reason: ${reason || 'No reason provided'}<br><br>
                     <strong>Status:</strong><br>
                     • User has been notified via email<br>
                     • All user data removed from system<br>
                     • No records kept (complete cleanup)
                   </p>
                 </div>`,
          icon: 'info',
          confirmButtonText: 'OK',
          background: '#ffffff',
          color: '#374151',
          width: '550px',
          padding: '2rem',
          showClass: {
            popup: 'animate__animated animate__zoomIn animate__faster'
          },
          hideClass: {
            popup: 'animate__animated animate__zoomOut animate__faster'
          },
          customClass: {
            popup: 'rounded-2xl shadow-2xl border-0',
            title: 'text-xl font-bold mb-3 text-gray-700',
            htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-6',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
          },
          buttonsStyling: false,
          backdrop: 'rgba(15, 23, 42, 0.4)',
          timer: 6000,
          timerProgressBar: true
        });
        
      } catch (error) {
        console.error('Error rejecting resident:', error);
        await Swal.fire({
          title: 'Rejection Failed',
          text: 'Failed to reject the registration. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            confirmButton: 'font-semibold py-3 px-6 rounded-xl'
          },
          buttonsStyling: false
        });
      } finally {
        this.approvingResidentId = null;
      }
    }
  }
}
