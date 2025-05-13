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
    <div class="bg-gray-100 py-4 px-2">
      <div class="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 border border-gray-200">
        <!-- Profile Photo & Emergency Contact -->
        <div class="md:w-1/4 flex flex-col items-center">
          <div class="aspect-square w-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden border-2 border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 w-full shadow-sm border border-gray-200 text-sm">
            <h3 class="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
              <span class="material-icons text-blue-400">contact_phone</span>
              Emergency Contact
            </h3>
            <div class="space-y-1">
              <div>
                <span class="font-medium text-gray-700">Full Name:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.fullName || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Relationship:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.relationship || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Contact No.:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.contactNo || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Address:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.address || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Profile Details -->
        <div class="md:w-3/4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">Personal Information</h2>
            <button
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
              (click)="showEdit = true"
            >
              Edit Information
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Last Name</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.lastName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">First Name</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.firstName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Middle Name</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.middleName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Suffix</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.suffix || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Gender</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.gender || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Birth Date</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.birthDate || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Birth Place</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.birthPlace || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Age</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.age || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Civil Status</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.civilStatus || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Nationality</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.nationality || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Religion</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.religion || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Occupation</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.occupation || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Contact No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.contactNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">PWD</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.pwd || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">PWD ID No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.pwdIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Monthly Income</div>
              <div class="font-semibold text-gray-900">₱{{ residentInfo.personalInfo.monthlyIncome || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Indigent</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.indigent || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Solo Parent</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.soloParent || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Solo Parent ID No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.soloParentIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Senior Citizen</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.seniorCitizen || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Senior Citizen ID No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.seniorCitizenIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">4Ps Member</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.fourPsMember || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Registered Voter</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.personalInfo.registeredVoter || '-' }}</div>
            </div>
            <div class="sm:col-span-2 lg:col-span-3">
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Address</div>
              <div class="font-semibold text-gray-900">
                Purok {{ residentInfo.personalInfo.purokNo || '-' }}, 
                {{ residentInfo.personalInfo.houseNo || '-' }} {{ residentInfo.personalInfo.street || '-' }}
              </div>
            </div>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">Other Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">National ID No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.nationalIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Voter's ID No.</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.votersIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Covid Status</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.covidStatus || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Vaccinated</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.vaccinated || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Deceased</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.deceased || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-gray-500 font-medium uppercase">Date of Registration</div>
              <div class="font-semibold text-gray-900">{{ residentInfo.otherDetails.dateOfRegistration || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Information Modal -->
      <div
        *ngIf="showEdit"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
          <button
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            (click)="showEdit = false"
          >✕</button>
          <h2 class="text-lg font-bold text-gray-800 mb-4">Edit Personal Information</h2>
          <form (ngSubmit)="saveEdit()" #editForm="ngForm" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              <label class="block text-xs font-medium text-gray-600 mb-1">Contact No.</label>
              <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.contactNo" name="contactNo" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Occupation</label>
              <input class="w-full border rounded px-2 py-1" [(ngModel)]="editInfo.personalInfo.occupation" name="occupation" />
            </div>
            <div class="sm:col-span-2 flex justify-end mt-2">
              <button
                type="submit"
                class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition"
              >Save</button>
            </div>
          </form>
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
