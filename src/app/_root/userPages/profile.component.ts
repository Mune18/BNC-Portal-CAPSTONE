import { Component } from '@angular/core';

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
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2">
      <div class="max-w-7xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col lg:flex-row gap-12 border border-blue-100">
        <!-- Profile Photo & Emergency Contact -->
        <div class="lg:w-1/4 flex flex-col items-center">
          <div class="aspect-square w-48 bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl mb-8 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="bg-blue-50 rounded-2xl p-6 w-full shadow">
            <h3 class="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
              <span class="material-icons text-blue-400">contact_phone</span>
              Emergency Contact
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <span class="font-medium text-blue-700">Full Name:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.fullName || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Relationship:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.relationship || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Contact No.:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.contactNo || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Address:</span>
                <span class="text-gray-800">{{ residentInfo.emergencyContact.address || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Profile Details -->
        <div class="lg:w-3/4">
          <h2 class="text-3xl font-extrabold text-blue-900 mb-8 tracking-tight">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Last Name</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.lastName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">First Name</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.firstName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Middle Name</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.middleName || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Suffix</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.suffix || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Gender</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.gender || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Birth Date</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.birthDate || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Birth Place</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.birthPlace || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Age</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.age || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Civil Status</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.civilStatus || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Nationality</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.nationality || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Religion</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.religion || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Occupation</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.occupation || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Contact No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.contactNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">PWD</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.pwd || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">PWD ID No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.pwdIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Monthly Income</div>
              <div class="font-semibold text-gray-900 text-lg">₱{{ residentInfo.personalInfo.monthlyIncome || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Indigent</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.indigent || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Solo Parent</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.soloParent || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Solo Parent ID No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.soloParentIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Senior Citizen</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.seniorCitizen || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Senior Citizen ID No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.seniorCitizenIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">4Ps Member</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.fourPsMember || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Registered Voter</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.personalInfo.registeredVoter || '-' }}</div>
            </div>
            <div class="md:col-span-3">
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Address</div>
              <div class="font-semibold text-gray-900 text-lg">
                Purok {{ residentInfo.personalInfo.purokNo || '-' }}, 
                {{ residentInfo.personalInfo.houseNo || '-' }} {{ residentInfo.personalInfo.street || '-' }}
              </div>
            </div>
          </div>
          <h2 class="text-3xl font-extrabold text-blue-900 mb-8 tracking-tight">Other Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">National ID No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.nationalIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Voter's ID No.</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.votersIdNo || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Covid Status</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.covidStatus || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Vaccinated</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.vaccinated || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Deceased</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.deceased || '-' }}</div>
            </div>
            <div>
              <div class="mb-1 text-xs text-blue-700 font-medium uppercase">Date of Registration</div>
              <div class="font-semibold text-gray-900 text-lg">{{ residentInfo.otherDetails.dateOfRegistration || '-' }}</div>
            </div>
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
    /* Hide scrollbars for a cleaner look */
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
  // In a real app, this would be loaded from a service or backend
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
}
