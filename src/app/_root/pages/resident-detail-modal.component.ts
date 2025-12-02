import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidentInfo } from '../../shared/types/resident';

@Component({
  selector: 'app-resident-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 backdrop-blur-md bg-black/50" (click)="close.emit()"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden z-10 flex flex-col">
        <!-- Modal Header -->
        <div class="flex-shrink-0 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl border-b-2 border-gray-200 px-6 py-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {{ showApprovalActions ? 'Registration Review' : 'Resident Details' }}
            </h2>
            <div *ngIf="showApprovalActions" class="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full shadow-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Approval
            </div>
          </div>
          <button 
            (click)="close.emit()" 
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto">
          <!-- Profile Header Section -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white relative overflow-hidden">
            <!-- Background decorations -->
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
            
            <!-- Approval Notice (shown when in approval mode) -->
            <div *ngIf="showApprovalActions" class="mb-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-4 text-yellow-900 text-sm shadow-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Registration Review Mode</span>
              </div>
              <p class="mt-1 text-xs">Please review the applicant's information carefully before approving or rejecting their registration.</p>
            </div>
            
            <div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <!-- Profile Image -->
              <div class="flex-shrink-0">
                <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                  <img *ngIf="resident?.profileImage" [src]="resident!.profileImage" alt="Profile Image" class="w-full h-full object-cover">
                  <span *ngIf="!resident?.profileImage" class="text-3xl sm:text-4xl font-bold text-white">
                    {{ resident?.personalInfo?.firstName?.charAt(0) || 'R' }}
                  </span>
                </div>
              </div>
              
              <!-- Basic Info -->
              <div class="flex-grow text-center sm:text-left">
                <h3 class="text-2xl sm:text-3xl font-bold mb-2">
                  {{ getFullName() }}
                </h3>
                <p class="text-blue-100 text-lg mb-4">
                  {{ resident?.personalInfo?.occupation || 'Resident of Barangay New Cabalan' }}
                </p>
                
                <!-- Quick Stats -->
                <div class="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                  <div class="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 shadow-md border border-white/40">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>{{ calculateAge(resident?.personalInfo?.birthDate || '') }} years old</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 shadow-md border border-white/40">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>{{ resident?.personalInfo?.contactNo || 'No contact' }}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-4 py-2 shadow-md border border-white/40">
                    <div class="w-2 h-2 rounded-full" [class]="getStatusColor()"></div>
                    <span>{{ getStatus() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-white border-b border-gray-200 px-6">
            <nav class="flex space-x-8 -mb-px">
              <button
                *ngFor="let tab of tabs"
                class="px-1 py-4 text-sm font-semibold transition-all border-b-3 relative group"
                [class.border-blue-600]="activeTab === tab.id"
                [class.text-blue-600]="activeTab === tab.id"
                [class.bg-blue-50]="activeTab === tab.id"
                [class.border-transparent]="activeTab !== tab.id"
                [class.text-gray-500]="activeTab !== tab.id"
                [class.hover:text-gray-700]="activeTab !== tab.id"
                [class.hover:border-gray-300]="activeTab !== tab.id"
                [class.hover:bg-gray-50]="activeTab !== tab.id"
                (click)="activeTab = tab.id"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="tab.id === 'personal'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    <path *ngIf="tab.id === 'address'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path *ngIf="tab.id === 'emergency'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    <path *ngIf="tab.id === 'other'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {{ tab.name }}
                </div>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="px-6 py-6">
          <!-- Tab Content -->
          <div class="px-6 py-6">
            <!-- Personal Info Tab -->
            <div *ngIf="activeTab === 'personal'" class="space-y-6">
              <!-- Basic Information Section -->
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 flex items-center gap-2">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Basic Information
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <p class="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                    <p class="text-gray-900 font-medium">{{ getFullName() }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Gender</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.gender || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Birth Date</p>
                    <p class="text-gray-900">{{ formatDate(resident?.personalInfo?.birthDate) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Birth Place</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.birthPlace || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Civil Status</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.civilStatus || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Nationality</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.nationality || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Religion</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.religion || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Educational Attainment</p>
                    <p class="text-gray-900">{{ formatEducationalAttainment(resident?.personalInfo?.educationalAttainment) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Registered Voter</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.registeredVoter === 'Yes' ? 'bg-green-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.registeredVoter || '-' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact & Work Information Section -->
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 flex items-center gap-2">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  Contact & Work Information
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Employment Status</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.employmentStatus || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Occupation</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.occupation || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Monthly Income</p>
                    <p class="text-gray-900">₱{{ resident?.personalInfo?.monthlyIncome || 0 | number }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p class="text-gray-900 break-all">{{ resident?.personalInfo?.email || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Contact Number</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.contactNo || '-' }}</p>
                  </div>
                </div>
              </div>

              <!-- Special Status & Benefits Section -->
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 flex items-center gap-2">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                    </svg>
                  </div>
                  Special Status & Benefits
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">PWD Status</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.pwd === 'Yes' ? 'bg-green-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.pwd || '-' }}</p>
                    </div>
                    <p *ngIf="resident?.personalInfo?.pwd === 'Yes' && resident?.personalInfo?.pwdIdNo" class="text-sm text-gray-600 mt-1">
                      ID: {{ resident!.personalInfo!.pwdIdNo }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Indigent Status</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.indigent === 'Yes' ? 'bg-orange-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.indigent || '-' }}</p>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Solo Parent</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.soloParent === 'Yes' ? 'bg-purple-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.soloParent || '-' }}</p>
                    </div>
                    <p *ngIf="resident?.personalInfo?.soloParent === 'Yes' && resident?.personalInfo?.soloParentIdNo" class="text-sm text-gray-600 mt-1">
                      ID: {{ resident!.personalInfo!.soloParentIdNo }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Senior Citizen</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.seniorCitizen === 'Yes' ? 'bg-blue-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.seniorCitizen || '-' }}</p>
                    </div>
                    <p *ngIf="resident?.personalInfo?.seniorCitizen === 'Yes' && resident?.personalInfo?.seniorCitizenIdNo" class="text-sm text-gray-600 mt-1">
                      ID: {{ resident!.personalInfo!.seniorCitizenIdNo }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">4Ps Member</p>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" [class]="resident?.personalInfo?.fourPsMember === 'Yes' ? 'bg-yellow-500' : 'bg-gray-400'"></div>
                      <p class="text-gray-900">{{ resident?.personalInfo?.fourPsMember || '-' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Government IDs Section -->
              <div *ngIf="resident?.otherDetails?.nationalIdNo || resident?.otherDetails?.votersIdNo">
                <h4 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 flex items-center gap-2">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                      <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Government IDs
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div *ngIf="resident?.otherDetails?.nationalIdNo" class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">National ID Number</p>
                    <p class="text-gray-900">{{ resident!.otherDetails!.nationalIdNo }}</p>
                  </div>
                  <div *ngIf="resident?.otherDetails?.votersIdNo" class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Voter's ID Number</p>
                    <p class="text-gray-900">{{ resident!.otherDetails!.votersIdNo }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Address Tab -->
            <div *ngIf="activeTab === 'address'" class="space-y-6">
              <!-- Address & Housing Information Section -->
              <div>
                <h4 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 flex items-center gap-2">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  Address & Housing Information
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Housing Ownership</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.housingOwnership || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Years in Barangay</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.yearsInBarangay ? resident?.personalInfo?.yearsInBarangay + ' years' : '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Purok Number</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.purokNo || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">House Number</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.houseNo || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Street</p>
                    <p class="text-gray-900">{{ resident?.personalInfo?.street || '-' }}</p>
                  </div>
                </div>
                
                <div class="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-md">
                  <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-blue-800 mb-1">Complete Address</p>
                      <p class="text-blue-700 text-lg">{{ getFullAddress() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Emergency Contact Tab -->
            <div *ngIf="activeTab === 'emergency'" class="space-y-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Emergency Contact Information</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                    <p class="text-gray-900 font-medium">{{ resident?.emergencyContact?.fullName || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Relationship</p>
                    <p class="text-gray-900">{{ resident?.emergencyContact?.relationship || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Contact Number</p>
                    <p class="text-gray-900">{{ resident?.emergencyContact?.contactNo || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Address</p>
                    <p class="text-gray-900">{{ resident?.emergencyContact?.address || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Other Details Tab -->
            <div *ngIf="activeTab === 'other'" class="space-y-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Registration & Status</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Date of Registration</p>
                    <p class="text-gray-900">{{ formatDate(getRegistrationDate()) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-4">
                    <p class="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full" [class]="getStatusColor()"></div>
                      <p class="text-gray-900 font-medium">{{ getStatus() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer - Sticky at bottom -->
        <div class="sticky bottom-0 flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl shadow-lg">
          <!-- Approval Actions (shown when showApprovalActions is true) -->
          <div *ngIf="showApprovalActions" class="flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:w-auto"
              (click)="onReject()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Reject Application
            </button>
            <button 
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:w-auto"
              (click)="onApprove()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Approve Application
            </button>
          </div>

          <!-- Regular Actions (shown when showApprovalActions is false) -->
          <div *ngIf="!showApprovalActions" class="flex flex-col sm:flex-row gap-3 justify-end">
            <!-- Action buttons removed -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ResidentDetailModalComponent {
  @Input() show: boolean = false;
  @Input() resident: ResidentInfo | null = null;
  @Input() showApprovalActions: boolean = false; // New input to control button display
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<ResidentInfo>();
  @Output() approve = new EventEmitter<ResidentInfo>(); // New output for approval
  @Output() reject = new EventEmitter<ResidentInfo>(); // New output for rejection
  
  activeTab: string = 'personal';
  
  tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'address', name: 'Address & Housing' },
    { id: 'emergency', name: 'Emergency Contact' },
    { id: 'other', name: 'Other Details' }
  ];

  getFullName(): string {
    if (!this.resident?.personalInfo) return '-';
    
    const parts = [];
    if (this.resident.personalInfo.firstName) parts.push(this.resident.personalInfo.firstName);
    if (this.resident.personalInfo.middleName) parts.push(this.resident.personalInfo.middleName);
    if (this.resident.personalInfo.lastName) parts.push(this.resident.personalInfo.lastName);
    if (this.resident.personalInfo.suffix) parts.push(this.resident.personalInfo.suffix);
    
    return parts.length > 0 ? parts.join(' ') : '-';
  }

  getStatus(): string {
    if (!this.resident?.otherDetails) return 'Active';
    return this.resident.otherDetails.status || 'Active';
  }

  getStatusColor(): string {
    const status = this.getStatus();
    switch(status) {
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-red-500';
      case 'Deceased': return 'bg-gray-500';
      case 'Archived': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  }

  getRegistrationDate(): string {
    if (this.resident?.otherDetails?.dateOfRegistration) {
      return this.resident.otherDetails.dateOfRegistration;
    }
    return this.resident?.$createdAt || '';
  }
  
  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  }
  
  getFullAddress(): string {
    if (!this.resident?.personalInfo) return '-';
    
    const parts = [];
    if (this.resident.personalInfo.houseNo) parts.push(this.resident.personalInfo.houseNo);
    if (this.resident.personalInfo.street) parts.push(this.resident.personalInfo.street);
    if (this.resident.personalInfo.purokNo) parts.push(`Purok ${this.resident.personalInfo.purokNo}`);
    
    if (parts.length === 0) return '-';
    return parts.join(', ') + ', Barangay New Cabalan, Olongapo City';
  }
  
  onEdit() {
    if (this.resident) {
      this.edit.emit(this.resident);
    }
  }

  onApprove() {
    if (this.resident) {
      this.approve.emit(this.resident);
    }
  }

  onReject() {
    if (this.resident) {
      this.reject.emit(this.resident);
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

  formatEducationalAttainment(value?: string): string {
    if (!value) return '-';
    
    const formatMap: { [key: string]: string } = {
      'ElementaryGraduate': 'Elementary Graduate',
      'HighSchoolGraduate': 'High School Graduate',
      'CollegeGraduate': 'College Graduate',
      'Vocational': 'Vocational'
    };
    
    return formatMap[value] || value;
  }
}