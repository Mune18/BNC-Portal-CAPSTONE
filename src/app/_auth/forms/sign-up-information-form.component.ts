import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResidentInfoPreviewModalComponent } from './resident-info-preview-modal.component';
import { ResidentInfo } from '../../shared/types/resident';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-sign-up-information-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentInfoPreviewModalComponent,],
  template: `
    <div class="relative w-full min-h-screen overflow-hidden">
      <!--Start Background Animation Body-->
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <!--End Background Animation Body-->

      <!-- Blue circular design with logo on left -->
      <div class="absolute left-0 top-0 w-1/2 h-screen z-0">
        <div class="absolute left-0 top-0 transform w-full">
          <div class="relative w-full pt-full rounded-r-full bg-blue-800">
            <!-- Barangay Logo -->
            <div class="absolute inset-1 flex items-center justify-center">
              <div class="w-3/4 h-3/4">
                <img src="/assets/BNC_Portal_Logo.png" alt="Barangay New Cabalan Logo" class="w-full h-full">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- New Light blue circle in top left corner -->
      <div class="absolute left-[-15vh] top-[-15vh] w-230 h-230 z-0">
        <div class="relative left-[-2vh] top-[-2vh] w-full h-full rounded-full bg-blue-300 opacity-25"></div>
        <div class="absolute left-1 top-1 w-215 h-215 transform -translate-x-1 -translate-y-1 bg-blue-800 rounded-full z-10"></div>
        <div class="absolute left-1/2 top-1/2 w-115 h-115 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-100">
          <img src="/assets/BNC_Portal_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>
      <!-- City seal in top right corner -->
      <div class="absolute top-2 right-2 z-0">
        <div class="w-25 h-25">
          <img src="/assets/Olongapo_City_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>

      <!-- Form content (blurred only when modal is open) -->
      <div [class.blur-md]="showPreviewModal" class="flex flex-col items-center justify-center min-h-screen relative z-40 px-2 sm:px-6 transition-all duration-300">
        <form
          [ngClass]="{
            'w-full max-w-sm': currentStep === 1,
            'w-full max-w-4xl': currentStep === 2
          }"
          class="bg-white/90 backdrop-blur-lg p-4 sm:p-8 rounded-2xl shadow-2xl h-150 flex flex-col justify-center transition-all duration-300"
          style="overflow: hidden;"
          (ngSubmit)="onNextOrShowPreview()"
        >
          <!-- Stepper Navigation -->
          <div class="flex justify-center mb-6 sm:mb-8">
            <div class="flex items-center">
              <div [class.bg-blue-800]="currentStep === 1" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 transition-colors duration-300" [class.bg-gray-300]="currentStep !== 1">1</div>
              <span class="mr-4 font-semibold" [class.text-blue-800]="currentStep === 1">Account Info</span>
              <div class="w-8 h-1 bg-gray-300 mx-2"></div>
              <div [class.bg-blue-800]="currentStep === 2" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 transition-colors duration-300" [class.bg-gray-300]="currentStep !== 2">2</div>
              <span class="font-semibold" [class.text-blue-800]="currentStep === 2">Personal Info</span>
            </div>
          </div>

          <!-- Section 1: Account Info -->
          <div *ngIf="currentStep === 1" class="flex flex-col justify-center flex-1">
            <h2 class="text-center text-2xl font-bold mb-6">Register Account</h2>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="formData.account.email" name="email"
                class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">Password</label>
              <input type="password" id="password" [(ngModel)]="formData.account.password" name="password"
                class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
            </div>
            <div class="mb-8">
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" [(ngModel)]="formData.account.confirmPassword" name="confirmPassword"
                class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
            </div>
            <div class="flex justify-end">
              <button type="button" (click)="nextStep()"
                class="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400">
                Next
              </button>
            </div>
            <p class="text-center mt-4">
              Already have an account? <a href="sign-in" class="text-blue-600 hover:underline">Login Now</a>
            </p>
          </div>

          <!-- Section 2: Personal Info (all fields from sign-up-information-form) -->
          <div *ngIf="currentStep === 2" class="flex-1 overflow-y-auto">
            <h2 class="text-center text-2xl font-bold mb-6">Personal Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <!-- Left column: Profile image at top, then fields below -->
              <div class="flex flex-col items-center md:items-stretch col-span-1">
                <!-- Profile image at the very top -->
                <div class="flex flex-col items-center mb-4">
                  <div class="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-2 border-4 border-blue-300">
                    <img *ngIf="formData.profileImage" [src]="formData.profileImage" alt="Profile Image" class="object-cover w-full h-full" />
                    <span *ngIf="!formData.profileImage" class="text-gray-400 text-4xl">+</span>
                  </div>
                  <label class="cursor-pointer bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition mb-4">
                    Upload Profile Image
                    <input type="file" accept="image/*" (change)="onProfileImageChange($event)" hidden>
                  </label>
                </div>
                <!-- Fields below the image -->
                <div class="flex flex-col gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.lastName" name="lastName" class="w-full border-gray-300 rounded-lg shadow-sm" required>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.firstName" name="firstName" class="w-full border-gray-300 rounded-lg shadow-sm" required>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Middle Name</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.middleName" name="middleName" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Suffix</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.suffix" name="suffix" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                </div>
              </div>
              <!-- Right column: The rest of the fields -->
              <div class="md:col-span-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <!-- Remove the fields already placed on the left column above -->
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select [(ngModel)]="formData.personalInfo.gender" name="gender" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Date</label>
                    <input type="date" [(ngModel)]="formData.personalInfo.birthDate" name="birthDate" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Place</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.birthPlace" name="birthPlace" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Age</label>
                    <input type="number" [(ngModel)]="formData.personalInfo.age" name="age" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Civil Status</label>
                    <select [(ngModel)]="formData.personalInfo.civilStatus" name="civilStatus" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Nationality</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.nationality" name="nationality" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Religion</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.religion" name="religion" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Occupation</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.occupation" name="occupation" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                    <input type="tel" [(ngModel)]="formData.personalInfo.contactNo" name="contactNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD?</label>
                    <select [(ngModel)]="formData.personalInfo.pwd" name="pwd" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD ID No.</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.pwdIdNo" name="pwdIdNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Family Monthly Income</label>
                    <input type="number" [(ngModel)]="formData.personalInfo.monthlyIncome" name="monthlyIncome" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Indigent?</label>
                    <select [(ngModel)]="formData.personalInfo.indigent" name="indigent" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent?</label>
                    <select [(ngModel)]="formData.personalInfo.soloParent" name="soloParent" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent ID No.</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.soloParentIdNo" name="soloParentIdNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen?</label>
                    <select [(ngModel)]="formData.personalInfo.seniorCitizen" name="seniorCitizen" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen ID No.</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.seniorCitizenIdNo" name="seniorCitizenIdNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">4Ps Member?</label>
                    <select [(ngModel)]="formData.personalInfo.fourPsMember" name="fourPsMember" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Registered Voter?</label>
                    <select [(ngModel)]="formData.personalInfo.registeredVoter" name="registeredVoter" class="w-full border-gray-300 rounded-lg shadow-sm">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Purok No.</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.purokNo" name="purokNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">House No.</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.houseNo" name="houseNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Street</label>
                    <input type="text" [(ngModel)]="formData.personalInfo.street" name="street" class="w-full border-gray-300 rounded-lg shadow-sm">
                  </div>
                </div>
              </div>
            </div>
            <!-- Emergency Contact -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-800">Emergency Contact</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                  <input type="text" [(ngModel)]="formData.emergencyContact.fullName" name="emergencyFullName" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Relationship</label>
                  <input type="text" [(ngModel)]="formData.emergencyContact.relationship" name="emergencyRelationship" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                  <input type="tel" [(ngModel)]="formData.emergencyContact.contactNo" name="emergencyContactNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Address</label>
                  <input type="text" [(ngModel)]="formData.emergencyContact.address" name="emergencyAddress" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
              </div>
            </div>
            <!-- Other Details -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-800">Other Details</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">National ID No.</label>
                  <input type="text" [(ngModel)]="formData.otherDetails.nationalIdNo" name="nationalIdNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Voter's ID No.</label>
                  <input type="text" [(ngModel)]="formData.otherDetails.votersIdNo" name="votersIdNo" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Covid Status</label>
                  <select [(ngModel)]="formData.otherDetails.covidStatus" name="covidStatus" class="w-full border-gray-300 rounded-lg shadow-sm">
                    <option value="">Select</option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Vaccinated</label>
                  <select [(ngModel)]="formData.otherDetails.vaccinated" name="vaccinated" class="w-full border-gray-300 rounded-lg shadow-sm">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Deceased</label>
                  <select [(ngModel)]="formData.otherDetails.deceased" name="deceased" class="w-full border-gray-300 rounded-lg shadow-sm">
                    <option value="">Select</option>
                    <option value="Alive">Alive</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Date of Registration</label>
                  <input type="date" [(ngModel)]="formData.otherDetails.dateOfRegistration" name="dateOfRegistration" class="w-full border-gray-300 rounded-lg shadow-sm">
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <button type="button" (click)="prevStep()"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-8 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-gray-400">
                Back
              </button>
              <button type="submit"
                class="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400">
                Next
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal (NOT blurred, always above) -->
      <app-resident-info-preview-modal
        [show]="showPreviewModal"
        [residentInfo]="formData"
        (close)="showPreviewModal = false"
        (confirm)="onSubmit()"
      ></app-resident-info-preview-modal>

      <!-- Registration Success Modal -->
      <div *ngIf="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xs w-full">
          <svg class="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h2 class="text-2xl font-bold mb-2 text-center">Registration Success</h2>
          <p class="mb-6 text-center text-gray-600">Your registration was successful!</p>
          <button (click)="onSuccessOk()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">OK</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .area {
      background: #f1f5f9;
      width: 100%;
      height: 110vh;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
    }
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 96%;
      overflow: hidden;
      z-index: 1;
    }
    .circles li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: rgba(59, 130, 246, 0.18);
      animation: animate 25s linear infinite;
      bottom: -150px;
      filter: blur(8px);
    }
    .circles li:nth-child(1) {
      left: 25%;
      width: 80px;
      height: 80px;
      animation-delay: 0s;
    }
    .circles li:nth-child(2) {
      left: 10%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 12s;
    }
    .circles li:nth-child(3) {
      left: 70%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
    }
    .circles li:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-delay: 0s;
      animation-duration: 18s;
    }
    .circles li:nth-child(5) {
      left: 65%;
      width: 20px;
      height: 20px;
      animation-delay: 0s;
    }
    .circles li:nth-child(6) {
      left: 75%;
      width: 110px;
      height: 110px;
      animation-delay: 3s;
    }
    .circles li:nth-child(7) {
      left: 35%;
      width: 150px;
      height: 150px;
      animation-delay: 7s;
    }
    .circles li:nth-child(8) {
      left: 50%;
      width: 25px;
      height: 25px;
      animation-delay: 15s;
      animation-duration: 45s;
    }
    .circles li:nth-child(9) {
      left: 20%;
      width: 15px;
      height: 15px;
      animation-delay: 2s;
      animation-duration: 35s;
    }
    .circles li:nth-child(10) {
      left: 85%;
      width: 150px;
      height: 150px;
      animation-delay: 0s;
      animation-duration: 11s;
    }
    @keyframes animate {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
      }
      100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
      }
    }
  `]
})
export class SignUpInformationFormComponent {
  currentStep = 1;
  showPreviewModal = false;
  showSuccessModal = false; // <-- Add this line

  formData = {
    account: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    profileImage: '', // <-- Add this line
    personalInfo: {
      lastName: '',
      firstName: '',
      middleName: '',
      suffix: '',
      gender: '',
      birthDate: '',
      birthPlace: '',
      age: 0, // changed from null to 0
      civilStatus: '',
      nationality: '',
      religion: '',
      occupation: '',
      contactNo: '',
      pwd: '',
      pwdIdNo: '',
      monthlyIncome: 0, // changed from null to 0
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  nextStep() {
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  // Change form submit handler to show modal instead of submit
  onNextOrShowPreview() {
    if (this.currentStep === 1) {
      this.nextStep();
    } else if (this.currentStep === 2) {
      this.showPreviewModal = true;
    }
  }

  // Called when user confirms in the modal
  async onSubmit() {
    try {
      // 1. Register user in Appwrite Auth
      const authResponse = await this.authService.register({
        email: this.formData.account.email,
        password: this.formData.account.password,
        confirmPassword: this.formData.account.confirmPassword
      });

      // 2. Immediately log in the user to get a session
      await this.authService.login({
        email: this.formData.account.email,
        password: this.formData.account.password
      });

      // 3. Save user info in Appwrite Database (users collection)
      const userDoc = {
        uid: authResponse.$id,
        email: authResponse.email,
        role: 'resident',
        created_at: new Date().toISOString(),
        is_active: 'true'
      };
      await this.userService.createUser(userDoc);

      // 4. Save resident info in residents collection
      const residentDoc = {
        lastName: this.formData.personalInfo.lastName,
        firstName: this.formData.personalInfo.firstName,
        middleName: this.formData.personalInfo.middleName,
        suffix: this.formData.personalInfo.suffix,
        gender: this.formData.personalInfo.gender,
        birthDate: this.formData.personalInfo.birthDate,
        birthPlace: this.formData.personalInfo.birthPlace,
        age: this.formData.personalInfo.age,
        civilStatus: this.formData.personalInfo.civilStatus,
        nationality: this.formData.personalInfo.nationality,
        religion: this.formData.personalInfo.religion,
        occupation: this.formData.personalInfo.occupation,
        contactNo: this.formData.personalInfo.contactNo,
        pwd: this.formData.personalInfo.pwd,
        pwdIdNo: this.formData.personalInfo.pwdIdNo,
        monthlyIncome: this.formData.personalInfo.monthlyIncome,
        indigent: this.formData.personalInfo.indigent,
        soloParent: this.formData.personalInfo.soloParent,
        soloParentIdNo: this.formData.personalInfo.soloParentIdNo,
        seniorCitizen: this.formData.personalInfo.seniorCitizen,
        seniorCitizenIdNo: this.formData.personalInfo.seniorCitizenIdNo,
        fourPsMember: this.formData.personalInfo.fourPsMember,
        registeredVoter: this.formData.personalInfo.registeredVoter,
        purokNo: this.formData.personalInfo.purokNo,
        houseNo: this.formData.personalInfo.houseNo,
        street: this.formData.personalInfo.street,
        ecFullName: this.formData.emergencyContact.fullName,
        ecRelation: this.formData.emergencyContact.relationship,
        ecContactNo: this.formData.emergencyContact.contactNo,
        ecAddress: this.formData.emergencyContact.address,
        NationalIdNo: this.formData.otherDetails.nationalIdNo,
        votersIdNo: this.formData.otherDetails.votersIdNo,
        covidStatus: this.formData.otherDetails.covidStatus,
        vaccinated: this.formData.otherDetails.vaccinated,
        deceased: this.formData.otherDetails.deceased,
        dateOfRegistration: this.formData.otherDetails.dateOfRegistration,
        userId: authResponse.$id // Link to user
      };

      await this.userService.createResident(residentDoc);

      this.showPreviewModal = false;
      this.showSuccessModal = true;
      console.log('User registration successful:', authResponse); // <-- Success log
    } catch (error) {
      console.error('User registration failed:', error); // <-- Failure log
    }
  }

  onProfileImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.profileImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSuccessOk() {
    this.router.navigate(['/user/home']); // Redirect to user home page after registration
  }
}
