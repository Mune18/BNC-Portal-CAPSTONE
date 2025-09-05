import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ResidentInfo } from '../../shared/types/resident'; 

@Component({
  selector: 'app-resident-info-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 z-50 flex items-start justify-center bg-transparent backdrop-blur-sm py-8 overflow-y-auto" *ngIf="show">
    <div class="relative mx-4 w-full max-w-5xl mb-8">
      <!-- Modal Container with improved design -->
      <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col">
        
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">Review Your Information</h3>
          </div>
          <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200" (click)="onClose()">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          
          <!-- Profile Section -->
          <div class="flex justify-center mb-8">
            <div class="relative">
              <div class="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden border-4 border-white shadow-lg">
                <img *ngIf="residentInfo.profileImage" [src]="residentInfo.profileImage" alt="Profile Image" class="object-cover w-full h-full" />
                <div *ngIf="!residentInfo.profileImage" class="flex items-center justify-center h-full text-blue-400">
                  <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Personal Information Card -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-800">Personal Information</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Full Name</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.lastName }}, {{ residentInfo.personalInfo.firstName }} {{ residentInfo.personalInfo.middleName }} {{ residentInfo.personalInfo.suffix }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Gender</p>
                <p class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.personalInfo.gender }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Birth Date</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.birthDate | date:'mediumDate' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Birth Place</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.birthPlace }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Age</p>
                <p class="text-sm font-medium text-gray-800">{{ calculateAge(residentInfo.personalInfo.birthDate) }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Civil Status</p>
                <p class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.personalInfo.civilStatus }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Nationality</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.nationality }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Religion</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.religion }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Occupation</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.occupation }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Contact No.</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.contactNo }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Monthly Income</p>
                <p class="text-sm font-medium text-gray-800">₱{{ residentInfo.personalInfo.monthlyIncome | number:'1.2-2' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-3 border border-white/50">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Address</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.personalInfo.houseNo }} {{ residentInfo.personalInfo.street }}, Purok {{ residentInfo.personalInfo.purokNo }}</p>
              </div>
            </div>
            
            <!-- Status Badges -->
            <div class="mt-4 flex flex-wrap gap-2">
              <span *ngIf="residentInfo.personalInfo.pwd === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PWD: {{ residentInfo.personalInfo.pwdIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.soloParent === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-200">
                Solo Parent: {{ residentInfo.personalInfo.soloParentIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.seniorCitizen === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                Senior Citizen: {{ residentInfo.personalInfo.seniorCitizenIdNo }}
              </span>
              <span *ngIf="residentInfo.personalInfo.fourPsMember === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                4Ps Member
              </span>
              <span *ngIf="residentInfo.personalInfo.registeredVoter === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Registered Voter
              </span>
              <span *ngIf="residentInfo.personalInfo.indigent === 'Yes'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                Indigent
              </span>
            </div>
          </div>

          <!-- Emergency Contact Card -->
          <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-800">Emergency Contact</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Full Name</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.fullName }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Relationship</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.relationship }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Contact No.</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.contactNo }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Address</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.emergencyContact.address }}</p>
              </div>
            </div>
          </div>

          <!-- Other Details Card -->
          <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-800">Additional Information</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">National ID No.</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.otherDetails.nationalIdNo || 'Not provided' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Voter's ID No.</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.otherDetails.votersIdNo || 'Not provided' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Covid Status</p>
                <p class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.otherDetails.covidStatus || 'Not specified' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Vaccinated</p>
                <p class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.otherDetails.vaccinated || 'Not specified' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Status</p>
                <p class="text-sm font-medium text-gray-800 capitalize">{{ residentInfo.otherDetails.deceased || 'Alive' }}</p>
              </div>
              <div class="bg-white/70 rounded-lg p-4 border border-white/50">
                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Registration Date</p>
                <p class="text-sm font-medium text-gray-800">{{ residentInfo.otherDetails.dateOfRegistration | date:'mediumDate' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <div class="text-sm text-gray-500">
            Please review all information carefully before submitting.
          </div>
          <div class="flex gap-3">
            <button
              class="px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
              (click)="onClose()"
            >
              Edit Information
            </button>
            <button
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
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
}