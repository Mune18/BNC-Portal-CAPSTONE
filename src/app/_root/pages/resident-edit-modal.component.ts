import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentInfo } from '../../shared/types/resident';
import { AdminService } from '../../shared/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resident-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 flex items-center justify-center z-50 p-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 backdrop-blur-md bg-black/50"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden z-10 flex flex-col">
        <!-- Modal Header -->
        <div class="flex-shrink-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">Edit Resident Information</h2>
          <button 
            (click)="closeModal()" 
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto px-6 py-6">
          <form id="editForm" (ngSubmit)="saveChanges()" #editForm="ngForm" class="h-full">
            
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <!-- Left column: Profile image at top, then fields below -->
              <div class="flex flex-col items-center lg:items-stretch col-span-1">
                <!-- Profile image section -->
                <div class="flex flex-col items-center mb-6">
                  <div class="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-4 border-gray-200 hover:border-blue-300 transition-colors group cursor-pointer">
                    <img *ngIf="editedResident.profileImage" [src]="editedResident.profileImage" alt="Profile Image" class="object-cover w-full h-full" />
                    <div *ngIf="!editedResident.profileImage" class="text-center">
                      <svg class="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <span class="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">Upload Photo</span>
                    </div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2 text-center">Click to upload a profile photo</p>
                </div>
                
                <!-- Name fields -->
                <div class="flex flex-col gap-5 w-full">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.lastName" 
                      name="lastName" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="Enter last name"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.firstName" 
                      name="firstName" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      placeholder="Enter first name"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name <span class="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.middleName" 
                      name="middleName" 
                      required
                      placeholder="Enter middle name"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.suffix" 
                      name="suffix" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Jr., Sr., III (optional)"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Right column: Form sections -->
              <div class="lg:col-span-3 space-y-8">
                <!-- Personal Information Section -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Gender <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.gender" 
                        name="gender" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Birth Date <span class="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        [(ngModel)]="editedResident.personalInfo.birthDate" 
                        name="birthDate" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Birth Place <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.birthPlace" 
                        name="birthPlace" 
                        required
                        placeholder="Enter birth place"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Civil Status <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.civilStatus" 
                        name="civilStatus" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nationality <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.nationality" 
                        name="nationality" 
                        required
                        placeholder="Enter nationality"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Religion <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.religion" 
                        name="religion" 
                        required
                        placeholder="Enter religion"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                  </div>
                </div>

                <!-- Contact and Address Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Contact & Address Information</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number <span class="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        [(ngModel)]="editedResident.personalInfo.contactNo" 
                        name="contactNo" 
                        required
                        placeholder="Enter contact number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Occupation <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.occupation" 
                        name="occupation" 
                        required
                        placeholder="Enter occupation"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Income <span class="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        [(ngModel)]="editedResident.personalInfo.monthlyIncome" 
                        name="monthlyIncome" 
                        required
                        placeholder="Enter monthly income"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Purok Number <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.purokNo" 
                        name="purokNo" 
                        required
                        placeholder="Enter purok number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">House Number <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.houseNo" 
                        name="houseNo" 
                        required
                        placeholder="Enter house number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Street <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.street" 
                        name="street" 
                        required
                        placeholder="Enter street name"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                  </div>
                </div>

                <!-- Special Status Information -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Special Status & Benefits</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">PWD Status <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.pwd" 
                        name="pwd" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        PWD ID Number <span *ngIf="editedResident.personalInfo.pwd === 'Yes'" class="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.pwdIdNo" 
                        name="pwdIdNo" 
                        [disabled]="editedResident.personalInfo.pwd !== 'Yes'"
                        [class]="'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' + (editedResident.personalInfo.pwd !== 'Yes' ? ' bg-gray-100 cursor-not-allowed' : '')"
                        placeholder="Enter PWD ID Number"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Indigent Status <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.indigent" 
                        name="indigent" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Solo Parent <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.soloParent" 
                        name="soloParent" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Solo Parent ID Number <span *ngIf="editedResident.personalInfo.soloParent === 'Yes'" class="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.soloParentIdNo" 
                        name="soloParentIdNo" 
                        [disabled]="editedResident.personalInfo.soloParent !== 'Yes'"
                        [class]="'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' + (editedResident.personalInfo.soloParent !== 'Yes' ? ' bg-gray-100 cursor-not-allowed' : '')"
                        placeholder="Enter Solo Parent ID Number"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Senior Citizen <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.seniorCitizen" 
                        name="seniorCitizen" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Senior Citizen ID Number <span *ngIf="editedResident.personalInfo.seniorCitizen === 'Yes'" class="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.personalInfo.seniorCitizenIdNo" 
                        name="seniorCitizenIdNo" 
                        [disabled]="editedResident.personalInfo.seniorCitizen !== 'Yes'"
                        [class]="'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' + (editedResident.personalInfo.seniorCitizen !== 'Yes' ? ' bg-gray-100 cursor-not-allowed' : '')"
                        placeholder="Enter Senior Citizen ID Number"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">4Ps Member <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.fourPsMember" 
                        name="fourPsMember" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Voting & Government IDs -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Voting & Government IDs</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Registered Voter <span class="text-red-500">*</span></label>
                      <select 
                        [(ngModel)]="editedResident.personalInfo.registeredVoter" 
                        name="registeredVoter" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="">Select Status</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Voter's ID Number</label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.otherDetails.votersIdNo" 
                        name="votersIdNo" 
                        placeholder="Enter Voter's ID Number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">National ID Number</label>
                      <input 
                        type="text" 
                        [(ngModel)]="editedResident.otherDetails.nationalIdNo" 
                        name="nationalIdNo" 
                        placeholder="Enter National ID Number"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Emergency Contact Section -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Emergency Contact Information</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.fullName" 
                    name="emergencyFullName" 
                    required
                    placeholder="Enter emergency contact full name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Relationship <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.relationship" 
                    name="emergencyRelationship" 
                    required
                    placeholder="e.g., Mother, Father, Spouse, Sibling"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number <span class="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    [(ngModel)]="editedResident.emergencyContact.contactNo" 
                    name="emergencyContactNo" 
                    required
                    placeholder="Enter contact number"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.address" 
                    name="emergencyAddress" 
                    required
                    placeholder="Enter emergency contact address"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                </div>
              </div>
            </div>
            
            <!-- Other Details Section -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Other Details</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    [(ngModel)]="editedResident.otherDetails.deceased" 
                    name="deceased" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              type="button" 
              (click)="closeModal()"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium sm:w-auto"
              [disabled]="isSaving"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="editForm"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto"
              [disabled]="!editForm.valid || isSaving"
            >
              <svg *ngIf="isSaving" class="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg *ngIf="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ isSaving ? 'Saving Changes...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      z-index: 1000;
    }
  `]
})
export class ResidentEditModalComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() resident: ResidentInfo | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ResidentInfo>();

  editedResident: ResidentInfo = this.getEmptyResidentInfo();
  isSaving: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resident'] && this.resident) {
      this.resetForm();
    }
  }

  private getEmptyResidentInfo(): ResidentInfo {
    return {
      $id: '',
      personalInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        birthDate: '',
        birthPlace: '',
        gender: '',
        age: 0,
        civilStatus: '',
        nationality: '',
        religion: '',
        contactNo: '',
        houseNo: '',
        street: '',
        purokNo: '',
        occupation: '',
        monthlyIncome: 0,
        pwd: '',
        pwdIdNo: '',
        indigent: '',
        soloParent: '',
        soloParentIdNo: '',
        seniorCitizen: '',
        seniorCitizenIdNo: '',
        fourPsMember: '',
        registeredVoter: ''
      },
      emergencyContact: {
        fullName: '',
        contactNo: '',
        relationship: '',
        address: ''
      },
      otherDetails: {
        nationalIdNo: '',
        votersIdNo: '',
        deceased: 'No',
        dateOfRegistration: new Date().toISOString()
      }
    };
  }

  private resetForm() {
    if (this.resident) {
      // Deep clone the resident object to avoid modifying the original
      this.editedResident = JSON.parse(JSON.stringify(this.resident));
      
      // Ensure all required properties exist
      if (!this.editedResident.emergencyContact) {
        this.editedResident.emergencyContact = {
          fullName: '',
          contactNo: '',
          relationship: '',
          address: ''
        };
      }
      
      if (!this.editedResident.otherDetails.nationalIdNo) {
        this.editedResident.otherDetails.nationalIdNo = '';
      }
      
      if (!this.editedResident.otherDetails.votersIdNo) {
        this.editedResident.otherDetails.votersIdNo = '';
      }
    } else {
      this.editedResident = this.getEmptyResidentInfo();
    }
  }

  closeModal() {
    this.close.emit();
  }

  async saveChanges() {
    if (!this.editedResident.$id) {
      console.error('No resident ID found');
      return;
    }

    this.isSaving = true;
    
    try {
      // Update the resident using the admin service
      const updatedResident = await this.adminService.updateResident(this.editedResident.$id, this.editedResident);
      
      // Emit the updated resident data
      this.save.emit(updatedResident);
      
      // Close the modal
      this.closeModal();
      
      // Show success message with SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Resident information updated successfully!',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#3B82F6',
        background: '#ffffff',
        color: '#374151',
        timer: 4000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
          popup: 'rounded-xl shadow-2xl border-0',
          title: 'text-xl font-bold text-gray-800 mb-2',
          htmlContainer: 'text-gray-600 text-sm',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg',
          timerProgressBar: 'bg-blue-500'
        },
        backdrop: 'rgba(0, 0, 0, 0.4)',
        allowOutsideClick: false,
        allowEscapeKey: true
      });
      
    } catch (error) {
      console.error('Failed to update resident:', error);
      
      // Show error message with SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update resident information. Please try again.',
        confirmButtonText: 'Retry',
        confirmButtonColor: '#EF4444',
        background: '#ffffff',
        color: '#374151',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster'
        },
        customClass: {
          popup: 'rounded-xl shadow-2xl border-0',
          title: 'text-xl font-bold text-red-600 mb-2',
          htmlContainer: 'text-gray-600 text-sm',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg'
        },
        backdrop: 'rgba(0, 0, 0, 0.4)',
        allowOutsideClick: false,
        allowEscapeKey: true
      });
    } finally {
      this.isSaving = false;
    }
  }
}
