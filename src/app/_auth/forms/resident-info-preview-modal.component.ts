import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ResidentInfo } from './sign-up-information-form.component';

@Component({
  selector: 'app-resident-info-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed inset-0 z-50 flex items-center justify-center" *ngIf="show">
    <div class="relative mx-auto p-5 w-400 max-w-3xl shadow-lg rounded-md bg-white z-50">
      <div class="flex flex-col h-full">
          <div class="flex justify-between items-center pb-3">
            <h3 class="text-xl font-bold">Review Your Information</h3>
            <button class="text-gray-400 hover:text-gray-500" (click)="onClose()">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto max-h-[70vh] px-4">
            <!-- Personal Information -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-800">Personal Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Full Name</p>
                  <p class="text-base">{{ residentInfo.personalInfo.lastName }}, {{ residentInfo.personalInfo.firstName }} {{ residentInfo.personalInfo.middleName }} {{ residentInfo.personalInfo.suffix }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Gender</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.gender }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Birth Date</p>
                  <p class="text-base">{{ residentInfo.personalInfo.birthDate | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Birth Place</p>
                  <p class="text-base">{{ residentInfo.personalInfo.birthPlace }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Age</p>
                  <p class="text-base">{{ residentInfo.personalInfo.age }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Civil Status</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.civilStatus }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Nationality</p>
                  <p class="text-base">{{ residentInfo.personalInfo.nationality }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Religion</p>
                  <p class="text-base">{{ residentInfo.personalInfo.religion }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Occupation</p>
                  <p class="text-base">{{ residentInfo.personalInfo.occupation }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Contact No.</p>
                  <p class="text-base">{{ residentInfo.personalInfo.contactNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">PWD</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.pwd }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">PWD ID No.</p>
                  <p class="text-base">{{ residentInfo.personalInfo.pwdIdNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Monthly Income</p>
                  <p class="text-base">₱{{ residentInfo.personalInfo.monthlyIncome | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Indigent</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.indigent }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Solo Parent</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.soloParent }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Solo Parent ID No.</p>
                  <p class="text-base">{{ residentInfo.personalInfo.soloParentIdNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Senior Citizen</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.seniorCitizen }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Senior Citizen ID No.</p>
                  <p class="text-base">{{ residentInfo.personalInfo.seniorCitizenIdNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">4Ps Member</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.fourPsMember }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Registered Voter</p>
                  <p class="text-base capitalize">{{ residentInfo.personalInfo.registeredVoter }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Address</p>
                  <p class="text-base">{{ residentInfo.personalInfo.houseNo }} {{ residentInfo.personalInfo.street }}, Purok {{ residentInfo.personalInfo.purokNo }}</p>
                </div>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Full Name</p>
                  <p class="text-base">{{ residentInfo.emergencyContact.fullName }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Relationship</p>
                  <p class="text-base">{{ residentInfo.emergencyContact.relationship }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Contact No.</p>
                  <p class="text-base">{{ residentInfo.emergencyContact.contactNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Address</p>
                  <p class="text-base">{{ residentInfo.emergencyContact.address }}</p>
                </div>
              </div>
            </div>

            <!-- Other Details -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-4 text-gray-800">Other Details</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">National ID No.</p>
                  <p class="text-base">{{ residentInfo.otherDetails.nationalIdNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Voter's ID No.</p>
                  <p class="text-base">{{ residentInfo.otherDetails.votersIdNo }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Covid Status</p>
                  <p class="text-base capitalize">{{ residentInfo.otherDetails.covidStatus }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Vaccinated</p>
                  <p class="text-base capitalize">{{ residentInfo.otherDetails.vaccinated }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Status</p>
                  <p class="text-base capitalize">{{ residentInfo.otherDetails.deceased }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Date of Registration</p>
                  <p class="text-base">{{ residentInfo.otherDetails.dateOfRegistration | date:'mediumDate' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              (click)="onClose()"
            >
              Edit Information
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="onConfirm()"
            >
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
}