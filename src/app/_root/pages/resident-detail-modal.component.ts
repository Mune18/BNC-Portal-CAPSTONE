import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidentInfo } from '../../shared/types/resident';

@Component({
  selector: 'app-resident-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 backdrop-blur-sm bg-black/30" (click)="close.emit()"></div>
      <div class="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
        <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl" (click)="close.emit()">✕</button>
        
        <div class="flex flex-col md:flex-row items-start gap-6">
          <!-- Profile Image/Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span *ngIf="!resident?.profileImage" class="text-4xl text-gray-400">
                {{ resident && resident.personalInfo ? resident.personalInfo.firstName.charAt(0) : 'R' }}
              </span>
              <img *ngIf="resident && resident.profileImage" [src]="resident.profileImage" alt="Profile Image" class="w-full h-full object-cover">
            </div>
          </div>
          
          <!-- Basic Info -->
          <div class="flex-grow">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ resident && resident.personalInfo ? resident.personalInfo.firstName : '' }} 
              {{ resident && resident.personalInfo && resident.personalInfo.middleName ? resident.personalInfo.middleName + ' ' : '' }}
              {{ resident && resident.personalInfo ? resident.personalInfo.lastName : '' }}
              <span *ngIf="resident && resident.personalInfo && resident.personalInfo.suffix">{{ resident.personalInfo.suffix }}</span>
            </h2>
            <p class="text-gray-600">{{ resident && resident.personalInfo ? resident.personalInfo.occupation || 'Resident' : 'Resident' }}</p>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span class="text-gray-500 text-sm">Age:</span>
                <span class="ml-2">
                  {{ resident && resident.personalInfo ? calculateAge(resident.personalInfo.birthDate) : '-' }} years old
                </span>
              </div>
              <div>
                <span class="text-gray-500 text-sm">Gender:</span>
                <span class="ml-2">{{ resident && resident.personalInfo ? resident.personalInfo.gender : '-' }}</span>
              </div>
              <div>
                <span class="text-gray-500 text-sm">Contact:</span>
                <span class="ml-2">{{ resident && resident.personalInfo ? resident.personalInfo.contactNo : '-' }}</span>
              </div>
              <div>
                <span class="text-gray-500 text-sm">Status:</span>
                <span class="ml-2" [ngClass]="{'text-red-600': resident && resident.otherDetails && resident.otherDetails.deceased === 'Deceased'}">
                  {{ resident && resident.otherDetails ? (resident.otherDetails.deceased === 'Deceased' ? 'Inactive' : 'Active') : '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="mt-8 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              *ngFor="let tab of tabs"
              class="px-1 py-4 text-sm font-medium transition-colors border-b-2"
              [class.border-blue-500]="activeTab === tab.id"
              [class.text-blue-600]="activeTab === tab.id"
              [class.border-transparent]="activeTab !== tab.id"
              [class.text-gray-500]="activeTab !== tab.id"
              [class.hover:text-gray-700]="activeTab !== tab.id"
              [class.hover:border-gray-300]="activeTab !== tab.id"
              (click)="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        
        <!-- Personal Info Tab -->
        <div *ngIf="activeTab === 'personal'" class="py-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Full Name</p>
              <p>
                {{ resident && resident.personalInfo ? resident.personalInfo.firstName : '-' }} 
                {{ resident && resident.personalInfo ? resident.personalInfo.middleName : '-' }} 
                {{ resident && resident.personalInfo ? resident.personalInfo.lastName : '-' }} 
                {{ resident && resident.personalInfo ? resident.personalInfo.suffix : '' }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Birth Date</p>
              <p>{{ resident && resident.personalInfo ? formatDate(resident.personalInfo.birthDate) : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Birth Place</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.birthPlace : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Civil Status</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.civilStatus : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Nationality</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.nationality : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Religion</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.religion : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">PWD</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.pwd : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">PWD ID No.</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.pwdIdNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Monthly Income</p>
              <p>₱{{ resident && resident.personalInfo ? resident.personalInfo.monthlyIncome || 0 : 0 }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Senior Citizen</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.seniorCitizen : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Senior Citizen ID No.</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.seniorCitizenIdNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Solo Parent</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.soloParent : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Solo Parent ID No.</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.soloParentIdNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">4Ps Member</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.fourPsMember : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Registered Voter</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.registeredVoter : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">National ID No.</p>
              <p>{{ resident && resident.otherDetails ? resident.otherDetails.nationalIdNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Voter's ID No.</p>
              <p>{{ resident && resident.otherDetails ? resident.otherDetails.votersIdNo || '-' : '-' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Address Tab -->
        <div *ngIf="activeTab === 'address'" class="py-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">House No.</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.houseNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Street</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.street || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Purok No.</p>
              <p>{{ resident && resident.personalInfo ? resident.personalInfo.purokNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Full Address</p>
              <p>{{ getFullAddress() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Emergency Contact Tab -->
        <div *ngIf="activeTab === 'emergency'" class="py-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Full Name</p>
              <p>{{ resident && resident.emergencyContact ? resident.emergencyContact.fullName || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Relationship</p>
              <p>{{ resident && resident.emergencyContact ? resident.emergencyContact.relationship || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Contact No.</p>
              <p>{{ resident && resident.emergencyContact ? resident.emergencyContact.contactNo || '-' : '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Address</p>
              <p>{{ resident && resident.emergencyContact ? resident.emergencyContact.address || '-' : '-' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Other Details Tab -->
        <div *ngIf="activeTab === 'other'" class="py-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Other Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Date of Registration</p>
              <p>{{ formatDate((resident && resident.otherDetails ? resident.otherDetails.dateOfRegistration : '') || (resident ? resident.$createdAt : '')) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Status</p>
              <p>{{ resident && resident.otherDetails ? resident.otherDetails.deceased || '-' : '-' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-4">
          <button 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            (click)="close.emit()"
          >
            Close
          </button>
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            (click)="onEdit()"
          >
            Edit Resident
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ResidentDetailModalComponent {
  @Input() show: boolean = false;
  @Input() resident: ResidentInfo | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<ResidentInfo>();
  
  activeTab: string = 'personal';
  
  tabs = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'address', name: 'Address' },
    { id: 'emergency', name: 'Emergency Contact' },
    { id: 'other', name: 'Other Details' }
  ];
  
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
    if (!this.resident || !this.resident.personalInfo) return '-';
    
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