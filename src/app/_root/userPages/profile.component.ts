import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentUpdate } from '../../shared/types/resident-update';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
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
                Request Edit
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
                <div class="text-gray-900 font-medium">
                  {{ residentInfo ? calculateAge(residentInfo.personalInfo.birthDate) : '-' }}
                </div>
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
              <div>
                <div class="text-gray-500 text-xs mb-1">National ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.nationalIdNo || 'Not provided' : '-' }}</div>
              </div>
              <div>
                <div class="text-gray-500 text-xs mb-1">Voter's ID No.</div>
                <div class="text-gray-900 font-medium">{{ residentInfo ? residentInfo.otherDetails.votersIdNo || 'Not provided' : '-' }}</div>
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

          <!-- Update Requests Status Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8" *ngIf="updateRequests && updateRequests.length > 0">
            <h2 class="text-base font-semibold text-gray-900 mb-4">Update Request Status</h2>
            <div class="space-y-3">
              <div *ngFor="let request of updateRequests" class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div class="text-sm font-medium text-gray-900">
                    Request #{{ request.$id?.slice(-6) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': request.status === 'pending',
                        'bg-green-100 text-green-800': request.status === 'approved',
                        'bg-red-100 text-red-800': request.status === 'rejected'
                      }"
                    >
                      {{ request.status | titlecase }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-gray-500 mb-2">
                  Submitted: {{ formatDate(request.createdAt) }}
                </div>
                <div *ngIf="request.reviewedAt" class="text-xs text-gray-500 mb-2">
                  Reviewed: {{ formatDate(request.reviewedAt) }}
                </div>
                <div *ngIf="request.reason && request.status === 'rejected'" class="text-xs text-red-600 mt-2">
                  Reason: {{ request.reason }}
                </div>
                <div *ngIf="request.status === 'pending'" class="text-xs text-yellow-600 mt-2">
                  Your update request is pending approval from the Barangay Admin.
                </div>
                <div *ngIf="request.status === 'approved'" class="text-xs text-green-600 mt-2">
                  Your information has been updated successfully.
                </div>
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
            <h2 class="text-lg font-bold text-gray-800 mb-4">Request Information Update</h2>
            
            <!-- Info Message -->
            <div class="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="font-medium mb-1">Information Update Process</p>
                  <p>Your changes will be submitted for approval by the Barangay Admin. You will be notified once your request has been reviewed.</p>
                </div>
              </div>
            </div>
            
            <!-- Error/Success Messages -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{{ errorMessage }}</div>
            <div *ngIf="saveSuccess" class="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Update request submitted successfully! Please wait for admin approval.
            </div>
            
            <form (ngSubmit)="saveEdit()" #editForm="ngForm" class="space-y-6">
              <!-- Personal Information Section -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.lastName" name="lastName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.firstName" name="firstName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Middle Name</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.middleName" name="middleName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Suffix</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.suffix" name="suffix" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <select [(ngModel)]="editInfo.personalInfo.gender" name="gender" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Date</label>
                    <input type="date" [(ngModel)]="editInfo.personalInfo.birthDate" name="birthDate" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Birth Place</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.birthPlace" name="birthPlace" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Civil Status</label>
                    <select [(ngModel)]="editInfo.personalInfo.civilStatus" name="civilStatus" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Nationality</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.nationality" name="nationality" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Religion</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.religion" name="religion" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Occupation</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.occupation" name="occupation" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                    <input type="tel" [(ngModel)]="editInfo.personalInfo.contactNo" name="contactNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD</label>
                    <select [(ngModel)]="editInfo.personalInfo.pwd" name="pwd" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">PWD ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.pwdIdNo" name="pwdIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Monthly Income</label>
                    <input type="number" [(ngModel)]="editInfo.personalInfo.monthlyIncome" name="monthlyIncome" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Indigent</label>
                    <select [(ngModel)]="editInfo.personalInfo.indigent" name="indigent" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent</label>
                    <select [(ngModel)]="editInfo.personalInfo.soloParent" name="soloParent" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Solo Parent ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.soloParentIdNo" name="soloParentIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen</label>
                    <select [(ngModel)]="editInfo.personalInfo.seniorCitizen" name="seniorCitizen" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Senior Citizen ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.seniorCitizenIdNo" name="seniorCitizenIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">4Ps Member</label>
                    <select [(ngModel)]="editInfo.personalInfo.fourPsMember" name="fourPsMember" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Registered Voter</label>
                    <select [(ngModel)]="editInfo.personalInfo.registeredVoter" name="registeredVoter" 
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Purok No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.purokNo" name="purokNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">House No.</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.houseNo" name="houseNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Street</label>
                    <input type="text" [(ngModel)]="editInfo.personalInfo.street" name="street" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">National ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.otherDetails.nationalIdNo" name="nationalIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Voter's ID No.</label>
                    <input type="text" [(ngModel)]="editInfo.otherDetails.votersIdNo" name="votersIdNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <!-- Emergency Contact Section -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.fullName" name="emergencyFullName" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Relationship</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.relationship" name="emergencyRelationship" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Contact No.</label>
                    <input type="tel" [(ngModel)]="editInfo.emergencyContact.contactNo" name="emergencyContactNo" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Address</label>
                    <input type="text" [(ngModel)]="editInfo.emergencyContact.address" name="emergencyAddress" 
                           class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end mt-6">
                <button
                  type="submit"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2"
                  [disabled]="saveLoading || saveSuccess"
                >
                  <span *ngIf="saveLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span *ngIf="saveSuccess" class="h-4 w-4">✓</span>
                  Submit Request
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
      deceased: '',
      dateOfRegistration: ''
    }
  };
  editInfo: ResidentInfo = this.getEmptyResidentInfo();
  updateRequests: ResidentUpdate[] = [];
  showEdit = false;
  isLoading = true;
  errorMessage = '';
  saveLoading = false;
  saveSuccess = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private residentUpdateService: ResidentUpdateService,
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
        
        // Load update requests for this user
        this.updateRequests = await this.residentUpdateService.getUserUpdateRequests(account.$id);
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
        // Calculate the changes between original and edited info
        const changes = this.getChanges(this.residentInfo, this.editInfo);
        
        if (Object.keys(changes).length === 0) {
          this.errorMessage = 'No changes detected.';
          return;
        }
        
        // Submit update request instead of directly updating
        await this.residentUpdateService.submitUpdateRequest({
          residentId: userDoc.$id, // This should be the resident document ID
          userId: account.$id,     // This is the auth user ID
          changes: changes
        });
        
        this.saveSuccess = true;
        
        // Reload update requests to show the new one
        this.updateRequests = await this.residentUpdateService.getUserUpdateRequests(account.$id);
        
        // Close the modal after 2 seconds
        setTimeout(() => {
          this.showEdit = false;
          this.saveSuccess = false;
        }, 2000);
      } else {
        this.errorMessage = 'Unable to submit update request: User document not found.';
      }
    } catch (error) {
      console.error('Error submitting update request:', error);
      this.errorMessage = 'Failed to submit update request. Please try again.';
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

  /**
   * Compare original and edited info to get only the changed fields
   */
  private getChanges(original: ResidentInfo, edited: ResidentInfo): Partial<ResidentInfo> {
    const changes: any = {};
    
    // Compare personalInfo
    const personalChanges: any = {};
    Object.keys(edited.personalInfo).forEach(key => {
      const originalValue = (original.personalInfo as any)[key];
      const editedValue = (edited.personalInfo as any)[key];
      if (originalValue !== editedValue) {
        personalChanges[key] = editedValue;
      }
    });
    if (Object.keys(personalChanges).length > 0) {
      changes.personalInfo = personalChanges;
    }
    
    // Compare emergencyContact
    const emergencyChanges: any = {};
    Object.keys(edited.emergencyContact).forEach(key => {
      const originalValue = (original.emergencyContact as any)[key];
      const editedValue = (edited.emergencyContact as any)[key];
      if (originalValue !== editedValue) {
        emergencyChanges[key] = editedValue;
      }
    });
    if (Object.keys(emergencyChanges).length > 0) {
      changes.emergencyContact = emergencyChanges;
    }
    
    // Compare otherDetails
    const otherChanges: any = {};
    Object.keys(edited.otherDetails).forEach(key => {
      const originalValue = (original.otherDetails as any)[key];
      const editedValue = (edited.otherDetails as any)[key];
      if (originalValue !== editedValue) {
        otherChanges[key] = editedValue;
      }
    });
    if (Object.keys(otherChanges).length > 0) {
      changes.otherDetails = otherChanges;
    }
    
    return changes;
  }
}
