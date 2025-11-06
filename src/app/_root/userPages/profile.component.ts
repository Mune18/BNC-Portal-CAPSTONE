import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentUpdate } from '../../shared/types/resident-update';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8 flex justify-center">
          <div class="flex flex-col items-center">
            <div class="h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
            <p class="text-gray-600 text-sm sm:text-base text-center">Loading profile information...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-red-50 rounded-xl sm:rounded-2xl shadow-sm border border-red-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="text-red-600 text-sm sm:text-base">{{ errorMessage }}</p>
              <button 
                (click)="ngOnInit()" 
                class="mt-3 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm transition w-full sm:w-auto"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Content (only show when not loading and no error) -->
        <ng-container *ngIf="!isLoading && !errorMessage">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 text-white relative overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute -top-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full"></div>
              <div class="absolute -bottom-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full"></div>
            </div>
            
            <div class="relative flex flex-col items-center gap-4 sm:gap-6">
              <!-- Profile Image -->
              <div class="relative">
                <div class="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-lg">
                  <img *ngIf="residentInfo && residentInfo.profileImage" [src]="residentInfo.profileImage" alt="Profile Image" class="w-full h-full object-cover">
                  <svg *ngIf="!residentInfo || !residentInfo.profileImage" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <!-- Status Badge -->
                <div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                  Active
                </div>
              </div>
              
              <!-- Profile Info -->
              <div class="text-center flex-1 w-full">
                <div class="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight px-2">
                  {{ residentInfo ? residentInfo.personalInfo.firstName : '-' }} 
                  {{ residentInfo && residentInfo.personalInfo.middleName ? residentInfo.personalInfo.middleName + ' ' : '' }}
                  {{ residentInfo ? residentInfo.personalInfo.lastName : '-' }} 
                  <span *ngIf="residentInfo && residentInfo.personalInfo.suffix" class="text-lg sm:text-xl">{{ residentInfo.personalInfo.suffix }}</span>
                </div>
                
                <div class="flex flex-col gap-3 sm:gap-4 px-2">
                  <div class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span class="text-base sm:text-lg font-medium">{{ residentInfo ? residentInfo.personalInfo.occupation || 'Resident' : 'Resident' }}</span>
                  </div>
                  <div class="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-sm sm:text-base text-center">Purok {{ residentInfo ? residentInfo.personalInfo.purokNo || 'N/A' : 'N/A' }}, Barangay New Cabalan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6 lg:mb-8">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <div class="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 class="text-lg sm:text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <button
                  class="px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition shadow-md hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 min-h-[44px]"
                  (click)="showEdit = true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Request Edit
                </button>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="p-4 sm:p-6">
              <!-- Basic Information Section -->
              <div class="mb-6 sm:mb-8">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Basic Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base leading-relaxed">
                      {{ residentInfo ? residentInfo.personalInfo.firstName : '-' }} 
                      {{ residentInfo && residentInfo.personalInfo.middleName ? residentInfo.personalInfo.middleName + ' ' : '' }}
                      {{ residentInfo ? residentInfo.personalInfo.lastName : '-' }} 
                      <span *ngIf="residentInfo && residentInfo.personalInfo.suffix">{{ residentInfo.personalInfo.suffix }}</span>
                    </div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.gender : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? formatDate(residentInfo.personalInfo.birthDate) : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Place of Birth</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.birthPlace : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? calculateAge(residentInfo.personalInfo.birthDate) : '-' }} years old</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Civil Status</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.civilStatus : '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Contact & Background Section -->
              <div class="mb-6 sm:mb-8">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  Contact & Background
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base break-all">{{ residentInfo ? residentInfo.personalInfo.email : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Number</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.contactNo : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.nationality : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Religion</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.religion : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupation</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.occupation : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Income</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">₱{{ residentInfo ? (residentInfo.personalInfo.monthlyIncome | number:'1.2-2') : '-' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Registered Voter</div>
                    <div class="flex items-center gap-2">
                      <span [class]="residentInfo && residentInfo.personalInfo.registeredVoter === 'Yes' ? 'w-2 h-2 bg-green-500 rounded-full' : 'w-2 h-2 bg-red-500 rounded-full'"></span>
                      <span class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.registeredVoter : '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Section -->
              <div class="mb-6 sm:mb-8">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Address Information
                </h3>
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <div class="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
                        {{ residentInfo ? residentInfo.personalInfo.houseNo : '-' }} {{ residentInfo ? residentInfo.personalInfo.street : '-' }}
                      </div>
                      <div class="text-sm sm:text-base text-gray-600 mt-1">
                        Purok {{ residentInfo ? residentInfo.personalInfo.purokNo : '-' }}, Barangay New Cabalan, Olongapo City
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Special Categories Section -->
              <div class="mb-6 sm:mb-8">
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Special Categories & Benefits
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div class="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-400">
                    <div class="text-xs sm:text-sm font-medium text-blue-800">PWD Status</div>
                    <div class="text-blue-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.pwd : '-' }}</div>
                    <div *ngIf="residentInfo && residentInfo.personalInfo.pwdIdNo" class="text-xs text-blue-600 mt-1">ID: {{ residentInfo.personalInfo.pwdIdNo }}</div>
                  </div>
                  <div class="bg-green-50 rounded-lg p-3 sm:p-4 border-l-4 border-green-400">
                    <div class="text-xs sm:text-sm font-medium text-green-800">Senior Citizen</div>
                    <div class="text-green-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.seniorCitizen : '-' }}</div>
                    <div *ngIf="residentInfo && residentInfo.personalInfo.seniorCitizenIdNo" class="text-xs text-green-600 mt-1">ID: {{ residentInfo.personalInfo.seniorCitizenIdNo }}</div>
                  </div>
                  <div class="bg-purple-50 rounded-lg p-3 sm:p-4 border-l-4 border-purple-400">
                    <div class="text-xs sm:text-sm font-medium text-purple-800">Solo Parent</div>
                    <div class="text-purple-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.soloParent : '-' }}</div>
                    <div *ngIf="residentInfo && residentInfo.personalInfo.soloParentIdNo" class="text-xs text-purple-600 mt-1">ID: {{ residentInfo.personalInfo.soloParentIdNo }}</div>
                  </div>
                  <div class="bg-yellow-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-400">
                    <div class="text-xs sm:text-sm font-medium text-yellow-800">4Ps Member</div>
                    <div class="text-yellow-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.fourPsMember : '-' }}</div>
                  </div>
                  <div class="bg-red-50 rounded-lg p-3 sm:p-4 border-l-4 border-red-400">
                    <div class="text-xs sm:text-sm font-medium text-red-800">Indigent Status</div>
                    <div class="text-red-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.personalInfo.indigent : '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Government IDs Section -->
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Government IDs
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">National ID Number</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo && residentInfo.otherDetails.nationalIdNo || 'Not provided' }}</div>
                  </div>
                  <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Voter's ID Number</div>
                    <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo && residentInfo.otherDetails.votersIdNo || 'Not provided' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Emergency Contact Card -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6 lg:mb-8">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-red-50 to-orange-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 class="text-lg sm:text-xl font-bold text-gray-900">Emergency Contact</h2>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="p-4 sm:p-6">
              <div class="bg-red-50 rounded-xl p-3 sm:p-4 border-l-4 border-red-400 mb-4 sm:mb-6">
                <div class="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div class="flex-1">
                    <div class="text-xs sm:text-sm font-medium text-red-800">Important Information</div>
                    <div class="text-red-700 text-xs sm:text-sm mt-1 leading-relaxed">This person will be contacted in case of emergencies. Please ensure the information is accurate and up-to-date.</div>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact Person</div>
                  <div class="text-gray-900 font-semibold text-base sm:text-lg">{{ residentInfo ? residentInfo.emergencyContact.fullName : '-' }}</div>
                </div>
                <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Relationship</div>
                  <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.emergencyContact.relationship : '-' }}</div>
                </div>
                <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</div>
                  <div class="text-gray-900 font-semibold text-sm sm:text-base">{{ residentInfo ? residentInfo.emergencyContact.contactNo : '-' }}</div>
                </div>
                <div class="space-y-1 p-3 sm:p-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none">
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</div>
                  <div class="text-gray-900 font-semibold text-sm sm:text-base leading-relaxed">{{ residentInfo ? residentInfo.emergencyContact.address : '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Update Requests Status Card -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6 lg:mb-8" *ngIf="updateRequests && updateRequests.length > 0">
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-bold text-gray-900">Update Request History</h2>
                  <div class="text-xs sm:text-sm text-gray-600">{{ updateRequests.length }} request{{ updateRequests.length !== 1 ? 's' : '' }} submitted</div>
                </div>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="p-4 sm:p-6">
              <div class="space-y-3 sm:space-y-4">
                <div *ngFor="let request of (showAllRequests ? updateRequests : updateRequests.slice(0, 5))" class="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2 sm:gap-3">
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div class="text-xs sm:text-sm font-bold text-gray-900 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                        #{{ request.$id?.slice(-6) }}
                      </div>
                      <span 
                        class="px-2 sm:px-3 py-1 text-xs rounded-full font-medium"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800 border border-yellow-200': request.status === 'pending',
                          'bg-green-100 text-green-800 border border-green-200': request.status === 'approved',
                          'bg-red-100 text-red-800 border border-red-200': request.status === 'rejected'
                        }"
                      >
                        {{ getStatusDisplay(request.status) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-3">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-gray-600">Submitted: {{ formatDate(request.createdAt) }}</span>
                    </div>
                    <div *ngIf="request.reviewedAt" class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-gray-600">Reviewed: {{ formatDate(request.reviewedAt) }}</span>
                    </div>
                  </div>
                  
                  <!-- Status Messages -->
                  <div *ngIf="request.status === 'pending'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="text-yellow-800 text-xs sm:text-sm">
                      <div class="font-medium">Under Review</div>
                      <div class="leading-relaxed">Your update request is pending approval from the Barangay Admin.</div>
                    </div>
                  </div>
                  
                  <div *ngIf="request.status === 'approved'" class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="text-green-800 text-xs sm:text-sm">
                      <div class="font-medium">Approved</div>
                      <div class="leading-relaxed">Your information has been updated successfully.</div>
                    </div>
                  </div>
                  
                  <div *ngIf="request.status === 'rejected'" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div class="text-red-800 text-xs sm:text-sm">
                      <div class="font-medium">Declined</div>
                      <div *ngIf="request.reason" class="leading-relaxed">Reason: {{ request.reason }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Show All Requests Button (only when there are more than 5 requests) -->
              <div *ngIf="updateRequests.length > 5" class="mt-4 sm:mt-6 text-center">
                <button
                  (click)="showAllRequests = !showAllRequests"
                  class="px-4 sm:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto shadow-md hover:shadow-lg min-h-[44px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  {{ showAllRequests ? 'Show Less' : 'Show All Requests' }}
                </button>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Edit Information Modal -->
        <div
          *ngIf="showEdit"
          class="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
        >
          <!-- Blurred background overlay -->
          <div class="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
          <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 w-full max-w-4xl relative overflow-y-auto max-h-[95vh] sm:max-h-[90vh] z-10">
            <button
              class="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-600 hover:text-gray-900 text-lg sm:text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
              (click)="showEdit = false"
              [disabled]="saveLoading"
            >✕</button>
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pr-10">Request Information Update</h2>
            
            <!-- Info Message -->
            <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm">
              <div class="flex items-start gap-2 sm:gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <p class="font-medium mb-1">Information Update Process</p>
                  <p class="leading-relaxed">Your changes will be submitted for approval by the Barangay Admin. You will be notified once your request has been reviewed.</p>
                </div>
              </div>
            </div>
            
            <!-- Error/Success Messages -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{{ errorMessage }}</div>
            <div *ngIf="saveSuccess" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Update request submitted successfully! Please wait for admin approval.</span>
            </div>
            
            <form (ngSubmit)="saveEdit()" #editForm="ngForm" class="space-y-4 sm:space-y-6">
              <!-- Personal Information Section -->
              <div class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Personal Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.lastName" name="lastName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" required />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.firstName" name="firstName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" required />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Middle Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.middleName" name="middleName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Suffix</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.suffix" name="suffix" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select [(ngModel)]="editInfo.personalInfo.gender" name="gender" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Date</label>
                    <input type="date" [(ngModel)]="editInfo.personalInfo.birthDate" name="birthDate" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Place</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.birthPlace" name="birthPlace" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Civil Status</label>
                    <select [(ngModel)]="editInfo.personalInfo.civilStatus" name="civilStatus" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Nationality</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.nationality" name="nationality" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Religion</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.religion" name="religion" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Occupation</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.occupation" name="occupation" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input type="email" [(ngModel)]="editInfo.personalInfo.email" name="email" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                    <input type="tel" [(ngModel)]="editInfo.personalInfo.contactNo" name="contactNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD</label>
                    <select [(ngModel)]="editInfo.personalInfo.pwd" name="pwd" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.pwdIdNo" name="pwdIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Monthly Income</label>
                    <input type="number" [(ngModel)]="editInfo.personalInfo.monthlyIncome" name="monthlyIncome" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Indigent</label>
                    <select [(ngModel)]="editInfo.personalInfo.indigent" name="indigent" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent</label>
                    <select [(ngModel)]="editInfo.personalInfo.soloParent" name="soloParent" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.soloParentIdNo" name="soloParentIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen</label>
                    <select [(ngModel)]="editInfo.personalInfo.seniorCitizen" name="seniorCitizen" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.seniorCitizenIdNo" name="seniorCitizenIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">4Ps Member</label>
                    <select [(ngModel)]="editInfo.personalInfo.fourPsMember" name="fourPsMember" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Registered Voter</label>
                    <select [(ngModel)]="editInfo.personalInfo.registeredVoter" name="registeredVoter" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Purok No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.purokNo" name="purokNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">House No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.houseNo" name="houseNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Street</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.street" name="street" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">National ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.otherDetails.nationalIdNo" name="nationalIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Voter's ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.otherDetails.votersIdNo" name="votersIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                </div>
              </div>

              <!-- Emergency Contact Section -->
              <div class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Emergency Contact</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.fullName" name="emergencyFullName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Relationship</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.relationship" name="emergencyRelationship" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                    <input type="tel" [(ngModel)]="editInfo.emergencyContact.contactNo" name="emergencyContactNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Address</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.address" name="emergencyAddress" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-medium transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-md hover:shadow-lg min-h-[44px]"
                  [disabled]="saveLoading || saveSuccess"
                >
                  <span *ngIf="saveLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span *ngIf="saveSuccess" class="h-4 w-4">✓</span>
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    :host {
      display: block;
      background: #f3f4f6;
    }
    ::-webkit-scrollbar {
      width: 6px;
      background: #e5e7eb;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 6px;
    }
    @media (max-width: 640px) {
      ::-webkit-scrollbar {
        width: 4px;
      }
    }
    /* Ensure text doesn't overflow on small screens */
    .text-wrap {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    /* Rotation animation for chevron */
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class ProfileComponent implements OnInit {
  residentInfo: ResidentInfo = {
    personalInfo: {
      lastName: '',
      firstName: '',
      middleName: '',
      suffix: '',
      gender: '',
      birthDate: '',
      birthPlace: '',
      age: 0,
      civilStatus: '',
      nationality: '',
      religion: '',
      occupation: '',
      email: '',
      contactNo: '',
      pwd: '',
      pwdIdNo: '',
      monthlyIncome: 0,
      indigent: '',
      soloParent: '',
      soloParentIdNo: '',
      seniorCitizen: '',
      seniorCitizenIdNo: '',
      fourPsMember: '',
      registeredVoter: '',
      purokNo: '',
      houseNo: '',
      street: ''
    },
    emergencyContact: {
      fullName: '',
      relationship: '',
      contactNo: '',
      address: ''
    },
    otherDetails: {
      nationalIdNo: '',
      votersIdNo: '',
      status: '',
      dateOfRegistration: ''
    }
  };
  editInfo: ResidentInfo = this.getEmptyResidentInfo();
  updateRequests: ResidentUpdate[] = [];
  showEdit = false;
  showAllRequests = false; // Property to control showing all requests vs first 5
  isLoading = true;
  errorMessage = '';
  saveLoading = false;
  saveSuccess = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private residentUpdateService: ResidentUpdateService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      console.log('Initializing profile component...');
      // Get the current authenticated user's account
      const account = await this.authService.getAccount();
      
      if (!account) {
        console.log('No account found, redirecting to sign-in');
        this.router.navigate(['/sign-in']);
        return;
      }
      
      console.log('Account found:', account.$id);
      // Get the user's document from database using the account ID
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc) {
        console.log('User information retrieved:', userDoc);
        this.residentInfo = userDoc;
        // Create a deep copy for editing
        this.editInfo = JSON.parse(JSON.stringify(userDoc));
        
        // Load update requests for this user
        this.updateRequests = await this.residentUpdateService.getUserUpdateRequests(account.$id);
      } else {
        console.log('No user information found');
        this.errorMessage = 'Unable to load profile information.';
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Error loading profile data. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async saveEdit() {
    this.saveLoading = true;
    this.saveSuccess = false;
    this.errorMessage = '';
    
    try {
      const account = await this.authService.getAccount();
      
      if (!account) {
        this.router.navigate(['/sign-in']);
        return;
      }
      
      // Find user document by account ID first
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc && userDoc.$id) {
        // Calculate the changes between original and edited info
        const changes = this.getChanges(this.residentInfo, this.editInfo);
        
        if (Object.keys(changes).length === 0) {
          this.errorMessage = 'No changes detected.';
          return;
        }
        
        // Submit update request instead of directly updating
        await this.residentUpdateService.submitUpdateRequest({
          residentId: userDoc.$id, // This should be the resident document ID
          userId: account.$id,     // This is the auth user ID
          changes: changes
        });
        
        this.saveSuccess = true;
        
        // Reload update requests to show the new one
        this.updateRequests = await this.residentUpdateService.getUserUpdateRequests(account.$id);
        
        // Close the modal after 2 seconds
        setTimeout(() => {
          this.showEdit = false;
          this.saveSuccess = false;
        }, 2000);
      } else {
        this.errorMessage = 'Unable to submit update request: User document not found.';
      }
    } catch (error) {
      console.error('Error submitting update request:', error);
      this.errorMessage = 'Failed to submit update request. Please try again.';
    } finally {
      this.saveLoading = false;
    }
  }

  // Helper method to create empty ResidentInfo structure
  private getEmptyResidentInfo(): ResidentInfo {
    return {
      personalInfo: {
        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',
        gender: '',
        birthDate: '',
        birthPlace: '',
        age: 0,
        civilStatus: '',
        nationality: '',
        religion: '',
        occupation: '',
        email: '',
        contactNo: '',
        pwd: '',
        pwdIdNo: '',
        monthlyIncome: 0,
        indigent: '',
        soloParent: '',
        soloParentIdNo: '',
        seniorCitizen: '',
        seniorCitizenIdNo: '',
        fourPsMember: '',
        registeredVoter: '',
        purokNo: '',
        houseNo: '',
        street: ''
      },
      emergencyContact: {
        fullName: '',
        relationship: '',
        contactNo: '',
        address: ''
      },
      otherDetails: {
        nationalIdNo: '',
        votersIdNo: '',
        status: '',
        dateOfRegistration: ''
      }
    };
  }

  // Add this method to format dates
  formatDate(dateString: string | number | Date): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '-';
    
    // Format date as "Month Day, Year" (e.g., "July 18, 2004")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      default:
        return status;
    }
  }

  /**
   * Compare original and edited info to get only the changed fields
   */
  private getChanges(original: ResidentInfo, edited: ResidentInfo): Partial<ResidentInfo> {
    const changes: any = {};
    
    // Compare personalInfo
    const personalChanges: any = {};
    Object.keys(edited.personalInfo).forEach(key => {
      const originalValue = (original.personalInfo as any)[key];
      const editedValue = (edited.personalInfo as any)[key];
      if (originalValue !== editedValue) {
        personalChanges[key] = editedValue;
      }
    });
    if (Object.keys(personalChanges).length > 0) {
      changes.personalInfo = personalChanges;
    }
    
    // Compare emergencyContact
    const emergencyChanges: any = {};
    Object.keys(edited.emergencyContact).forEach(key => {
      const originalValue = (original.emergencyContact as any)[key];
      const editedValue = (edited.emergencyContact as any)[key];
      if (originalValue !== editedValue) {
        emergencyChanges[key] = editedValue;
      }
    });
    if (Object.keys(emergencyChanges).length > 0) {
      changes.emergencyContact = emergencyChanges;
    }
    
    // Compare otherDetails
    const otherChanges: any = {};
    Object.keys(edited.otherDetails).forEach(key => {
      const originalValue = (original.otherDetails as any)[key];
      const editedValue = (edited.otherDetails as any)[key];
      if (originalValue !== editedValue) {
        otherChanges[key] = editedValue;
      }
    });
    if (Object.keys(otherChanges).length > 0) {
      changes.otherDetails = otherChanges;
    }
    
    return changes;
  }
}
