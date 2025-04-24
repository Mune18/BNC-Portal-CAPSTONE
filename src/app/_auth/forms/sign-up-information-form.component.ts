import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface ResidentInfo {
  // Photo will be handled separately
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
  selector: 'app-sign-up-information-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full h-screen overflow-hidden">
      <!-- Background elements -->
      <div class="absolute left-0 top-0 w-1/2 h-screen z-0">
        <div class="absolute left-0 top-0 transform w-full">
          <div class="relative w-full pt-full rounded-r-full bg-blue-800">
            <div class="absolute inset-1 flex items-center justify-center">
              <div class="w-3/4 h-3/4">
                <img src="/assets/BNC_Portal_Logo.png" alt="Barangay New Cabalan Logo" class="w-full h-full">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="absolute left-[-15vh] top-[-15vh] w-230 h-230 z-0">
        <div class="relative left-[-2vh] top-[-2vh] w-full h-full rounded-full bg-blue-300 opacity-25"></div>
        <div class="absolute left-1 top-1 w-215 h-215 transform -translate-x-1 -translate-y-1 bg-blue-800 rounded-full"></div>
        <div class="absolute left-1/2 top-1/2 w-115 h-115 transform -translate-x-1/2 -translate-y-1/2 rounded-full">
          <img src="/assets/BNC_Portal_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>
      
      <div class="absolute top-2 right-2 z-20">
        <div class="w-25 h-25">
          <img src="/assets/Olongapo_City_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>
      
      <!-- Form Content -->
      <div class="absolute inset-0 flex items-center justify-center p-8 z-30">
        <div class="w-full max-w-[90rem] bg-white rounded-xl shadow-lg p-8">
          <!-- Main Form -->
          <div [hidden]="showPreview" class="grid grid-cols-6 gap-8">
            <!-- Left Column - Photo and Emergency Contact -->
            <div class="col-span-1">
              <!-- Photo Upload Section -->
              <div class="mb-8">
                <div class="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-1/2 w-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Upload Image
                </button>
              </div>

              <!-- Emergency Contact -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" [(ngModel)]="residentInfo.emergencyContact.fullName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input type="text" [(ngModel)]="residentInfo.emergencyContact.relationship" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                    <input type="tel" [(ngModel)]="residentInfo.emergencyContact.contactNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea rows="3" [(ngModel)]="residentInfo.emergencyContact.address" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Forms -->
            <div class="col-span-5">
              <!-- Personal Information -->
              <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold mb-6 text-gray-800">Personal Information</h3>
                <div class="grid grid-cols-6 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.lastName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.firstName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.middleName" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.suffix" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select [(ngModel)]="residentInfo.personalInfo.gender" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input type="date" [(ngModel)]="residentInfo.personalInfo.birthDate" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.birthPlace" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input type="number" [(ngModel)]="residentInfo.personalInfo.age" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                    <select [(ngModel)]="residentInfo.personalInfo.civilStatus" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.nationality" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.religion" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.occupation" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                    <input type="tel" [(ngModel)]="residentInfo.personalInfo.contactNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">PWD?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.pwd" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">PWD ID No.</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.pwdIdNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Family Monthly Income</label>
                    <input type="number" [(ngModel)]="residentInfo.personalInfo.monthlyIncome" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Indigent?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.indigent" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Solo Parent?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.soloParent" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Solo Parent ID No.</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.soloParentIdNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Senior Citizen?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.seniorCitizen" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Senior Citizen ID No.</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.seniorCitizenIdNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">4ps Member?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.fourPsMember" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Registered Voter?</label>
                    <select [(ngModel)]="residentInfo.personalInfo.registeredVoter" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Purok No.</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.purokNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">House No.</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.houseNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input type="text" [(ngModel)]="residentInfo.personalInfo.street" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                </div>
              </div>

              <!-- Other Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-6 text-gray-800">Other Details</h3>
                <div class="grid grid-cols-6 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">National ID No.</label>
                    <input type="text" [(ngModel)]="residentInfo.otherDetails.nationalIdNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Voter's ID No.</label>
                    <input type="text" [(ngModel)]="residentInfo.otherDetails.votersIdNo" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Covid Status</label>
                    <select [(ngModel)]="residentInfo.otherDetails.covidStatus" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="negative">Negative</option>
                      <option value="positive">Positive</option>
                      <option value="recovered">Recovered</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vaccinated</label>
                    <select [(ngModel)]="residentInfo.otherDetails.vaccinated" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Deceased</label>
                    <select [(ngModel)]="residentInfo.otherDetails.deceased" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select</option>
                      <option value="alive">Alive</option>
                      <option value="deceased">Deceased</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date of Registration</label>
                    <input type="date" [(ngModel)]="residentInfo.otherDetails.dateOfRegistration" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4 mt-6">
                <button 
                  (click)="onBack()" 
                  class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
                >
                  Back
                </button>
                <button 
                  (click)="onSubmit()" 
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <!-- Preview Modal -->
          <div *ngIf="showPreview" class="w-full max-w-[90rem] bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Review Your Information</h2>
              <button (click)="showPreview = false" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-6 gap-8">
              <!-- Left Column - Photo and Emergency Contact -->
              <div class="col-span-1">
                <!-- Photo Preview -->
                <div class="mb-8">
                  <div class="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-1/2 w-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Emergency Contact Preview -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h3>
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Full Name</p>
                      <p class="text-gray-800">{{residentInfo.emergencyContact.fullName}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Relationship</p>
                      <p class="text-gray-800">{{residentInfo.emergencyContact.relationship}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Contact No.</p>
                      <p class="text-gray-800">{{residentInfo.emergencyContact.contactNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Address</p>
                      <p class="text-gray-800">{{residentInfo.emergencyContact.address}}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column - Forms -->
              <div class="col-span-5">
                <!-- Personal Information Preview -->
                <div class="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 class="text-lg font-semibold mb-6 text-gray-800">Personal Information</h3>
                  <div class="grid grid-cols-6 gap-4">
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Last Name</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.lastName}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">First Name</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.firstName}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Middle Name</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.middleName}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Suffix</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.suffix}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Gender</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.gender}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Birth Date</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.birthDate | date}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Birth Place</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.birthPlace}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Age</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.age}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Civil Status</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.civilStatus}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Nationality</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.nationality}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Religion</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.religion}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Occupation</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.occupation}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Contact No.</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.contactNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">PWD</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.pwd}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">PWD ID No.</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.pwdIdNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Monthly Income</p>
                      <p class="text-gray-800">₱{{residentInfo.personalInfo.monthlyIncome}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Senior Citizen</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.seniorCitizen}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Senior Citizen ID</p>
                      <p class="text-gray-800">{{residentInfo.personalInfo.seniorCitizenIdNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Address</p>
                      <p class="text-gray-800">
                        Purok {{residentInfo.personalInfo.purokNo}}, 
                        {{residentInfo.personalInfo.houseNo}} {{residentInfo.personalInfo.street}}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Other Details Preview -->
                <div class="bg-gray-50 rounded-lg p-6">
                  <h3 class="text-lg font-semibold mb-6 text-gray-800">Other Details</h3>
                  <div class="grid grid-cols-6 gap-4">
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">National ID No.</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.nationalIdNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Voter's ID No.</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.votersIdNo}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Covid Status</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.covidStatus}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Vaccinated</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.vaccinated}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Deceased</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.deceased}}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm font-medium text-gray-500">Date of Registration</p>
                      <p class="text-gray-800">{{residentInfo.otherDetails.dateOfRegistration | date}}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons for Preview -->
                <div class="flex justify-end space-x-4 mt-6">
                  <button 
                    (click)="showPreview = false" 
                    class="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
                  >
                    Edit Information
                  </button>
                  <button 
                    (click)="onFinalSubmit()" 
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    
    input, select, textarea {
      padding: 0.5rem;
      font-size: 0.875rem;
      border: 1px solid #e5e7eb;
    }
    
    input:focus, select:focus, textarea:focus {
      outline: none;
      ring: 2px;
      ring-color: #3b82f6;
      border-color: #3b82f6;
    }
  `]
})
export class SignUpInformationFormComponent {
  showPreview = false;
  residentInfo: ResidentInfo = {
    personalInfo: {
      lastName: '',
      firstName: '',
      middleName: '',
      suffix: '',
      gender: '',
      birthDate: '',
      birthPlace: '',
      age: 0,
      civilStatus: '',
      nationality: '',
      religion: '',
      occupation: '',
      contactNo: '',
      pwd: '',
      pwdIdNo: '',
      monthlyIncome: 0,
      indigent: '',
      soloParent: '',
      soloParentIdNo: '',
      seniorCitizen: '',
      seniorCitizenIdNo: '',
      fourPsMember: '',
      registeredVoter: '',
      purokNo: '',
      houseNo: '',
      street: ''
    },
    emergencyContact: {
      fullName: '',
      relationship: '',
      contactNo: '',
      address: ''
    },
    otherDetails: {
      nationalIdNo: '',
      votersIdNo: '',
      covidStatus: '',
      vaccinated: '',
      deceased: '',
      dateOfRegistration: ''
    }
  };

  constructor(private router: Router) {}

  onBack() {
    this.router.navigate(['/sign-up']);
  }

  onSubmit() {
    // Show the preview
    this.showPreview = true;
  }

  onFinalSubmit() {
    // Here you would typically send the data to your backend
    console.log('Final form submission:', this.residentInfo);
    // Navigate to success page or show success message
    this.router.navigate(['/sign-up/success']);
  }
}
