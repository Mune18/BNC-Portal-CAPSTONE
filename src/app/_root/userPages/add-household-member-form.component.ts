import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddHouseholdMemberRequest, Relationship } from '../../shared/types/household';

@Component({
  selector: 'app-add-household-member-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Form Progress Indicator -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-gray-700">Form Completion</span>
          <span class="text-sm font-bold text-blue-600">{{ getCompletionPercentage() }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" 
               [style.width.%]="getCompletionPercentage()"></div>
        </div>
        <p class="text-xs text-gray-600 mt-2">{{ getRequiredFieldsCount() }} of {{ getTotalRequiredFields() }} required fields completed</p>
      </div>

      <!-- Section 1: Basic Information -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('basic')"
          class="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between hover:from-blue-100 hover:to-indigo-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Basic Information</h3>
              <p class="text-xs text-gray-600">Name and relationship details</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.basic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.basic" class="p-6 space-y-4 animate-fadeIn">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.lastName"
                placeholder="Enter last name"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.lastName && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                First Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.firstName"
                placeholder="Enter first name"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.firstName && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Middle Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.middleName"
                placeholder="Enter middle name"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.middleName && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Suffix
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.suffix"
                placeholder="Jr., Sr., III (optional)"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Relationship to Head of Household <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.relationship"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.relationship && showErrors"
                required
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Relative">Relative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Personal Details -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('personal')"
          class="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between hover:from-purple-100 hover:to-pink-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Personal Details</h3>
              <p class="text-xs text-gray-600">Demographics and civil status</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.personal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.personal" class="p-6 space-y-4 animate-fadeIn">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Gender <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.gender"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.gender && showErrors"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Birth Date <span class="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                [(ngModel)]="formData.birthDate"
                [max]="maxDate"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.birthDate && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Birth Place <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.birthPlace"
                placeholder="Enter birth place"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.birthPlace && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Civil Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.civilStatus"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.civilStatus && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nationality <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.nationality"
                placeholder="Filipino"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.nationality && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Religion <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.religion"
                (change)="onReligionChange($event)"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.religion && showErrors"
                required
              >
                <option value="">Select your religion</option>
                <option value="Roman Catholic">Roman Catholic</option>
                <option value="Protestant">Protestant</option>
                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                <option value="Islam">Islam</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Seventh-day Adventist">Seventh-day Adventist</option>
                <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
                <option value="Born Again Christian">Born Again Christian</option>
                <option value="Methodist">Methodist</option>
                <option value="Baptist">Baptist</option>
                <option value="Pentecostal">Pentecostal</option>
                <option value="Anglican">Anglican</option>
                <option value="Others">Others (Please specify)</option>
              </select>
            </div>

            <div *ngIf="religionOther" class="md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Please Specify Religion <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.religion"
                placeholder="Enter your religion"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.religion && showErrors"
                required
              >
            </div>

            <div class="md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Educational Attainment <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.educationalAttainment"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.educationalAttainment && showErrors"
                required
              >
                <option value="">Select Educational Attainment</option>
                <option value="ElementaryGraduate">Elementary Graduate</option>
                <option value="HighSchoolGraduate">High School Graduate</option>
                <option value="CollegeGraduate">College Graduate</option>
                <option value="Vocational">Vocational</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Contact & Work -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('contact')"
          class="w-full px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between hover:from-green-100 hover:to-emerald-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Contact & Work</h3>
              <p class="text-xs text-gray-600">Employment and contact information</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.contact" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.contact" class="p-6 space-y-4 animate-fadeIn">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Employment Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.employmentStatus"
                (change)="onEmploymentStatusChange($event)"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.employmentStatus && showErrors"
                required
              >
                <option value="">Select Employment Status</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="SelfEmployed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="OFW">OFW</option>
                <option value="Retired">Retired</option>
                <option value="Housewife">Housewife</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Occupation
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.occupation"
                placeholder="Enter your occupation"
                [disabled]="isOccupationDisabled()"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₱</span>
                <input 
                  type="number" 
                  [(ngModel)]="formData.monthlyIncome"
                  placeholder="0"
                  min="0"
                  [disabled]="isMonthlyIncomeDisabled()"
                  class="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">+63</span>
                <input 
                  type="tel" 
                  [(ngModel)]="formData.contactNo"
                  placeholder="9XXXXXXXXX"
                  maxlength="10"
                  class="w-full pl-14 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  [class.border-red-300]="!formData.contactNo && showErrors"
                  required
                >
              </div>
              <p class="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without +63</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span class="text-gray-400">(Optional)</span>
              </label>
              <input 
                type="email" 
                [(ngModel)]="formData.email"
                placeholder="Enter email address"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Address -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('address')"
          class="w-full px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between hover:from-amber-100 hover:to-orange-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Address Information</h3>
              <p class="text-xs text-gray-600">Residential details (auto-filled)</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.address" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.address" class="p-6 space-y-4 animate-fadeIn">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p class="text-sm text-blue-800">
              <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              Address information is automatically filled from your household details.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Purok Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.purokNo"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                readonly
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                House Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.houseNo"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                readonly
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Street <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.street"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
                readonly
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Housing Ownership <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.housingOwnership"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.housingOwnership && showErrors"
                required
              >
                <option value="">Select Housing Ownership</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Shared">Shared</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Years in Barangay
              </label>
              <input 
                type="number" 
                [(ngModel)]="formData.yearsInBarangay"
                placeholder="Number of years"
                min="0"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Special Categories -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('special')"
          class="w-full px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-between hover:from-rose-100 hover:to-pink-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Special Categories & Benefits</h3>
              <p class="text-xs text-gray-600">PWD, senior citizen, 4Ps, etc.</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.special" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.special" class="p-6 space-y-4 animate-fadeIn">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                PWD Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.pwd"
                (change)="onPwdChange()"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.pwd && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div *ngIf="formData.pwd === 'Yes'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                PWD ID Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.pwdIdNo"
                placeholder="Enter PWD ID Number"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.pwdIdNo && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Solo Parent Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.soloParent"
                (change)="onSoloParentChange()"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.soloParent && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div *ngIf="formData.soloParent === 'Yes'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Solo Parent ID Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.soloParentIdNo"
                placeholder="Enter Solo Parent ID Number"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.soloParentIdNo && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Senior Citizen Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.seniorCitizen"
                (change)="onSeniorCitizenChange()"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.seniorCitizen && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div *ngIf="formData.seniorCitizen === 'Yes'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Senior Citizen ID Number <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.seniorCitizenIdNo"
                placeholder="Enter Senior Citizen ID Number"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.seniorCitizenIdNo && showErrors"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Indigent Status <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.indigent"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.indigent && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                4Ps Member <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.fourPsMember"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.fourPsMember && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Registered Voter <span class="text-red-500">*</span>
              </label>
              <select 
                [(ngModel)]="formData.registeredVoter"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                [class.border-red-300]="!formData.registeredVoter && showErrors"
                required
              >
                <option value="">Select Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 6: Government IDs -->
      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <button 
          type="button"
          (click)="toggleSection('ids')"
          class="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center justify-between hover:from-indigo-100 hover:to-blue-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd"></path>
            </svg>
            <div class="text-left">
              <h3 class="text-lg font-bold text-gray-900">Government IDs</h3>
              <p class="text-xs text-gray-600">Optional but recommended</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 transition-transform" [class.rotate-180]="expandedSections.ids" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <div *ngIf="expandedSections.ids" class="p-6 space-y-4 animate-fadeIn">
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p class="text-sm text-amber-800">
              <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              Providing government ID numbers is optional but helps with verification.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                National ID Number
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.nationalIdNo"
                placeholder="Enter National ID Number"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Voter's ID Number
              </label>
              <input 
                type="text" 
                [(ngModel)]="formData.votersIdNo"
                placeholder="Enter Voter's ID Number"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class AddHouseholdMemberFormComponent implements OnInit {
  @Input() householdData: { purokNo: string; houseNo: string; street: string } | null = null;
  @Output() formDataChange = new EventEmitter<AddHouseholdMemberRequest>();
  @Output() validityChange = new EventEmitter<boolean>();

  formData: Partial<AddHouseholdMemberRequest> = {
    nationality: 'Filipino',
    monthlyIncome: 0,
    yearsInBarangay: '0'
  };

  expandedSections = {
    basic: true,
    personal: false,
    contact: false,
    address: false,
    special: false,
    ids: false
  };

  religionOther = false;
  showErrors = false;
  maxDate: string = '';

  ngOnInit() {
    // Set max date to today
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    // Auto-fill address from household data
    if (this.householdData) {
      this.formData.purokNo = this.householdData.purokNo;
      this.formData.houseNo = this.householdData.houseNo;
      this.formData.street = this.householdData.street;
    }
  }

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  onReligionChange(event: any) {
    const value = event.target.value;
    if (value === 'Others') {
      this.religionOther = true;
      this.formData.religion = '';
    } else {
      this.religionOther = false;
    }
  }

  onEmploymentStatusChange(event: any) {
    const status = event.target.value;
    
    // Auto-set occupation to "None" and monthly income to 0 for statuses that don't require them
    const noOccupationStatuses = ['Unemployed', 'Student', 'Retired', 'Housewife'];
    if (noOccupationStatuses.includes(status)) {
      this.formData.occupation = 'None';
      this.formData.monthlyIncome = 0;
    } else if (this.formData.occupation === 'None') {
      // Clear the occupation and monthly income if user switches to a status that requires them
      this.formData.occupation = '';
      if (this.formData.monthlyIncome === 0) {
        this.formData.monthlyIncome = 0;
      }
    }
  }

  // Method to check if occupation field should be disabled
  isOccupationDisabled(): boolean {
    const status = this.formData.employmentStatus;
    const noOccupationStatuses = ['Unemployed', 'Student', 'Retired', 'Housewife'];
    return status ? noOccupationStatuses.includes(status) : false;
  }

  // Method to check if monthly income field should be disabled
  isMonthlyIncomeDisabled(): boolean {
    const status = this.formData.employmentStatus;
    const noIncomeStatuses = ['Unemployed', 'Student', 'Retired', 'Housewife'];
    return status ? noIncomeStatuses.includes(status) : false;
  }

  onPwdChange() {
    if (this.formData.pwd === 'No') {
      this.formData.pwdIdNo = '';
    }
  }

  onSoloParentChange() {
    if (this.formData.soloParent === 'No') {
      this.formData.soloParentIdNo = '';
    }
  }

  onSeniorCitizenChange() {
    if (this.formData.seniorCitizen === 'No') {
      this.formData.seniorCitizenIdNo = '';
    }
  }

  getCompletionPercentage(): number {
    const required = this.getRequiredFieldsCount();
    const total = this.getTotalRequiredFields();
    return Math.round((required / total) * 100);
  }

  getRequiredFieldsCount(): number {
    let count = 0;
    
    // Basic Information (5 required)
    if (this.formData.firstName) count++;
    if (this.formData.lastName) count++;
    if (this.formData.middleName) count++;
    if (this.formData.relationship) count++;
    
    // Personal Details (7 required)
    if (this.formData.gender) count++;
    if (this.formData.birthDate) count++;
    if (this.formData.birthPlace) count++;
    if (this.formData.civilStatus) count++;
    if (this.formData.nationality) count++;
    if (this.formData.religion) count++;
    if (this.formData.educationalAttainment) count++;
    
    // Contact & Work (2 required)
    if (this.formData.employmentStatus) count++;
    if (this.formData.contactNo) count++;
    
    // Address (3 required - auto-filled)
    if (this.formData.purokNo) count++;
    if (this.formData.houseNo) count++;
    if (this.formData.street) count++;
    if (this.formData.housingOwnership) count++;
    
    // Special Categories (6 required)
    if (this.formData.pwd) count++;
    if (this.formData.soloParent) count++;
    if (this.formData.seniorCitizen) count++;
    if (this.formData.indigent) count++;
    if (this.formData.fourPsMember) count++;
    if (this.formData.registeredVoter) count++;
    
    // Conditional ID fields
    if (this.formData.pwd === 'Yes' && this.formData.pwdIdNo) count++;
    else if (this.formData.pwd === 'No') count++;
    
    if (this.formData.soloParent === 'Yes' && this.formData.soloParentIdNo) count++;
    else if (this.formData.soloParent === 'No') count++;
    
    if (this.formData.seniorCitizen === 'Yes' && this.formData.seniorCitizenIdNo) count++;
    else if (this.formData.seniorCitizen === 'No') count++;
    
    return count;
  }

  getTotalRequiredFields(): number {
    // Base required fields: 26
    // + 3 conditional ID fields (if applicable)
    let total = 26;
    
    if (this.formData.pwd === 'Yes') total++;
    if (this.formData.soloParent === 'Yes') total++;
    if (this.formData.seniorCitizen === 'Yes') total++;
    
    return total;
  }

  isFormValid(): boolean {
    const required = [
      this.formData.firstName,
      this.formData.lastName,
      this.formData.middleName,
      this.formData.relationship,
      this.formData.gender,
      this.formData.birthDate,
      this.formData.birthPlace,
      this.formData.civilStatus,
      this.formData.nationality,
      this.formData.religion,
      this.formData.educationalAttainment,
      this.formData.employmentStatus,
      this.formData.contactNo,
      this.formData.purokNo,
      this.formData.houseNo,
      this.formData.street,
      this.formData.housingOwnership,
      this.formData.pwd,
      this.formData.soloParent,
      this.formData.seniorCitizen,
      this.formData.indigent,
      this.formData.fourPsMember,
      this.formData.registeredVoter
    ];

    const baseValid = required.every(field => field !== undefined && field !== '');

    // Check conditional ID fields
    const pwdIdValid = this.formData.pwd !== 'Yes' || !!this.formData.pwdIdNo;
    const soloParentIdValid = this.formData.soloParent !== 'Yes' || !!this.formData.soloParentIdNo;
    const seniorCitizenIdValid = this.formData.seniorCitizen !== 'Yes' || !!this.formData.seniorCitizenIdNo;

    return baseValid && pwdIdValid && soloParentIdValid && seniorCitizenIdValid;
  }

  getFormData(): AddHouseholdMemberRequest {
    return this.formData as AddHouseholdMemberRequest;
  }

  enableErrorDisplay() {
    this.showErrors = true;
  }
}
