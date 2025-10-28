import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ResidentInfo } from '../../shared/types/resident'; 

@Component({
  selector: 'app-resident-info-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-2 sm:p-4" *ngIf="show">
    <div class="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
      <!-- Modal Container -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
        
        <!-- Header - Sticky -->
        <div class="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-bold text-white">Review Your Information</h3>
              <p class="text-xs text-blue-100 hidden sm:block">Please verify all details before submitting</p>
            </div>
          </div>
          <button class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all" (click)="onClose()">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content - Scrollable -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-gray-50">
          
          <!-- Profile Section - Compact -->
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div class="flex items-center gap-4">
              <div class="relative flex-shrink-0">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden border-2 border-blue-200 shadow-md">
                  <img *ngIf="residentInfo.profileImage" [src]="residentInfo.profileImage" alt="Profile" class="object-cover w-full h-full" />
                  <div *ngIf="!residentInfo.profileImage" class="flex items-center justify-center h-full text-blue-400">
                    <svg class="w-10 h-10 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  {{ residentInfo.personalInfo.firstName }} {{ residentInfo.personalInfo.lastName }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  {{ calculateAge(residentInfo.personalInfo.birthDate) }} years old • {{ residentInfo.personalInfo.gender }}
                </p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1">
                  {{ residentInfo.personalInfo.houseNo }} {{ residentInfo.personalInfo.street }}, Purok {{ residentInfo.personalInfo.purokNo }}
                </p>
              </div>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Personal Details</h4>
              </div>
            </div>
            <div class="p-4 space-y-3">
              <!-- Full Name -->
              <div class="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:w-1/3 mb-1 sm:mb-0">Full Name</span>
                <span class="text-sm font-medium text-gray-800 sm:w-2/3">
                  {{ residentInfo.personalInfo.lastName }}, {{ residentInfo.personalInfo.firstName }} {{ residentInfo.personalInfo.middleName }} {{ residentInfo.personalInfo.suffix }}
                </span>
              </div>
              
              <!-- Birth Information -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Birth Date</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.birthDate | date:'mediumDate' }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</span>
                  <span class="text-sm font-medium text-gray-800">{{ calculateAge(residentInfo.personalInfo.birthDate) }} years old</span>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:w-1/3 mb-1 sm:mb-0">Birth Place</span>
                <span class="text-sm font-medium text-gray-800 sm:w-2/3">{{ residentInfo.personalInfo.birthPlace }}</span>
              </div>
              
              <!-- Personal Status -->
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Gender</span>
                  <span class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.personalInfo.gender }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Civil Status</span>
                  <span class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.personalInfo.civilStatus }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nationality</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.nationality }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Religion</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.religion }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact & Work Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b border-green-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Contact & Work</h4>
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact Number</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.contactNo }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Occupation</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.occupation }}</span>
                </div>
                <div class="flex flex-col sm:col-span-2">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Monthly Income</span>
                  <span class="text-sm font-medium text-gray-800">₱{{ residentInfo.personalInfo.monthlyIncome | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b border-purple-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Address</h4>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {{ residentInfo.personalInfo.houseNo }} {{ residentInfo.personalInfo.street }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    Purok {{ residentInfo.personalInfo.purokNo }}, Barangay New Cabalan
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Government IDs -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-3 border-b border-indigo-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Government IDs</h4>
              </div>
            </div>
            <div class="p-4 space-y-2">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">National ID</span>
                <span class="text-sm font-medium text-gray-800">{{ residentInfo.otherDetails.nationalIdNo || 'Not provided' }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Voter's ID</span>
                <span class="text-sm font-medium text-gray-800">{{ residentInfo.otherDetails.votersIdNo || 'Not provided' }}</span>
              </div>
            </div>
          </div>
            
          <!-- Status Badges -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" *ngIf="hasAnyBadges()">
            <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-orange-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Special Categories</h4>
              </div>
            </div>
            <div class="p-4 flex flex-wrap gap-2">
              <span *ngIf="residentInfo.personalInfo.pwd === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PWD: {{ residentInfo.personalInfo.pwdIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.soloParent === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-100 text-pink-800 border border-pink-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Solo Parent: {{ residentInfo.personalInfo.soloParentIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.seniorCitizen === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Senior Citizen: {{ residentInfo.personalInfo.seniorCitizenIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.fourPsMember === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                4Ps Member
              </span>
              <span *ngIf="residentInfo.personalInfo.registeredVoter === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registered Voter
              </span>
              <span *ngIf="residentInfo.personalInfo.indigent === 'Yes'" class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Indigent
              </span>
            </div>
          </div>

          <!-- Emergency Contact Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 border-b border-red-200">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 class="text-base font-bold text-gray-800">Emergency Contact</h4>
              </div>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:w-1/3 mb-1 sm:mb-0">Full Name</span>
                <span class="text-sm font-medium text-gray-800 sm:w-2/3">{{ residentInfo.emergencyContact.fullName }}</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Relationship</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.relationship }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact Number</span>
                  <span class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.contactNo }}</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</span>
                <span class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer - Sticky -->
        <div class="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 p-4 sm:p-5 bg-gray-50 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center sm:text-left">
            <svg class="w-4 h-4 inline mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Review all information carefully before submitting
          </p>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              class="w-full sm:w-auto px-5 py-2.5 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium text-sm order-2 sm:order-1"
              (click)="onClose()"
            >
              <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Information
            </button>
            <button
              class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold shadow-lg flex items-center justify-center gap-2 text-sm order-1 sm:order-2"
              (click)="onConfirm()"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [DatePipe, DecimalPipe]
})
export class ResidentInfoPreviewModalComponent {
  @Input() show = false;
  @Input() residentInfo!: ResidentInfo;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
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

  hasAnyBadges(): boolean {
    return this.residentInfo.personalInfo.pwd === 'Yes' ||
           this.residentInfo.personalInfo.soloParent === 'Yes' ||
           this.residentInfo.personalInfo.seniorCitizen === 'Yes' ||
           this.residentInfo.personalInfo.fourPsMember === 'Yes' ||
           this.residentInfo.personalInfo.registeredVoter === 'Yes' ||
           this.residentInfo.personalInfo.indigent === 'Yes';
  }
}