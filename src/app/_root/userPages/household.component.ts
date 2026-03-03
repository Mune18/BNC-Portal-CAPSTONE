import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseholdService } from '../../shared/services/household.service';
import { AddHouseholdMemberFormComponent } from './add-household-member-form.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoadingComponent } from '../../shared/components/loading.component';
import { 
  HouseholdWithMembers, 
  HouseholdMemberWithResident, 
  SearchResidentResult,
  Relationship 
} from '../../shared/types/household';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-household',
  standalone: true,
  imports: [CommonModule, FormsModule, AddHouseholdMemberFormComponent, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-2">
      <div class="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8">
        <!-- Header Section -->
        <div class="mb-3 sm:mb-6 md:mb-8">
          <h1 class="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            My Household
          </h1>
          <p class="text-gray-600 text-xs sm:text-base md:text-lg">Manage your household members</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="w-full">
          <app-loading type="spinner" [fullScreen]="true" message="Loading household information..."></app-loading>
        </div>

        <!-- Household Info -->
        <div *ngIf="!loading && household" class="space-y-3 sm:space-y-6">
          <!-- Household Details Card -->
          <div class="bg-white rounded-lg sm:rounded-2xl shadow-lg p-3 sm:p-5 md:p-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-6 gap-2 sm:gap-0">
              <div class="flex-1">
                <h2 class="text-base sm:text-xl md:text-2xl font-bold text-gray-900">Household Information</h2>
                <p class="text-[10px] sm:text-sm text-gray-500 mt-0.5 break-all sm:break-normal leading-tight">
                  Code: <span class="font-mono font-semibold text-blue-600">{{ household.householdCode }}</span>
                </p>
              </div>
              <div class="text-left sm:text-right">
                <p class="text-[10px] sm:text-sm text-gray-500">Total Members</p>
                <p class="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ household.totalMembers }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md sm:rounded-xl p-2 sm:p-4">
                <p class="text-[10px] sm:text-sm text-gray-600 mb-0.5">Purok No.</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">{{ household.purokNo }}</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md sm:rounded-xl p-2 sm:p-4">
                <p class="text-[10px] sm:text-sm text-gray-600 mb-0.5">House No.</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">{{ household.houseNo }}</p>
              </div>
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md sm:rounded-xl p-2 sm:p-4 col-span-2 md:col-span-1">
                <p class="text-[10px] sm:text-sm text-gray-600 mb-0.5">Street</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900 truncate" title="{{ household.street }}">{{ household.street }}</p>
              </div>
            </div>
          </div>

          <!-- Add Member Button -->
          <div class="flex justify-center sm:justify-end">
            <button 
              (click)="openAddMemberModal()"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-base rounded-md sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-xs sm:text-base">Add Member</span>
            </button>
          </div>

          <!-- Household Members List -->
          <div class="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-3 sm:px-5 md:px-6 py-2 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h3 class="text-sm sm:text-lg md:text-xl font-bold text-gray-900">Household Members</h3>
            </div>

            <div class="divide-y divide-gray-200">
              <div *ngFor="let member of household.members" 
                   class="p-2.5 sm:p-4 md:p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                <div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div class="flex items-start gap-2 sm:gap-4 flex-1 w-full sm:w-auto">
                    <!-- Profile Image -->
                    <div class="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                      <img *ngIf="member.residentInfo?.profileImage" 
                           [src]="member.residentInfo?.profileImage" 
                           alt="Profile" 
                           class="w-full h-full object-cover">
                      <span *ngIf="!member.residentInfo?.profileImage" class="text-white font-bold text-sm sm:text-lg">
                        {{ getInitials(member) }}
                      </span>
                    </div>

                    <!-- Member Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <h4 class="text-sm sm:text-lg font-bold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {{ getMemberName(member) }}
                        </h4>
                        <span class="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap" [class]="getRelationshipBadgeClass(member.relationship)">
                          {{ member.relationship }}
                        </span>
                        <span class="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap" [class]="getStatusBadgeClass(member.status)">
                          {{ formatStatus(member.status) }}
                        </span>
                      </div>

                      <div class="space-y-0.5 sm:space-y-1 text-[10px] sm:text-sm text-gray-600">
                        <p *ngIf="member.residentInfo?.age" class="truncate">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 sm:h-4 sm:w-4 inline mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ member.residentInfo?.age }} years old
                          <span *ngIf="member.residentInfo?.gender"> • {{ member.residentInfo?.gender }}</span>
                        </p>
                        <p *ngIf="member.residentInfo?.contactNo" class="truncate">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 sm:h-4 sm:w-4 inline mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {{ member.residentInfo?.contactNo }}
                        </p>
                        <p *ngIf="member.memberType === 'pending_registration'" class="text-amber-600 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 sm:h-4 sm:w-4 inline mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="hidden sm:inline">Not yet registered • Can claim account later</span>
                          <span class="sm:hidden">Not registered</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1 sm:gap-2 self-start sm:self-center">
                    <button 
                      *ngIf="member.relationship !== 'Head' && member.status !== 'pending_verification'"
                      (click)="removeMember(member)"
                      class="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-md sm:rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div *ngIf="household.members.length === 0" class="p-6 sm:p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-gray-500 text-sm sm:text-lg">No household members yet</p>
                <p class="text-gray-400 text-[10px] sm:text-sm mt-1 sm:mt-2">Click "Add Member" to get started</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Household State -->
        <div *ngIf="!loading && !household" class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-8 md:p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 class="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">No Household Found</h3>
          <p class="text-xs sm:text-base text-gray-600 mb-2">You are not currently part of any household.</p>
          
          <div *ngIf="currentResident?.personalInfo" class="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <!-- Create Own Household Option -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-6 max-w-md mx-auto">
              <h4 class="text-xs sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="text-center">Option 1: Create Your Own Household</span>
              </h4>
              <p class="text-[10px] sm:text-sm text-gray-700 mb-3 sm:mb-4">If you are the head of your family, create a household and add members.</p>
              <button 
                (click)="createOwnHousehold()"
                [disabled]="creatingHousehold"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-base rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ creatingHousehold ? 'Creating...' : 'Create Household' }}
              </button>
            </div>

            <!-- Join Existing Household Option -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-6 max-w-md mx-auto">
              <h4 class="text-xs sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="text-center">Option 2: Join an Existing Household</span>
              </h4>
              <p class="text-[10px] sm:text-sm text-gray-700">If you belong to an existing household, ask the household head to add you as a member from their household page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div *ngIf="showAddMemberModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-1 sm:p-4" (click)="closeAddMemberModal()">
      <div class="bg-white rounded-lg sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[97vh] sm:max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-2 sm:px-6 py-2 sm:py-4 flex justify-between items-center z-10">
          <h3 class="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">Add Member</h3>
          <button (click)="closeAddMemberModal()" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-2 sm:p-6 space-y-2 sm:space-y-6">
          <!-- Step 1: Search Existing Resident -->
          <div [class.hidden]="addMemberStep !== 1">
            <h4 class="text-[10px] sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Step 1: Search Existing Resident</h4>
            <p class="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-4">First, let's check if this person is already registered in the system.</p>

            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (input)="onSearchInput()"
                placeholder="Search by name, National ID, or Voter's ID..."
                class="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-[10px] sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <span class="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            <!-- Search Results -->
            <div *ngIf="searchResults.length > 0" class="mt-2 sm:mt-4 space-y-2 max-h-64 overflow-y-auto">
              <div *ngFor="let result of searchResults" 
                   class="p-2 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all"
                   [class.border-gray-200]="!result.alreadyInHousehold"
                   [class.hover:border-blue-500]="!result.alreadyInHousehold"
                   [class.border-gray-300]="result.alreadyInHousehold"
                   [class.bg-gray-50]="result.alreadyInHousehold"
                   [class.cursor-not-allowed]="result.alreadyInHousehold"
                   (click)="!result.alreadyInHousehold && selectExistingResident(result)">
                <div class="flex justify-between items-start gap-2">
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 text-[10px] sm:text-base truncate">{{ result.fullName }}</p>
                    <p class="text-[8px] sm:text-sm text-gray-600">
                      <span *ngIf="result.age">{{ result.age }} years old</span>
                      <span *ngIf="!result.age && result.birthDate">{{ calculateAge(result.birthDate) }} years old</span>
                      <span *ngIf="!result.age && !result.birthDate">Age not specified</span>
                      <span *ngIf="result.gender"> • {{ result.gender }}</span>
                    </p>
                    <p class="text-[8px] sm:text-sm text-gray-500 truncate">Purok {{ result.purokNo }} • {{ result.contactNo }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <span *ngIf="result.alreadyInHousehold" class="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-bold rounded-full bg-gray-200 text-gray-600 whitespace-nowrap">
                      Already in Household
                    </span>
                    <span *ngIf="result.isHouseholdHead" class="px-1.5 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-xs font-bold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                      Household Head
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="searching" class="mt-2 sm:mt-4 text-center py-2 sm:py-4">
              <div class="inline-block animate-spin rounded-full h-5 w-5 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
              <p class="mt-1 sm:mt-2 text-[10px] sm:text-sm text-gray-600">Searching...</p>
            </div>

            <div *ngIf="!searching && searchQuery && searchResults.length === 0" class="mt-2 sm:mt-4 p-2 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl">
              <p class="text-[10px] sm:text-sm text-yellow-800 font-medium">No matching residents found.</p>
              <button 
                (click)="proceedToManualEntry()"
                class="mt-1.5 sm:mt-3 text-[10px] sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                → Add their information manually
              </button>
            </div>
          </div>

          <!-- Step 2: Comprehensive Member Information Form -->
          <div [class.hidden]="addMemberStep !== 2">
            <div class="mb-3 sm:mb-6">
              <h4 class="text-sm sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Complete Household Member Information</h4>
              <p class="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-4">Please fill out all required fields. This information is needed for proper admin verification.</p>
              
              <div class="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-2 sm:p-4">
                <p class="text-[10px] sm:text-sm text-blue-800 font-medium">
                  <svg class="w-3 h-3 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  This member will be added with "Pending Verification" status. An admin will review and approve this addition based on the information you provide.
                </p>
              </div>
            </div>

            <app-add-household-member-form 
              [householdData]="household"
            ></app-add-household-member-form>
          </div>

          <!-- Step 3: Relationship for Linked Member -->
          <div [class.hidden]="addMemberStep !== 3">
            <h4 class="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Select Relationship</h4>
            <p class="text-[10px] sm:text-sm text-gray-600 mb-2 sm:mb-4">
              Adding: <strong>{{ selectedResident?.fullName }}</strong>
            </p>

            <div>
              <label class="block text-[10px] sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Relationship *</label>
              <select 
                [(ngModel)]="newMemberRelationship"
                class="w-full px-2 sm:px-4 py-2 text-[10px] sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Relative">Relative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 px-2 sm:px-4 md:px-6 py-2 sm:py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-1.5 sm:gap-0 border-t border-gray-200 z-10">
          <button 
            *ngIf="addMemberStep > 1"
            (click)="goBackStep()"
            class="px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-base text-gray-700 hover:bg-gray-200 rounded-md sm:rounded-lg transition-colors order-2 sm:order-1"
          >
            ← Back
          </button>
          <div class="flex-1 hidden sm:block"></div>
          <div class="flex gap-1.5 sm:gap-3 order-1 sm:order-2">
            <button 
              (click)="closeAddMemberModal()"
              class="flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-base text-gray-700 hover:bg-gray-200 rounded-md sm:rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              *ngIf="addMemberStep === 2 || addMemberStep === 3"
              (click)="submitAddMember()"
              [disabled]="submitting"
              class="flex-1 sm:flex-none px-2 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md sm:rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {{ submitting ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HouseholdComponent implements OnInit {
  @ViewChild(AddHouseholdMemberFormComponent) memberForm!: AddHouseholdMemberFormComponent;
  
  loading = true;
  household: HouseholdWithMembers | null = null;
  currentUserId: string = '';
  currentResident: any = null;
  creatingHousehold = false;

  // Add member modal
  showAddMemberModal = false;
  addMemberStep = 1; // 1: Search, 2: Manual Entry, 3: Relationship Selection
  searchQuery = '';
  searchResults: SearchResidentResult[] = [];
  searching = false;
  selectedResident: SearchResidentResult | null = null;
  submitting = false;
  newMemberRelationship: Relationship | '' = '';

  private searchTimeout: any;

  constructor(
    private householdService: HouseholdService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.loadHousehold();
  }

  async loadHousehold() {
    this.loading = true;
    try {
      const account = await this.authService.getAccount();
      const resident = await this.userService.getUserInformation(account.$id);
      
      if (resident?.$id) {
        this.currentUserId = resident.$id;
        this.currentResident = resident; // Store resident info
        // Use new method that checks if user is head OR member
        const household = await this.householdService.getHouseholdForResident(resident.$id);
        
        if (household) {
          this.household = await this.householdService.getHouseholdWithMembers(household.$id!);
        }
      }
    } catch (error) {
      console.error('Error loading household:', error);
      Swal.fire('Error', 'Failed to load household information', 'error');
    } finally {
      this.loading = false;
    }
  }

  openAddMemberModal() {
    this.showAddMemberModal = true;
    this.addMemberStep = 1;
    this.resetForm();
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
    this.resetForm();
  }

  resetForm() {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedResident = null;
    this.newMemberRelationship = '';
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    
    if (this.searchQuery.trim().length < 2) {
      this.searchResults = [];
      return;
    }

    this.searching = true;
    this.searchTimeout = setTimeout(async () => {
      await this.performSearch();
    }, 500);
  }

  async performSearch() {
    if (!this.household) return;

    try {
      this.searchResults = await this.householdService.searchResidents(
        this.searchQuery,
        this.household.$id!
      );
    } catch (error) {
      console.error('Error searching residents:', error);
    } finally {
      this.searching = false;
    }
  }

  selectExistingResident(resident: SearchResidentResult) {
    if (resident.alreadyInHousehold) return;
    
    this.selectedResident = resident;
    this.addMemberStep = 3;
  }

  proceedToManualEntry() {
    this.addMemberStep = 2;
  }

  goBackStep() {
    if (this.addMemberStep > 1) {
      this.addMemberStep--;
      if (this.addMemberStep === 1) {
        this.selectedResident = null;
      }
    }
  }

  async submitAddMember() {
    if (!this.household) return;

    this.submitting = true;

    try {
      if (this.addMemberStep === 3 && this.selectedResident) {
        // Add linked member
        if (!this.newMemberRelationship) {
          Swal.fire('Required', 'Please select a relationship', 'warning');
          this.submitting = false;
          return;
        }

        await this.householdService.addHouseholdMember({
          householdId: this.household.$id!,
          linkedResidentId: this.selectedResident.$id,
          relationship: this.newMemberRelationship as Relationship,
          memberType: 'linked'
        });

        await Swal.fire('Success', 'Household member added successfully!', 'success');
      } else if (this.addMemberStep === 2) {
        // Add pending registration member with comprehensive information
        if (!this.memberForm) {
          console.error('Form component not found');
          Swal.fire('Error', 'Form component not initialized', 'error');
          this.submitting = false;
          return;
        }

        // Enable error display on form
        this.memberForm.enableErrorDisplay();

        // Validate form
        if (!this.memberForm.isFormValid()) {
          Swal.fire({
            icon: 'warning',
            title: 'Incomplete Information',
            html: `
              <p class="mb-3">Please fill out all required fields before submitting.</p>
              <p class="text-sm text-gray-600">
                Form completion: <strong>${this.memberForm.getCompletionPercentage()}%</strong><br>
                ${this.memberForm.getRequiredFieldsCount()} of ${this.memberForm.getTotalRequiredFields()} required fields completed
              </p>
            `,
            confirmButtonText: 'OK'
          });
          this.submitting = false;
          return;
        }

        const formData = this.memberForm.getFormData();
        
        await this.householdService.addHouseholdMember({
          ...formData,
          householdId: this.household.$id!,
          memberType: 'pending_registration'
        });

        await Swal.fire({
          icon: 'success',
          title: 'Submitted for Review',
          html: `
            <p class="mb-3">The household member has been added and is pending admin verification.</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-left">
              <p class="font-semibold text-blue-900 mb-2">What happens next?</p>
              <ul class="text-blue-800 space-y-1 list-disc list-inside">
                <li>Admin will review the submitted information</li>
                <li>Upon approval, the member can register an account</li>
                <li>They will only need to provide account credentials</li>
              </ul>
            </div>
          `
        });
      }

      this.closeAddMemberModal();
      await this.loadHousehold();
    } catch (error: any) {
      console.error('Error adding household member:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Member',
        text: error.message || 'An error occurred while adding the household member',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      this.submitting = false;
    }
  }

  async removeMember(member: HouseholdMemberWithResident) {
    const result = await Swal.fire({
      title: 'Remove Household Member?',
      text: `Are you sure you want to remove ${this.getMemberName(member)} from your household?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await this.householdService.removeHouseholdMember(member.$id!);
        await Swal.fire('Removed', 'Household member has been removed', 'success');
        await this.loadHousehold();
      } catch (error) {
        console.error('Error removing member:', error);
        Swal.fire('Error', 'Failed to remove household member', 'error');
      }
    }
  }

  getMemberName(member: HouseholdMemberWithResident): string {
    if (member.residentInfo) {
      return `${member.residentInfo.firstName} ${member.residentInfo.middleName || ''} ${member.residentInfo.lastName}`.trim();
    }
    // Fallback: if residentInfo is not available but member has firstName/lastName
    if (member.firstName && member.lastName) {
      return `${member.firstName} ${member.lastName}`.trim();
    }
    console.warn('Member has no residentInfo:', member);
    return 'Unknown';
  }

  getInitials(member: HouseholdMemberWithResident): string {
    if (member.residentInfo) {
      return `${member.residentInfo.firstName?.charAt(0) || ''}${member.residentInfo.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    // Fallback: if residentInfo is not available but member has firstName/lastName
    if (member.firstName && member.lastName) {
      return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
    }
    return '?';
  }

  getRelationshipBadgeClass(relationship: string): string {
    const classes: Record<string, string> = {
      'Head': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      'Spouse': 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
      'Child': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      'Parent': 'bg-gradient-to-r from-purple-400 to-violet-500 text-white',
      'Sibling': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
      'Relative': 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white',
      'Other': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    };
    return classes[relationship] || classes['Other'];
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'active': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      'pending_verification': 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
      'claimed': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
    };
    return classes[status] || 'bg-gray-200 text-gray-600';
  }

  formatStatus(status: string): string {
    const formats: Record<string, string> = {
      'active': 'Active',
      'pending_verification': 'Pending Review',
      'claimed': 'Claimed'
    };
    return formats[status] || status;
  }

  async createOwnHousehold() {
    if (!this.currentResident?.personalInfo) {
      Swal.fire('Error', 'Unable to retrieve your resident information', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Create Your Household',
      html: `
        <div class="text-left space-y-3">
          <p class="text-gray-700">You are about to create a household with the following information:</p>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p><strong>Head of Household:</strong> ${this.currentResident.personalInfo.firstName} ${this.currentResident.personalInfo.lastName}</p>
            <p><strong>Purok No.:</strong> ${this.currentResident.personalInfo.purokNo}</p>
            <p><strong>House No.:</strong> ${this.currentResident.personalInfo.houseNo}</p>
            <p><strong>Street:</strong> ${this.currentResident.personalInfo.street}</p>
          </div>
          <p class="text-sm text-gray-600 mt-4">Once created, you will be registered as the head of this household and can add other members.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create Household',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb'
    });

    if (result.isConfirmed) {
      this.creatingHousehold = true;
      try {
        const household = await this.householdService.createHousehold(
          this.currentResident.$id,
          this.currentResident.personalInfo.purokNo,
          this.currentResident.personalInfo.houseNo,
          this.currentResident.personalInfo.street
        );

        await Swal.fire({
          icon: 'success',
          title: 'Household Created!',
          html: `
            <div class="text-left space-y-3">
              <p class="text-gray-700">Your household has been successfully created.</p>
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-sm font-semibold text-green-900">Household Code:</p>
                <p class="text-lg font-bold text-green-700 font-mono">${household.householdCode}</p>
              </div>
              <p class="text-sm text-gray-600">You can now add household members using the "Add Household Member" button.</p>
            </div>
          `,
          confirmButtonColor: '#10b981'
        });

        await this.loadHousehold();
      } catch (error: any) {
        console.error('Error creating household:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Create Household',
          text: error.message || 'An error occurred while creating your household',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        this.creatingHousehold = false;
      }
    }
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
