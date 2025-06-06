import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { ResidentInfo } from '../../shared/types/resident';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen py-8 px-2">
      <div class="max-w-3xl mx-auto">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex justify-center">
          <div class="flex flex-col items-center">
            <div class="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">Loading profile information...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6 mb-8">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600">{{ errorMessage }}</p>
          </div>
          <button 
            (click)="ngOnInit()" 
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
          >
            Try Again
          </button>
        </div>

        <!-- Profile Content (only show when not loading and no error) -->
        <ng-container *ngIf="!isLoading && !errorMessage">
          <!-- Profile Header -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-4 mb-8">
            <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
              <img *ngIf="residentInfo && residentInfo.profileImage" [src]="residentInfo.profileImage" alt="Profile Image" class="w-full h-full object-cover">
              <svg *ngIf="!residentInfo || !residentInfo.profileImage" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <div class="text-xl font-semibold text-gray-900">
                {{ residentInfo ? residentInfo.personalInfo.firstName : '-' }} 
                {{ residentInfo && residentInfo.personalInfo.middleName ? residentInfo.personalInfo.middleName + ' ' : '' }}
                {{ residentInfo ? residentInfo.personalInfo.lastName : '-' }} 
                <span *ngIf="residentInfo && residentInfo.personalInfo.suffix">{{ residentInfo.personalInfo.suffix }}</span>
              </div>
              <div class="text-gray-500 text-sm mt-1">{{ residentInfo ? residentInfo.personalInfo.occupation : 'Resident' }}</div>
              <div class="text-gray-400 text-xs mt-1">
                {{ residentInfo ? residentInfo.personalInfo.birthPlace : 'Olongapo City' }}
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
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.firstName : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Last Name</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.lastName : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Middle Name</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.middleName : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Suffix</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.suffix : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Gender</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.gender : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Birth Date</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? formatDate(residentInfo.personalInfo.birthDate) : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Birth Place</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.birthPlace : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Age</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.age : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Civil Status</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.civilStatus : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Nationality</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.nationality : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Religion</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.religion : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Occupation</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.occupation : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Contact No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.contactNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">PWD</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.pwd : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">PWD ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.pwdIdNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Monthly Income</div>
                <div class="text-gray-900 font-medium">₱{{ residentInfo ? residentInfo.personalInfo.monthlyIncome : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Indigent</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.indigent : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Solo Parent</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.soloParent : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Solo Parent ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.soloParentIdNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Senior Citizen</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.seniorCitizen : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Senior Citizen ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.seniorCitizenIdNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">4Ps Member</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.fourPsMember : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Registered Voter</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.personalInfo.registeredVoter : '-' }}</div>
              </div>
              <div class="sm:col-span-2">
                <div class="text-gray-500 text-xs mb-1">Address</div>
                <div class="text-gray-900 font-medium">
                  Purok {{ residentInfo ? residentInfo.personalInfo.purokNo : '-' }},
                  {{ residentInfo ? residentInfo.personalInfo.houseNo : '-' }} {{ residentInfo ? residentInfo.personalInfo.street : '-' }}
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
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.nationalIdNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Voter's ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.votersIdNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Covid Status</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.covidStatus : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Vaccinated</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.vaccinated : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Deceased</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.deceased : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Date of Registration</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? formatDate(residentInfo.otherDetails.dateOfRegistration) : '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Emergency Contact Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-base font-semibold text-gray-900 mb-4">Emergency Contact</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-sm">
              <div>
                <div class="text-gray-500 text-xs mb-1">Full Name</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.emergencyContact.fullName : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Relationship</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.emergencyContact.relationship : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Contact No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.emergencyContact.contactNo : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Address</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.emergencyContact.address : '-' }}</div>
              </div>
            </div>
          </div>
        </ng-container>

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
              [disabled]="saveLoading"
            >✕</button>
            <h2 class="text-lg font-bold text-gray-800 mb-4">Edit Personal Information</h2>
            
            <!-- Error/Success Messages -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{{ errorMessage }}</div>
            <div *ngIf="saveSuccess" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully!
            </div>
            
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
                  class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2"
                  [disabled]="saveLoading || saveSuccess"
                >
                  <span *ngIf="saveLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span *ngIf="saveSuccess" class="h-4 w-4">✓</span>
                  Save
                </button>
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
export class ProfileComponent implements OnInit {
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
  editInfo: ResidentInfo = this.getEmptyResidentInfo();
  showEdit = false;
  isLoading = true;
  errorMessage = '';
  saveLoading = false;
  saveSuccess = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      console.log('Initializing profile component...');
      // Get the current authenticated user's account
      const account = await this.authService.getAccount();
      
      if (!account) {
        console.log('No account found, redirecting to sign-in');
        this.router.navigate(['/sign-in']);
        return;
      }
      
      console.log('Account found:', account.$id);
      // Get the user's document from database using the account ID
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc) {
        console.log('User information retrieved:', userDoc);
        this.residentInfo = userDoc;
        // Create a deep copy for editing
        this.editInfo = JSON.parse(JSON.stringify(userDoc));
      } else {
        console.log('No user information found');
        this.errorMessage = 'Unable to load profile information.';
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Error loading profile data. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async saveEdit() {
    this.saveLoading = true;
    this.saveSuccess = false;
    this.errorMessage = '';
    
    try {
      const account = await this.authService.getAccount();
      
      if (!account) {
        this.router.navigate(['/sign-in']);
        return;
      }
      
      // Find user document by account ID first
      const userDoc = await this.userService.getUserInformation(account.$id);
      
      if (userDoc && userDoc.$id) {
        // Update document with the edited information
        await this.userService.updateUser(userDoc.$id, this.editInfo);
        
        // Update the displayed information
        this.residentInfo = JSON.parse(JSON.stringify(this.editInfo));
        this.saveSuccess = true;
        
        // Close the modal after 1.5 seconds
        setTimeout(() => {
          this.showEdit = false;
          this.saveSuccess = false;
        }, 1500);
      } else {
        this.errorMessage = 'Unable to update profile: User document not found.';
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.errorMessage = 'Failed to update profile. Please try again.';
    } finally {
      this.saveLoading = false;
    }
  }

  // Helper method to create empty ResidentInfo structure
  private getEmptyResidentInfo(): ResidentInfo {
    return {
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
  }

  // Add this method to format dates
  formatDate(dateString: string | number | Date): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '-';
    
    // Format date as "Month Day, Year" (e.g., "July 18, 2004")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
