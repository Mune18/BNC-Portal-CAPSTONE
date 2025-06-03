import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   

interface ResidentInfo {
  personalInfo: {
    lastName: string;
    firstName: string;
    middleName: string;
    suffix: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    age: number;
    civilStatus: string;
    nationality: string;
    religion: string;
    occupation: string;
    contactNo: string;
    pwd: string;
    pwdIdNo: string;
    monthlyIncome: number;
    indigent: string;
    soloParent: string;
    soloParentIdNo: string;
    seniorCitizen: string;
    seniorCitizenIdNo: string;
    fourPsMember: string;
    registeredVoter: string;
    purokNo: string;
    houseNo: string;
    street: string;
  };
  emergencyContact: {
    fullName: string;
    relationship: string;
    contactNo: string;
    address: string;
  };
  otherDetails: {
    nationalIdNo: string;
    votersIdNo: string;
    covidStatus: string;
    vaccinated: string;
    deceased: string;
    dateOfRegistration: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], //
  template: `
    <div class="min-h-screen py-8 px-2">
      <div class="max-w-3xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 mb-8">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <div class="text-xl font-semibold text-gray-900">
              {{ residentInfo.personalInfo.firstName }} {{ residentInfo.personalInfo.middleName ? residentInfo.personalInfo.middleName + ' ' : '' }}{{ residentInfo.personalInfo.lastName }} <span *ngIf="residentInfo.personalInfo.suffix">{{ residentInfo.personalInfo.suffix }}</span>
            </div>
            <div class="text-gray-500 text-sm mt-1">{{ residentInfo.personalInfo.occupation || 'Resident' }}</div>
            <div class="text-gray-400 text-xs mt-1">
              {{ residentInfo.personalInfo.birthPlace || 'Olongapo City' }}
            </div>
          </div>
        </div>

        <!-- Personal Information Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-gray-900">Personal Information</h2>
            <button
              class="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold transition"
              (click)="showEdit = true"
            >
              Edit
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div>
              <div class="text-gray-500 text-xs mb-1">First Name</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.firstName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Last Name</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.lastName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Middle Name</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.middleName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Suffix</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.suffix || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Gender</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.gender || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Birth Date</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.birthDate || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Birth Place</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.birthPlace || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Age</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.age || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Civil Status</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.civilStatus || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Nationality</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.nationality || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Religion</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.religion || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Occupation</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.occupation || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Contact No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.contactNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">PWD</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.pwd || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">PWD ID No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.pwdIdNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Monthly Income</div>
              <div class="text-gray-900 font-medium">₱{{ residentInfo.personalInfo.monthlyIncome || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Indigent</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.indigent || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Solo Parent</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.soloParent || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Solo Parent ID No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.soloParentIdNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Senior Citizen</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.seniorCitizen || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Senior Citizen ID No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.seniorCitizenIdNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">4Ps Member</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.fourPsMember || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Registered Voter</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.personalInfo.registeredVoter || '-' }}</div>
            </div>
            <div class="sm:col-span-2">
              <div class="text-gray-500 text-xs mb-1">Address</div>
              <div class="text-gray-900 font-medium">
                Purok {{ residentInfo.personalInfo.purokNo || '-' }},
                {{ residentInfo.personalInfo.houseNo || '-' }} {{ residentInfo.personalInfo.street || '-' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Other Details Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Other Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div>
              <div class="text-gray-500 text-xs mb-1">National ID No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.nationalIdNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Voter's ID No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.votersIdNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Covid Status</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.covidStatus || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Vaccinated</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.vaccinated || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Deceased</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.deceased || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Date of Registration</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.otherDetails.dateOfRegistration || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- Emergency Contact Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Emergency Contact</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm">
            <div>
              <div class="text-gray-500 text-xs mb-1">Full Name</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.emergencyContact.fullName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Relationship</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.emergencyContact.relationship || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Contact No.</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.emergencyContact.contactNo || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500 text-xs mb-1">Address</div>
              <div class="text-gray-900 font-medium">{{ residentInfo.emergencyContact.address || '-' }}</div>
            </div>
          </div>
        </div>

        <!-- Edit Information Modal -->
        <div
          *ngIf="showEdit"
          class="fixed inset-0 flex items-center justify-center z-50"
        >
          <!-- Blurred background overlay -->
          <div class="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
          <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] z-10">
            <button
              class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              (click)="showEdit = false"
            >✕</button>
            <h2 class="text-lg font-bold text-gray-800 mb-4">Edit Personal Information</h2>
            <form (ngSubmit)="saveEdit()" #editForm="ngForm" class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.lastName" name="lastName" required />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.firstName" name="firstName" required />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Middle Name</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.middleName" name="middleName" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Suffix</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.suffix" name="suffix" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.gender" name="gender" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Birth Date</label>
                <input type="date" class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.birthDate" name="birthDate" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Birth Place</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.birthPlace" name="birthPlace" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Age</label>
                <input type="number" class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.age" name="age" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Civil Status</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.civilStatus" name="civilStatus" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nationality</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.nationality" name="nationality" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Religion</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.religion" name="religion" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Occupation</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.occupation" name="occupation" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Contact No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.contactNo" name="contactNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">PWD</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.pwd" name="pwd" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">PWD ID No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.pwdIdNo" name="pwdIdNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Monthly Income</label>
                <input type="number" class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.monthlyIncome" name="monthlyIncome" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Indigent</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.indigent" name="indigent" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Solo Parent</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.soloParent" name="soloParent" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Solo Parent ID No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.soloParentIdNo" name="soloParentIdNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Senior Citizen</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.seniorCitizen" name="seniorCitizen" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Senior Citizen ID No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.seniorCitizenIdNo" name="seniorCitizenIdNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">4Ps Member</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.fourPsMember" name="fourPsMember" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Registered Voter</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.registeredVoter" name="registeredVoter" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Purok No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.purokNo" name="purokNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">House No.</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.houseNo" name="houseNo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Street</label>
                <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.street" name="street" />
              </div>
              <div class="sm:col-span-2 lg:col-span-4 flex justify-end mt-2">
                <button
                  type="submit"
                  class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition"
                >Save</button>
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
      width: 8px;
      background: #e5e7eb;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 8px;
    }
  `]
})
export class ProfileComponent {
  residentInfo: ResidentInfo = {
    personalInfo: {
      lastName: 'Dela Cruz',
      firstName: 'Juan',
      middleName: 'Santos',
      suffix: '',
      gender: 'Male',
      birthDate: '1990-01-01',
      birthPlace: 'Olongapo City',
      age: 34,
      civilStatus: 'Single',
      nationality: 'Filipino',
      religion: 'Catholic',
      occupation: 'Engineer',
      contactNo: '09171234567',
      pwd: 'No',
      pwdIdNo: '',
      monthlyIncome: 25000,
      indigent: 'No',
      soloParent: 'No',
      soloParentIdNo: '',
      seniorCitizen: 'No',
      seniorCitizenIdNo: '',
      fourPsMember: 'No',
      registeredVoter: 'Yes',
      purokNo: '3',
      houseNo: '123',
      street: 'Sampaguita St.'
    },
    emergencyContact: {
      fullName: 'Maria Dela Cruz',
      relationship: 'Mother',
      contactNo: '09181234567',
      address: '123 Sampaguita St., Olongapo City'
    },
    otherDetails: {
      nationalIdNo: 'PH1234567890',
      votersIdNo: 'VOT1234567',
      covidStatus: 'Negative',
      vaccinated: 'Yes',
      deceased: 'Alive',
      dateOfRegistration: '2024-01-15'
    }
  };

  showEdit = false;
  editInfo: ResidentInfo = JSON.parse(JSON.stringify(this.residentInfo));

  saveEdit() {
    this.residentInfo = JSON.parse(JSON.stringify(this.editInfo));
    this.showEdit = false;
  }
}
