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
    <div *ngIf="show" class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
      <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-bold">Edit Resident Information</h2>
          <button 
            (click)="closeModal()" 
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form (ngSubmit)="saveChanges()" #editForm="ngForm">
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <!-- Left column: Profile image at top, then fields below -->
              <div class="flex flex-col items-center md:items-stretch col-span-1">
                <!-- Profile image at the very top -->
                <div class="flex flex-col items-center mb-4">
                  <div class="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-2 border-4 border-blue-300">
                    <img *ngIf="editedResident.profileImage" [src]="editedResident.profileImage" alt="Profile Image" class="object-cover w-full h-full" />
                    <span *ngIf="!editedResident.profileImage" class="text-gray-400 text-4xl">+</span>
                  </div>
                </div>
                <!-- Fields below the image -->
                <div class="flex flex-col gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.lastName" 
                      name="lastName" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2" 
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">First Name *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.firstName" 
                      name="firstName" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2" 
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Middle Name *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.middleName" 
                      name="middleName" 
                      required
                      placeholder="Enter middle name"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Suffix</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.suffix" 
                      name="suffix" 
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                </div>
              </div>
              
              <!-- Right column: The rest of the fields -->
              <div class="md:col-span-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Gender *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.gender" 
                      name="gender" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Date *</label>
                    <input 
                      type="date" 
                      [(ngModel)]="editedResident.personalInfo.birthDate" 
                      name="birthDate" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Place *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.birthPlace" 
                      name="birthPlace" 
                      required
                      placeholder="Enter birth place"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Civil Status *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.civilStatus" 
                      name="civilStatus" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Nationality *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.nationality" 
                      name="nationality" 
                      required
                      placeholder="Enter nationality"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Religion *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.religion" 
                      name="religion" 
                      required
                      placeholder="Enter religion"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Occupation *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.occupation" 
                      name="occupation" 
                      required
                      placeholder="Enter occupation"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No. *</label>
                    <input 
                      type="tel" 
                      [(ngModel)]="editedResident.personalInfo.contactNo" 
                      name="contactNo" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.pwd" 
                      name="pwd" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                      PWD ID No. <span *ngIf="editedResident.personalInfo.pwd === 'Yes'" class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.pwdIdNo" 
                      name="pwdIdNo" 
                      [disabled]="editedResident.personalInfo.pwd !== 'Yes'"
                      [class]="'w-full border-gray-300 rounded-lg shadow-sm px-3 py-2' + (editedResident.personalInfo.pwd !== 'Yes' ? ' bg-gray-100' : '')"
                      placeholder="Enter PWD ID Number"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Family Monthly Income *</label>
                    <input 
                      type="number" 
                      [(ngModel)]="editedResident.personalInfo.monthlyIncome" 
                      name="monthlyIncome" 
                      required
                      placeholder="Enter monthly income"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Indigent? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.indigent" 
                      name="indigent" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.soloParent" 
                      name="soloParent" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                      Solo Parent ID No. <span *ngIf="editedResident.personalInfo.soloParent === 'Yes'" class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.soloParentIdNo" 
                      name="soloParentIdNo" 
                      [disabled]="editedResident.personalInfo.soloParent !== 'Yes'"
                      [class]="'w-full border-gray-300 rounded-lg shadow-sm px-3 py-2' + (editedResident.personalInfo.soloParent !== 'Yes' ? ' bg-gray-100' : '')"
                      placeholder="Enter Solo Parent ID Number"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.seniorCitizen" 
                      name="seniorCitizen" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                      Senior Citizen ID No. <span *ngIf="editedResident.personalInfo.seniorCitizen === 'Yes'" class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.seniorCitizenIdNo" 
                      name="seniorCitizenIdNo" 
                      [disabled]="editedResident.personalInfo.seniorCitizen !== 'Yes'"
                      [class]="'w-full border-gray-300 rounded-lg shadow-sm px-3 py-2' + (editedResident.personalInfo.seniorCitizen !== 'Yes' ? ' bg-gray-100' : '')"
                      placeholder="Enter Senior Citizen ID Number"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">4Ps Member? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.fourPsMember" 
                      name="fourPsMember" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Registered Voter? *</label>
                    <select 
                      [(ngModel)]="editedResident.personalInfo.registeredVoter" 
                      name="registeredVoter" 
                      required
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Voter's ID No.</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.otherDetails.votersIdNo" 
                      name="votersIdNo" 
                      placeholder="Enter Voter's ID Number"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">National ID No.</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.otherDetails.nationalIdNo" 
                      name="nationalIdNo" 
                      placeholder="Enter National ID Number"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Purok No. *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.purokNo" 
                      name="purokNo" 
                      required
                      placeholder="Enter purok number"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">House No. *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.houseNo" 
                      name="houseNo" 
                      required
                      placeholder="Enter house number"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Street *</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editedResident.personalInfo.street" 
                      name="street" 
                      required
                      placeholder="Enter street name"
                      class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Emergency Contact -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-800">Emergency Contact</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.fullName" 
                    name="emergencyFullName" 
                    required
                    placeholder="Enter emergency contact full name"
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Relationship *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.relationship" 
                    name="emergencyRelationship" 
                    required
                    placeholder="Enter relationship (e.g., Mother, Father, Spouse)"
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Contact No. *</label>
                  <input 
                    type="tel" 
                    [(ngModel)]="editedResident.emergencyContact.contactNo" 
                    name="emergencyContactNo" 
                    required
                    placeholder="Enter contact number"
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Address *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="editedResident.emergencyContact.address" 
                    name="emergencyAddress" 
                    required
                    placeholder="Enter emergency contact address"
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                </div>
              </div>
            </div>
            
            <!-- Other Details -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-800">Other Details</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select 
                    [(ngModel)]="editedResident.otherDetails.deceased" 
                    name="deceased" 
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Date of Registration</label>
                  <input 
                    type="date" 
                    [(ngModel)]="editedResident.otherDetails.dateOfRegistration" 
                    name="dateOfRegistration" 
                    class="w-full border-gray-300 rounded-lg shadow-sm px-3 py-2"
                  >
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                (click)="closeModal()"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                [disabled]="isSaving"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                [disabled]="!editForm.valid || isSaving"
              >
                <svg *ngIf="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
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
