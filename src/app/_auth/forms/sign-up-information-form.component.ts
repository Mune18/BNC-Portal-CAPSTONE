import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResidentInfoPreviewModalComponent } from './resident-info-preview-modal.component';
import { ResidentInfo } from '../../shared/types/resident';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { Client, Storage, ID } from 'appwrite';
import { environment } from '../../environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up-information-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ResidentInfoPreviewModalComponent],
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

      <!-- Blue circular design with logo on left - Hidden on mobile -->
      <div class="hidden lg:block absolute left-0 top-0 w-1/2 h-screen z-0">
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
      
      <!-- New Light blue circle in top left corner - Hidden on mobile -->
      <div class="hidden lg:block absolute left-[-15vh] top-[-15vh] w-230 h-230 z-0">
        <div class="relative left-[-2vh] top-[-2vh] w-full h-full rounded-full bg-blue-300 opacity-25"></div>
        <div class="absolute left-1 top-1 w-215 h-215 transform -translate-x-1 -translate-y-1 bg-blue-800 rounded-full z-10"></div>
        <div class="absolute left-1/2 top-1/2 w-115 h-115 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-100">
          <img src="/assets/BNC_Portal_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>
      
      <!-- City seal in top right corner - Hidden on mobile -->
      <div class="hidden lg:block absolute top-2 right-2 z-20">
        <div class="w-25 h-25">
          <img src="/assets/Olongapo_City_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>

      <!-- Mobile logo at top center - Only visible on mobile -->
      <div class="lg:hidden absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div class="flex flex-col items-center">
          <div class="w-32 h-32 sm:w-36 sm:h-36 mb-2">
            <img src="/assets/BNC_Portal_Logo.png" alt="Barangay New Cabalan Logo" class="w-full h-full">
          </div>
          <h1 class="text-center text-xl font-bold text-gray-800">BNC Portal</h1>
          <p class="text-center text-xs text-gray-600">Barangay New Cabalan System</p>
        </div>
      </div>

      <!-- Form content (blurred only when modal is open) -->
      <div [class.blur-md]="showPreviewModal || showTermsModal" class="flex flex-col items-center justify-center min-h-screen relative z-40 px-2 sm:px-4 lg:ml-auto lg:mr-8 lg:px-0 transition-all duration-300 w-full lg:w-3/5 pt-16 pb-8 lg:py-4">
        <form
          [ngClass]="{
            'w-full max-w-md': currentStep === 1,
            'w-full max-w-7xl': currentStep === 2,
            'w-full max-w-2xl': currentStep === 3
          }"
          class="bg-white/95 backdrop-blur-lg p-3 sm:p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-300 overflow-y-auto"
          [ngClass]="{
            'h-auto max-h-[90vh]': currentStep === 1,
            'min-h-[85vh] max-h-[95vh]': currentStep === 2,
            'h-auto max-h-[85vh]': currentStep === 3
          }"
          (ngSubmit)="onNextOrShowPreview()"
        >
          <!-- Enhanced Stepper Navigation -->
          <div class="flex justify-center mb-4 sm:mb-6">
            <div class="flex items-center space-x-2 sm:space-x-4 bg-gray-100 rounded-full px-4 py-2">
              <!-- Step 1 - Account -->
              <div class="flex items-center">
                <div [ngClass]="{
                  'bg-green-500 shadow-green-200': currentStep > 1,
                  'bg-blue-600 shadow-blue-200': currentStep === 1,
                  'bg-gray-400': currentStep < 1
                }" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg">
                  <svg *ngIf="currentStep > 1" class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="currentStep <= 1" class="text-sm sm:text-base">1</span>
                </div>
                <span class="hidden sm:block ml-2 text-xs font-medium text-gray-600">Account</span>
              </div>
              
              <!-- Connector line -->
              <div [ngClass]="{
                'bg-green-500': currentStep > 1,
                'bg-gray-300': currentStep <= 1
              }" class="w-6 sm:w-8 h-1 rounded-full transition-colors duration-300"></div>
              
              <!-- Step 2 - Personal -->
              <div class="flex items-center">
                <div [ngClass]="{
                  'bg-green-500 shadow-green-200': currentStep > 2,
                  'bg-blue-600 shadow-blue-200': currentStep === 2,
                  'bg-gray-400': currentStep < 2
                }" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg">
                  <svg *ngIf="currentStep > 2" class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="currentStep <= 2" class="text-sm sm:text-base">2</span>
                </div>
                <span class="hidden sm:block ml-2 text-xs font-medium text-gray-600">Personal</span>
              </div>
              
              <!-- Connector line -->
              <div [ngClass]="{
                'bg-green-500': currentStep > 2,
                'bg-gray-300': currentStep <= 2
              }" class="w-6 sm:w-8 h-1 rounded-full transition-colors duration-300"></div>
              
              <!-- Step 3 - Emergency -->
              <div class="flex items-center">
                <div [ngClass]="{
                  'bg-green-500 shadow-green-200': currentStep > 3,
                  'bg-blue-600 shadow-blue-200': currentStep === 3,
                  'bg-gray-400': currentStep < 3
                }" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg">
                  <svg *ngIf="currentStep > 3" class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="currentStep <= 3" class="text-sm sm:text-base">3</span>
                </div>
                <span class="hidden sm:block ml-2 text-xs font-medium text-gray-600">Emergency</span>
              </div>
            </div>
          </div>

          <!-- Section 1: Account Info -->
          <div *ngIf="currentStep === 1" class="flex flex-col justify-center">
            <div class="text-center mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Account Setup</h2>
              <p class="text-sm text-gray-600">Create your account credentials to access the BNC Portal</p>
            </div>
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                {{ errorMessage }}
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="username">
                  Username <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="username" 
                    [(ngModel)]="formData.account.username" 
                    name="username" 
                    placeholder="Choose a unique username"
                    [class.border-red-300]="hasFieldError('username')"
                    [class.border-green-300]="!hasFieldError('username') && formData.account.username && isValidUsername(formData.account.username)"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    required
                    minlength="4"
                    maxlength="20"
                    autocomplete="username"
                  />
                  <div class="absolute right-3 top-3">
                    <svg *ngIf="!hasFieldError('username') && formData.account.username && isValidUsername(formData.account.username)" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <svg *ngIf="hasFieldError('username')" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div *ngIf="hasFieldError('username')" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  {{ getFieldError('username') }}
                </div>
                <!-- Real-time username validation -->
                <div *ngIf="formData.account.username && !isValidUsername(formData.account.username)" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <span *ngIf="getInvalidUsernameCharacters(formData.account.username).length > 0">
                    Invalid characters: {{ getInvalidUsernameCharacters(formData.account.username).join(', ') }}. Only letters, numbers, underscores (_), and dots (.) allowed.
                  </span>
                  <span *ngIf="getInvalidUsernameCharacters(formData.account.username).length === 0">
                    Username must be 4-20 characters
                  </span>
                </div>
                <div *ngIf="formData.account.username && isValidUsername(formData.account.username)" class="text-green-600 text-xs mt-1">
                  ✓ Valid username
                </div>
              </div>
              
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    id="password" 
                    [(ngModel)]="formData.account.password" 
                    name="password" 
                    placeholder="Create a strong password"
                    [class.border-red-300]="hasFieldError('password')"
                    [class.border-green-300]="!hasFieldError('password') && getPasswordStrength() >= 3"
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    (input)="onFieldInput('password', formData.account.password)"
                    required
                    minlength="8"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    (click)="togglePasswordVisibility()"
                  >
                    <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  </button>
                </div>
                
                <!-- Password Strength Indicator -->
                <div *ngIf="formData.account.password" class="mt-2">
                  <div class="flex space-x-1">
                    <div *ngFor="let level of [1,2,3,4,5]" 
                         class="h-1 flex-1 rounded-full transition-all duration-300"
                         [class.bg-red-500]="level <= getPasswordStrength() && getPasswordStrength() < 3"
                         [class.bg-yellow-500]="level <= getPasswordStrength() && getPasswordStrength() === 3"
                         [class.bg-green-500]="level <= getPasswordStrength() && getPasswordStrength() >= 4"
                         [class.bg-gray-200]="level > getPasswordStrength()">
                    </div>
                  </div>
                  <p class="text-xs mt-1 transition-colors duration-300"
                     [class.text-red-600]="getPasswordStrength() < 3"
                     [class.text-yellow-600]="getPasswordStrength() === 3"
                     [class.text-green-600]="getPasswordStrength() >= 4">
                    {{ getPasswordStrengthText() }}
                  </p>
                </div>
                
                <!-- Real-time password validation -->
                <div *ngIf="formData.account.password && formData.account.password.length < 8" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  Password must be at least 8 characters long (currently {{ formData.account.password.length }})
                </div>
                <div *ngIf="formData.account.password && formData.account.password.length >= 8 && getPasswordStrength() < 3" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  Password is too weak. Add uppercase, lowercase, numbers, or special characters.
                </div>
                <div *ngIf="formData.account.password && formData.account.password.length >= 8 && getPasswordStrength() >= 3" class="text-green-600 text-xs mt-1">
                  ✓ Password meets requirements
                </div>
                
                <!-- Form validation errors (on submit) -->
                <div *ngIf="hasFieldError('password')" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  {{ getFieldError('password') }}
                </div>
              </div>
              
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="confirmPassword">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    [(ngModel)]="formData.account.confirmPassword" 
                    name="confirmPassword" 
                    placeholder="Re-enter your password"
                    [class.border-red-300]="hasFieldError('confirmPassword') || passwordMismatch()"
                    [class.border-green-300]="!hasFieldError('confirmPassword') && !passwordMismatch() && formData.account.confirmPassword"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    required
                    autocomplete="new-password"
                  />
                  <div class="absolute right-3 top-3">
                    <svg *ngIf="!passwordMismatch() && formData.account.confirmPassword && !hasFieldError('confirmPassword')" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div *ngIf="passwordMismatch()" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  Passwords do not match
                </div>
                <div *ngIf="!passwordMismatch() && formData.account.confirmPassword && !hasFieldError('confirmPassword')" class="text-green-600 text-xs mt-1">
                  ✓ Passwords match
                </div>
                <div *ngIf="hasFieldError('confirmPassword')" class="text-red-500 text-xs mt-1 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  {{ getFieldError('confirmPassword') }}
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-start">
                  <input 
                    type="checkbox" 
                    id="acceptTerms" 
                    [(ngModel)]="acceptedTerms"
                    name="acceptTerms"
                    [class.border-red-300]="hasFieldError('acceptedTerms')"
                    class="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label for="acceptTerms" class="text-sm text-gray-700 leading-tight flex-1">
                    I am 18+ and agree to the 
                    <button 
                      type="button"
                      (click)="showTermsModal = true"
                      class="text-blue-600 hover:text-blue-800 underline font-semibold"
                    >
                      Terms
                    </button>
                    and 
                    <button 
                      type="button"
                      (click)="showTermsModal = true"
                      class="text-blue-600 hover:text-blue-800 underline font-semibold"
                    >
                      Privacy Policy
                    </button>
                    <span class="text-red-500 ml-1">*</span>
                  </label>
                </div>
                <div *ngIf="hasFieldError('acceptedTerms')" class="text-red-500 text-xs mt-2 ml-7 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  {{ getFieldError('acceptedTerms') }}
                </div>
              </div>
            </div>
            
            <div class="flex justify-center pt-6">
              <button 
                type="button" 
                (click)="nextStep()"
                [disabled]="isLoading || !canProceedToStep2()"
                class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              >
                <span *ngIf="!isLoading" class="flex items-center">
                  Continue to Personal Information
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              </button>
            </div>
            
            <!-- Login Link -->
            <div class="text-center mt-4">
              <p class="text-sm text-gray-600">
                Already have an account? 
                <a href="/sign-in" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200">
                  Log in
                </a>
              </p>
            </div>
          </div>

          <!-- Section 2: Personal Info (personal details only) -->
          <div *ngIf="currentStep === 2" class="flex-1 overflow-y-auto">
            <div class="text-center mb-4 sm:mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
              <p class="text-sm text-gray-600">Please provide your complete personal details</p>
            </div>
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                {{ errorMessage }}
              </div>
            </div>
            
            <!-- Mobile-First Layout -->
            <div class="space-y-6">
              
              <!-- Profile Image Section -->
              <div class="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>
                <div class="relative group">
                  <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex items-center justify-center border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                    <img *ngIf="formData.profileImage" [src]="formData.profileImage" alt="Profile Image" class="object-cover w-full h-full" />
                    <svg *ngIf="!formData.profileImage" class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <label class="absolute -bottom-2 -right-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <input type="file" accept="image/*" (change)="onProfileImageChange($event)" hidden>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-2 text-center">Click the + button to upload your photo</p>
              </div>

              <!-- Basic Information -->
              <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                  Basic Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Last Name <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.lastName" 
                      name="lastName" 
                      placeholder="Enter last name"
                      [class.border-red-300]="hasFieldError('lastName')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('lastName', formData.personalInfo.lastName)"
                      required
                      autocomplete="family-name"
                    >
                    <div *ngIf="hasFieldError('lastName')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('lastName') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      First Name <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.firstName" 
                      name="firstName" 
                      placeholder="Enter first name"
                      [class.border-red-300]="hasFieldError('firstName')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('firstName', formData.personalInfo.firstName)"
                      required
                      autocomplete="given-name"
                    >
                    <div *ngIf="hasFieldError('firstName')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('firstName') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Middle Name <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.middleName" 
                      name="middleName" 
                      placeholder="Enter middle name"
                      [class.border-red-300]="hasFieldError('middleName')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('middleName', formData.personalInfo.middleName)"
                      autocomplete="additional-name"
                    >
                    <div *ngIf="hasFieldError('middleName')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('middleName') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">Suffix</label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.suffix" 
                      name="suffix" 
                      placeholder="Jr., Sr., III (optional)"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                  </div>
                </div>
              </div>

              <!-- Personal Details -->
              <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Personal Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Gender <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.gender" 
                      name="gender" 
                      [class.border-red-300]="hasFieldError('gender')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('gender', formData.personalInfo.gender)"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <div *ngIf="hasFieldError('gender')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('gender') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Birth Date <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      [(ngModel)]="formData.personalInfo.birthDate" 
                      name="birthDate" 
                      [class.border-red-300]="hasFieldError('birthDate')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('birthDate', formData.personalInfo.birthDate)"
                      [max]="maxDate"
                      required
                    >
                    <div *ngIf="hasFieldError('birthDate')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('birthDate') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Birth Place <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.birthPlace" 
                      name="birthPlace" 
                      placeholder="Enter birth place"
                      [class.border-red-300]="hasFieldError('birthPlace')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('birthPlace', formData.personalInfo.birthPlace)"
                    >
                    <div *ngIf="hasFieldError('birthPlace')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('birthPlace') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Civil Status <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.civilStatus" 
                      name="civilStatus" 
                      [class.border-red-300]="hasFieldError('civilStatus')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('civilStatus', formData.personalInfo.civilStatus)"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                    <div *ngIf="hasFieldError('civilStatus')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('civilStatus') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Nationality <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <select 
                        *ngIf="formData.personalInfo.nationalityType !== 'Others'"
                        [(ngModel)]="formData.personalInfo.nationalityType" 
                        name="nationalityType" 
                        (ngModelChange)="onNationalityTypeChange()"
                        [class.border-red-300]="hasFieldError('nationality')"
                        class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      >
                        <option value="Filipino">Filipino</option>
                        <option value="Others">Others</option>
                      </select>
                      <div *ngIf="formData.personalInfo.nationalityType === 'Others'" class="relative">
                        <input 
                          type="text" 
                          [(ngModel)]="formData.personalInfo.nationality" 
                          name="nationality" 
                          placeholder="Enter nationality"
                          [class.border-red-300]="hasFieldError('nationality')"
                          class="w-full px-3 py-3 pr-16 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        >
                        <button 
                          type="button"
                          (click)="resetNationalitySelection()"
                          class="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors bg-white rounded border"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    <div *ngIf="hasFieldError('nationality')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('nationality') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Religion <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-3">
                      <!-- Religion Dropdown -->
                      <div class="relative">
                        <select
                          [(ngModel)]="formData.personalInfo.religion" 
                          name="religion" 
                          [class.border-red-300]="hasFieldError('religion')"
                          class="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                          (change)="onReligionChange($event)"
                        >
                          <option value="" disabled>Select your religion</option>
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
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <!-- Custom Religion Input (shown when Others is selected) -->
                      <div *ngIf="religionType === 'others'" class="mt-3">
                        <input 
                          type="text" 
                          [(ngModel)]="formData.personalInfo.religion" 
                          name="customReligion" 
                          placeholder="Please specify your religion"
                          [class.border-red-300]="hasFieldError('religion')"
                          class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          (input)="onFieldInput('religion', formData.personalInfo.religion)"
                        >
                      </div>
                    </div>
                    <div *ngIf="hasFieldError('religion')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('religion') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Educational Attainment <span class="text-red-500">*</span>
                    </label>
                    <select
                      [(ngModel)]="formData.personalInfo.educationalAttainment"
                      name="educationalAttainment"
                      [class.border-red-300]="hasFieldError('educationalAttainment')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      (change)="onFieldChange('educationalAttainment', formData.personalInfo.educationalAttainment)"
                    >
                      <option value="">Select Educational Attainment</option>
                      <option value="Elementary Graduate">Elementary Graduate</option>
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Vocational">Vocational</option>
                    </select>
                    <div *ngIf="hasFieldError('educationalAttainment')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('educationalAttainment') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact & Work Information -->
              <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Contact & Work
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Employment Status <span class="text-red-500">*</span>
                    </label>
                    <select
                      [(ngModel)]="formData.personalInfo.employmentStatus"
                      name="employmentStatus"
                      [class.border-red-300]="hasFieldError('employmentStatus')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      (change)="onFieldChange('employmentStatus', formData.personalInfo.employmentStatus)"
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
                    <div *ngIf="hasFieldError('employmentStatus')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('employmentStatus') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Occupation 
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.occupation" 
                      name="occupation" 
                      placeholder="Enter your occupation"
                      [class.border-red-300]="hasFieldError('occupation')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('occupation', formData.personalInfo.occupation)"
                      autocomplete="organization-title"
                    >
                    <div *ngIf="hasFieldError('occupation')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('occupation') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Monthly Income 
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 text-sm">₱</span>
                      </div>
                      <input 
                        type="number" 
                        [(ngModel)]="formData.personalInfo.monthlyIncome" 
                        name="monthlyIncome" 
                        placeholder="0.00 (optional for unemployed/students)"
                        min="0"
                        step="0.01"
                        [class.border-red-300]="hasFieldError('monthlyIncome')"
                        class="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        (input)="onFieldInput('monthlyIncome', formData.personalInfo.monthlyIncome)"
                      >
                    </div>
                    <div *ngIf="hasFieldError('monthlyIncome')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('monthlyIncome') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Contact Number <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 text-sm">+63</span>
                      </div>
                      <input 
                        type="tel" 
                        [(ngModel)]="formData.personalInfo.contactNo" 
                        name="contactNo" 
                        placeholder="9XXXXXXXXX"
                        maxlength="10"
                        [class.border-red-300]="hasFieldError('contactNo')"
                        class="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        (input)="onPhoneInput($event, 'contactNo')"
                        (keypress)="onPhoneKeypress($event)"
                        autocomplete="tel"
                      >
                    </div>
                    <div *ngIf="hasFieldError('contactNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('contactNo') }}
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without +63</p>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Email Address <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input 
                        type="email" 
                        [(ngModel)]="formData.personalInfo.email" 
                        name="email" 
                        placeholder="Enter your email address"
                        [class.border-red-300]="hasFieldError('email')"
                        (input)="onFieldInput('email', formData.personalInfo.email)"
                        [class.border-green-300]="!hasFieldError('email') && formData.personalInfo.email && isValidEmail(formData.personalInfo.email)"
                        class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        required
                        autocomplete="email"
                      />
                      <div class="absolute right-3 top-3">
                        <svg *ngIf="!hasFieldError('email') && formData.personalInfo.email && isValidEmail(formData.personalInfo.email)" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        <svg *ngIf="hasFieldError('email')" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <div *ngIf="hasFieldError('email')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('email') }}
                    </div>
                    <div *ngIf="!hasFieldError('email') && formData.personalInfo.email && isValidEmail(formData.personalInfo.email)" class="text-green-600 text-xs mt-1">
                      ✓ Valid email address
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address & Housing Information -->
              <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Address & Housing Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Purok Number <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <select
                        [(ngModel)]="formData.personalInfo.purokNo" 
                        name="purokNo" 
                        [class.border-red-300]="hasFieldError('purokNo')"
                        class="w-full px-3 py-3 pr-10 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                        (change)="onFieldInput('purokNo', formData.personalInfo.purokNo)"
                      >
                        <option value="" disabled>Select purok number</option>
                        <option value="1">Purok 1</option>
                        <option value="2">Purok 2</option>
                        <option value="3">Purok 3</option>
                        <option value="4">Purok 4</option>
                        <option value="5">Purok 5</option>
                        <option value="6">Purok 6</option>
                        <option value="7">Purok 7</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <div *ngIf="hasFieldError('purokNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('purokNo') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      House Number <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.houseNo" 
                      name="houseNo" 
                      placeholder="Enter house number"
                      [class.border-red-300]="hasFieldError('houseNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('houseNo', formData.personalInfo.houseNo)"
                    >
                    <div *ngIf="hasFieldError('houseNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('houseNo') }}
                    </div>
                  </div>
                  
                  <div class="sm:col-span-2 lg:col-span-1">
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Street <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.street" 
                      name="street" 
                      placeholder="Enter street name"
                      [class.border-red-300]="hasFieldError('street')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (input)="onFieldInput('street', formData.personalInfo.street)"
                    >
                    <div *ngIf="hasFieldError('street')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('street') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Housing Ownership <span class="text-red-500">*</span>
                    </label>
                    <select
                      [(ngModel)]="formData.personalInfo.housingOwnership"
                      name="housingOwnership"
                      [class.border-red-300]="hasFieldError('housingOwnership')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      (change)="onFieldChange('housingOwnership', formData.personalInfo.housingOwnership)"
                    >
                      <option value="">Select Housing Ownership</option>
                      <option value="Owned">Owned</option>
                      <option value="Rented">Rented</option>
                      <option value="LivingwithRelatives">Living with Relatives</option>
                      <option value="GovernmentHousing">Government Housing</option>
                      <option value="InformalSettler">Informal Settler</option>
                    </select>
                    <div *ngIf="hasFieldError('housingOwnership')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('housingOwnership') }}
                    </div>
                  </div>

                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Years in Barangay <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      [(ngModel)]="formData.personalInfo.yearsInBarangay"
                      name="yearsInBarangay"
                      min="0"
                      placeholder="Number of years"
                      [class.border-red-300]="hasFieldError('yearsInBarangay')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      (input)="onFieldInput('yearsInBarangay', formData.personalInfo.yearsInBarangay)"
                    />
                    <div *ngIf="hasFieldError('yearsInBarangay')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('yearsInBarangay') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Special Categories -->
              <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9h12v5H4V9z" clip-rule="evenodd"></path>
                  </svg>
                  Special Categories & Benefits
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      PWD Status <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.pwd" 
                      name="pwd" 
                      (ngModelChange)="onPwdChange()"
                      [class.border-red-300]="hasFieldError('pwd')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('pwd')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('pwd') }}
                    </div>
                  </div>
                  
                  <div *ngIf="formData.personalInfo.pwd === 'Yes'">
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      PWD ID Number <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.pwdIdNo" 
                      name="pwdIdNo" 
                      placeholder="Enter PWD ID Number"
                      [class.border-red-300]="hasFieldError('pwdIdNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                    <div *ngIf="hasFieldError('pwdIdNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('pwdIdNo') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Solo Parent Status <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.soloParent" 
                      name="soloParent" 
                      (ngModelChange)="onSoloParentChange()"
                      [class.border-red-300]="hasFieldError('soloParent')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('soloParent')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('soloParent') }}
                    </div>
                  </div>
                  
                  <div *ngIf="formData.personalInfo.soloParent === 'Yes'">
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Solo Parent ID Number <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.soloParentIdNo" 
                      name="soloParentIdNo" 
                      placeholder="Enter Solo Parent ID Number"
                      [class.border-red-300]="hasFieldError('soloParentIdNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                    <div *ngIf="hasFieldError('soloParentIdNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('soloParentIdNo') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Senior Citizen Status <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.seniorCitizen" 
                      name="seniorCitizen" 
                      (ngModelChange)="onSeniorCitizenChange()"
                      [class.border-red-300]="hasFieldError('seniorCitizen')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('seniorCitizen')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('seniorCitizen') }}
                    </div>
                  </div>
                  
                  <div *ngIf="formData.personalInfo.seniorCitizen === 'Yes'">
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Senior Citizen ID Number <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.personalInfo.seniorCitizenIdNo" 
                      name="seniorCitizenIdNo" 
                      placeholder="Enter Senior Citizen ID Number"
                      [class.border-red-300]="hasFieldError('seniorCitizenIdNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    >
                    <div *ngIf="hasFieldError('seniorCitizenIdNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('seniorCitizenIdNo') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Indigent Status <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.indigent" 
                      name="indigent" 
                      [class.border-red-300]="hasFieldError('indigent')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('indigent', formData.personalInfo.indigent)"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('indigent')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('indigent') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      4Ps Member <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.fourPsMember" 
                      name="fourPsMember" 
                      [class.border-red-300]="hasFieldError('fourPsMember')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('fourPsMember', formData.personalInfo.fourPsMember)"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('fourPsMember')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('fourPsMember') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">
                      Registered Voter <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="formData.personalInfo.registeredVoter" 
                      name="registeredVoter" 
                      [class.border-red-300]="hasFieldError('registeredVoter')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      (change)="onFieldChange('registeredVoter', formData.personalInfo.registeredVoter)"
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div *ngIf="hasFieldError('registeredVoter')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('registeredVoter') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Required Government IDs -->
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Government IDs
                </h3>
                <p class="text-sm text-gray-600 mb-4">Please provide at least one valid government ID for verification</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">National ID Number</label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.otherDetails.nationalIdNo" 
                      name="nationalIdNo" 
                      placeholder="Enter National ID Number"
                      [class.border-red-300]="hasFieldError('nationalIdNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      (input)="onFieldInput('nationalIdNo', formData.otherDetails.nationalIdNo)"
                    >
                    <div *ngIf="hasFieldError('nationalIdNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('nationalIdNo') }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-semibold mb-2">Voter's ID Number</label>
                    <input 
                      type="text" 
                      [(ngModel)]="formData.otherDetails.votersIdNo" 
                      name="votersIdNo" 
                      placeholder="Enter Voter's ID Number"
                      [class.border-red-300]="hasFieldError('votersIdNo')"
                      class="w-full px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      (input)="onFieldInput('votersIdNo', formData.otherDetails.votersIdNo)"
                    >
                    <div *ngIf="hasFieldError('votersIdNo')" class="text-red-500 text-xs mt-1 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      {{ getFieldError('votersIdNo') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Navigation Buttons -->
            <div class="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button 
                type="button" 
                (click)="prevStep()"
                [disabled]="isLoading"
                class="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 order-2 sm:order-1 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Account
              </button>
              
              <button 
                type="button"
                (click)="nextStep()"
                [disabled]="isLoading"
                class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 order-1 sm:order-2 flex items-center justify-center"
              >
                Continue to Emergency Contact
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Section 3: Emergency Contact -->
          <div *ngIf="currentStep === 3" class="flex-1 flex flex-col">
            <div class="text-center mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Emergency Contact</h2>
              <p class="text-sm text-gray-600">Provide details of someone we can contact in case of emergency</p>
            </div>
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                {{ errorMessage }}
              </div>
            </div>
            
            <div class="flex-1 flex flex-col justify-center">
              <div class="max-w-2xl mx-auto w-full">
                
                <!-- Emergency Contact Card -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Emergency Contact Information
                  </h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Full Name <span class="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        [(ngModel)]="formData.emergencyContact.fullName" 
                        name="emergencyFullName"
                        placeholder="Enter full name of emergency contact"
                        [class.border-red-300]="hasFieldError('ecFullName')"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        (input)="onFieldInput('ecFullName', formData.emergencyContact.fullName)"
                        required
                      >
                      <div *ngIf="hasFieldError('ecFullName')" class="text-red-500 text-xs mt-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        {{ getFieldError('ecFullName') }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Relationship <span class="text-red-500">*</span>
                      </label>
                      <select 
                        [(ngModel)]="formData.emergencyContact.relationship" 
                        name="emergencyRelationship"
                        [class.border-red-300]="hasFieldError('ecRelationship')"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                        (change)="onFieldChange('ecRelationship', formData.emergencyContact.relationship)"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Relative">Other Relative</option>
                        <option value="Friend">Friend</option>
                        <option value="Neighbor">Neighbor</option>
                        <option value="Other">Other</option>
                      </select>
                      <div *ngIf="hasFieldError('ecRelationship')" class="text-red-500 text-xs mt-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        {{ getFieldError('ecRelationship') }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Contact Number <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 text-sm">+63</span>
                        </div>
                        <input 
                          type="tel" 
                          [(ngModel)]="formData.emergencyContact.contactNo" 
                          name="emergencyContactNo"
                          placeholder="9XXXXXXXXX"
                          maxlength="10"
                          [class.border-red-300]="hasFieldError('ecContactNo')"
                          class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                          (input)="onPhoneInput($event, 'ecContactNo'); onFieldInput('ecContactNo', formData.emergencyContact.contactNo)"
                          (keypress)="onPhoneKeypress($event)"
                          autocomplete="tel"
                        >
                      </div>
                      <div *ngIf="hasFieldError('ecContactNo')" class="text-red-500 text-xs mt-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        {{ getFieldError('ecContactNo') }}
                      </div>
                      <p class="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without +63</p>
                    </div>
                    
                    <div>
                      <label class="block text-gray-700 text-sm font-semibold mb-2">
                        Address <span class="text-red-500">*</span>
                      </label>
                      <textarea 
                        [(ngModel)]="formData.emergencyContact.address" 
                        name="emergencyAddress"
                        placeholder="Enter complete address of emergency contact"
                        rows="3"
                        [class.border-red-300]="hasFieldError('ecAddress')"
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
                        (input)="onFieldInput('ecAddress', formData.emergencyContact.address)"
                      ></textarea>
                      <div *ngIf="hasFieldError('ecAddress')" class="text-red-500 text-xs mt-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        {{ getFieldError('ecAddress') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Navigation Buttons -->
            <div class="flex flex-col sm:flex-row justify-between gap-3 mt-8">
              <button 
                type="button" 
                (click)="prevStep()"
                [disabled]="isLoading"
                class="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 order-2 sm:order-1 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Personal Info
              </button>
              
              <button 
                type="submit"
                [disabled]="isLoading"
                class="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-green-500 order-1 sm:order-2 flex items-center justify-center"
              >
                <span *ngIf="!isLoading" class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Review & Submit Registration
                </span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Registration...
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal (NOT blurred, always above) -->
      <app-resident-info-preview-modal
        [show]="showPreviewModal && !isLoading"
        [residentInfo]="formData"
        (close)="showPreviewModal = false; errorMessage = ''"
        (confirm)="onSubmit()"
      ></app-resident-info-preview-modal>

      <!-- Loading Modal -->
      <div *ngIf="isLoading" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div class="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xs w-full">
          <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 class="text-xl font-bold mb-2 text-center">{{ loadingStatus }}</h2>
          <p class="text-center text-gray-600">Please wait while we process your registration...</p>
        </div>
      </div>

      <!-- Error Modal -->
      <div *ngIf="errorMessage && !isLoading && showPreviewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full mx-4">
          <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-bold mb-2 text-center text-red-600">Registration Error</h2>
          <p class="text-center text-gray-600 mb-6">{{ errorMessage }}</p>
          <button 
            (click)="errorMessage = ''" 
            class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Registration Success Modal -->
      <div *ngIf="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/30">
        <div class="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-lg w-full mx-4">
          <svg class="w-20 h-20 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold mb-3 text-center text-gray-800">Registration Submitted!</h2>
          
          <!-- Pending Approval Notice -->
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded w-full">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700 font-semibold">Pending Admin Approval</p>
              </div>
            </div>
          </div>
          
          <!-- Main Message -->
          <p class="mb-4 text-center text-gray-600 text-sm leading-relaxed">
            Your registration has been submitted successfully! Please wait for the Barangay Admin to review and approve your account before you can log in.
          </p>
          
          <!-- Email Notification Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 w-full">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-semibold text-blue-800 mb-1">Email Notification</h4>
                <p class="text-xs text-blue-700 leading-relaxed">
                  You will receive an email notification at <strong>{{ formData.personalInfo.email }}</strong> when your registration is approved or if additional information is needed.
                </p>
              </div>
            </div>
          </div>
          
          <!-- What's Next -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 w-full">
            <h4 class="text-sm font-semibold text-gray-800 mb-2">What happens next:</h4>
            <ul class="text-xs text-gray-600 space-y-1">
              <li class="flex items-center">
                <span class="text-blue-500 mr-2">1.</span>
                Admin reviews your application (1-3 business days)
              </li>
              <li class="flex items-center">
                <span class="text-blue-500 mr-2">2.</span>
                You'll receive an email with the approval decision
              </li>
              <li class="flex items-center">
                <span class="text-blue-500 mr-2">3.</span>
                If approved, you can login and access all services
              </li>
            </ul>
          </div>
          
          <!-- Contact Info -->
          <p class="mb-6 text-center text-gray-500 text-xs">
            Questions? Contact Barangay New Cabalan office at <strong>(047) 224-2176</strong><br>
            Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
          </p>
          
          <button (click)="onSuccessOk()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium w-full">
            Understood
          </button>
        </div>
      </div>

      <!-- Terms and Conditions Modal -->
      <div *ngIf="showTermsModal" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-6 border-b">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Terms and Conditions & Privacy Policy</h2>
              <p class="text-sm text-red-600 font-medium mt-1">⚠️ Registration restricted to residents 18 years and older</p>
            </div>
            <button 
              (click)="showTermsModal = false"
              class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto flex-1">
            <div class="space-y-6">
              <!-- Terms and Conditions Section -->
              <section>
                <h3 class="text-xl font-semibold text-blue-800 mb-4">Terms and Conditions</h3>
                
                <div class="space-y-4 text-gray-700">
                  <div>
                    <h4 class="font-semibold mb-2">1. Acceptance and Eligibility</h4>
                    <p>By registering for the Barangay New Cabalan Digital Portal, you acknowledge that you are at least 18 years old and are a legal resident of Barangay New Cabalan, Olongapo City. You agree to be bound by these terms, applicable local ordinances, and Philippine laws.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">2. Purpose and Scope of Service</h4>
                    <p>This portal provides digital access to barangay services including: complaint filing, announcement viewing, profile management, and official communications. Services are available to verified residents only.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">3. Registration and Data Accuracy</h4>
                    <p>You must provide complete, accurate, and truthful information during registration. All personal data must match official government records. Falsification of information may result in criminal charges under Philippine law and permanent ban from barangay services.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">4. Account Security and Responsibility</h4>
                    <p>You are solely responsible for maintaining the confidentiality of your login credentials. Any activity under your account is your responsibility. Immediately report suspected unauthorized access to the Barangay Office. Sharing accounts is strictly prohibited.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">5. Acceptable Use Policy</h4>
                    <p>Use this portal only for legitimate barangay business. Prohibited activities include: submitting false complaints, harassment of officials, system abuse, and any illegal activities. Violations may result in legal action.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">6. Service Availability and Modifications</h4>
                    <p>The Barangay reserves the right to modify, suspend, or discontinue services with reasonable notice. System maintenance may cause temporary unavailability. Alternative service channels remain available at the Barangay Office during system downtime.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">7. Compliance with Local Ordinances</h4>
                    <p>All users must comply with Barangay New Cabalan ordinances, Olongapo City regulations, and national laws.</p>
                  </div>
                </div>
              </section>
              
              <!-- Privacy Policy Section -->
              <section>
                <h3 class="text-xl font-semibold text-blue-800 mb-4">Privacy Policy</h3>
                
                <div class="space-y-4 text-gray-700">
                  <div>
                    <h4 class="font-semibold mb-2">1. Data Collection and Legal Basis</h4>
                    <p>We collect personal information under the authority of the Local Government Code (RA 7160) and Data Privacy Act (RA 10173). Information includes: full name, address, birth details, contact information, emergency contacts, civil status, occupation, income level, and special categories (PWD, Senior, 4Ps, etc.) necessary for proper barangay services and population data management.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">2. Purpose and Use of Information</h4>
                    <p>Your data enables us to: verify residency, maintain accurate population records, provide emergency services, distribute social services and benefits, send official announcements and alerts, process complaints and requests, generate community reports, and comply with national statistical and reporting requirements.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">3. Data Security and Protection</h4>
                    <p>We implement industry-standard security measures including encrypted data transmission, secure database storage, regular security audits, access controls for authorized personnel only, and backup systems for data integrity. Physical and digital safeguards protect against unauthorized access, theft, or disclosure.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">4. Information Sharing and Disclosure</h4>
                    <p>Your information may be shared only with: Olongapo City Government for city-wide programs, Department of Interior and Local Government (DILG) for reporting, Philippine Statistics Authority (PSA) for census purposes, other government agencies as required by law, and emergency responders during disasters or public health emergencies. We never sell or share data for commercial purposes.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">5. Data Retention and Disposal</h4>
                    <p>Records are retained per National Archives guidelines: active resident records for the duration of residency plus 5 years, complaint records for 5 years, and statistical data permanently (in anonymized form). Secure disposal protocols ensure complete data destruction when retention periods expire.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">6. Your Privacy Rights</h4>
                    <p>Under the Data Privacy Act, you have the right to: access your personal data, request corrections to inaccurate information, request data portability for compatible systems, object to processing (where legally permissible), and file complaints with the National Privacy Commission. Contact the Barangay Data Protection Officer for assistance with privacy concerns.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">7. Minors and Dependent Information</h4>
                    <p>Information about minors and dependents is collected only when necessary for family-based services or emergency contact purposes. Parents/guardians are responsible for the accuracy of dependent information and may update it through their accounts or by visiting the Barangay Office.</p>
                  </div>
                  
                  <div>
                    <h4 class="font-semibold mb-2">8. System Monitoring and Logs</h4>
                    <p>For security purposes, we log system access, and user activities. These logs are used solely for security monitoring, troubleshooting, and compliance auditing. Access logs are retained for 1 year and are accessible only to authorized IT and administrative personnel.</p>
                  </div>
                </div>
              </section>
              
              <!-- Contact Information -->
              <section>
                <h3 class="text-xl font-semibold text-blue-800 mb-4">Contact Information</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700">For questions about these terms, privacy concerns, or technical support:</p>
                  
                  <div class="mt-3 space-y-2">
                    <div>
                      <p class="font-semibold text-blue-800">Barangay New Cabalan Office</p>
                      <p class="text-gray-600 text-sm">Corner Mabini St., Purok 2, New Cabalan, Olongapo City, Zambales</p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <p class="font-medium text-gray-700">Office Hours:</p>
                        <p class="text-gray-600 text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
                        <p class="text-gray-600 text-sm">Saturday: 8:00 AM - 12:00 PM</p>
                      </div>
                      
                      <div>
                        <p class="font-medium text-gray-700">Emergency Contact:</p>
                        <p class="text-gray-600 text-sm">Barangay Hotline: 047-224-5414</p>
                        <p class="text-gray-600 text-sm">Text/Call: 0910 484 5635</p>
                      </div>
                    </div>
                    
                    <div class="border-t pt-3 mt-3">
                      <p class="text-xs text-gray-500"><strong>Data Protection Officer:</strong> Contact the Barangay Secretary for privacy-related concerns and data subject rights requests.</p>
                      <p class="text-xs text-gray-500 mt-1"><strong>Technical Support:</strong> Visit the office during business hours for portal assistance.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 p-6 border-t">
            <button 
              (click)="showTermsModal = false"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button 
              (click)="acceptTermsAndClose()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Accept Terms
            </button>
          </div>
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
    
    /* SweetAlert2 Custom Styles */
    :host ::ng-deep .swal2-container {
      backdrop-filter: blur(5px) !important;
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
    
    :host ::ng-deep .swal2-popup-custom {
      border-radius: 12px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      border: 1px solid rgba(229, 231, 235, 0.2) !important;
    }
    
    :host ::ng-deep .swal2-title {
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      color: #374151 !important;
    }
    
    :host ::ng-deep .swal2-html-container {
      margin: 1rem 0 !important;
    }
    
    :host ::ng-deep .swal2-confirm {
      border-radius: 8px !important;
      font-weight: 500 !important;
      padding: 0.5rem 1rem !important;
      transition: all 0.2s ease !important;
    }
    
    :host ::ng-deep .swal2-confirm:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    }
  `]
})
export class SignUpInformationFormComponent implements OnInit {
  currentStep = 1;
  showPreviewModal = false;
  showSuccessModal = false;
  showTermsModal = false;
  isLoading = false;
  loadingStatus = 'Creating Account';
  errorMessage = '';
  validationErrors: { [key: string]: string } = {};
  acceptedTerms = false;
  maxDate = '';
  currentYear = new Date().getFullYear();
  religionType: 'predefined' | 'others' = 'predefined';

  formData = {
    account: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    profileImage: '',
    personalInfo: {
      lastName: '',
      firstName: '',
      middleName: '',
      suffix: '',
      email: '',
      gender: '',
      birthDate: '',
      birthPlace: '',
      age: 0,
      civilStatus: '',
      nationality: 'Filipino',
      nationalityType: 'Filipino', // 'Filipino' or 'Others'
      religion: '',
      occupation: '',
      educationalAttainment: '',
      employmentStatus: '',
      housingOwnership: '',
      yearsInBarangay: null,
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
      status: 'Active',
      dateOfRegistration: ''
    }
  };

  // Initialize the Appwrite client and storage here
  private client = new Client()
    .setEndpoint(environment.appwriteUrl)
    .setProject(environment.appwriteProjectId);
    
  private storage = new Storage(this.client);

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Set max date to today to prevent future dates
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    
    // Initialize nationality field with default value
    if (this.formData.personalInfo.nationalityType === 'Filipino') {
      this.formData.personalInfo.nationality = 'Filipino';
    }
    
    // Check if there's step 1 data from previous navigation
    const step1Data = sessionStorage.getItem('signupStep1Data');
    if (step1Data) {
      const parsedData = JSON.parse(step1Data);
      this.formData.account.username = parsedData.username;
      this.formData.account.password = parsedData.password;
      this.formData.account.confirmPassword = parsedData.confirmPassword;
    }
  }

  // Add this method to handle profile image uploads
  async onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      console.log('Uploading image file...', file.name);
      
      // Create a unique ID for the file
      const fileId = ID.unique();
      
      // Upload the file to Appwrite storage
      const uploadedFile = await this.storage.createFile(
        environment.profileImagesBucketId,
        fileId,
        file
      );
      
      console.log('Image uploaded successfully, fileId:', uploadedFile.$id);
      
      // Generate the correct URL to the file
      const fileUrl = this.storage.getFileView(
        environment.profileImagesBucketId,
        uploadedFile.$id
      );
      
      console.log('Generated image URL:', fileUrl.href);
      
      // Save the complete URL to the formData
      this.formData.profileImage = fileUrl.href;
      
      console.log('Updated formData.profileImage:', this.formData.profileImage);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }

  nextStep() {
    if (this.currentStep === 1 && this.validateStep1()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.validatePersonalInfo()) {
      this.currentStep = 3;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Phone number input handlers
  onPhoneKeypress(event: KeyboardEvent) {
    // Allow only numeric characters, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    const isNumeric = /^[0-9]$/.test(event.key);
    
    if (!isNumeric && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onPhoneInput(event: any, fieldType: string) {
    let value = event.target.value;
    
    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Update the appropriate field
    if (fieldType === 'contactNo') {
      this.formData.personalInfo.contactNo = value;
      // Clear validation error when user starts typing
      if (value) {
        this.clearFieldError('contactNo');
      }
    } else if (fieldType === 'ecContactNo') {
      this.formData.emergencyContact.contactNo = value;
      // Clear validation error when user starts typing
      if (value) {
        this.clearFieldError('ecContactNo');
      }
    }
    
    // Update the input field value
    event.target.value = value;
  }

  // Validation methods
  validateStep1(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Username validation
    if (!this.formData.account.username) {
      this.validationErrors['username'] = 'Username is required';
      isValid = false;
    } else if (!this.isValidUsername(this.formData.account.username)) {
      const invalidChars = this.getInvalidUsernameCharacters(this.formData.account.username);
      if (invalidChars.length > 0) {
        this.validationErrors['username'] = `Invalid characters found: ${invalidChars.join(', ')}. Only letters, numbers, underscores (_), and dots (.) are allowed`;
      } else {
        this.validationErrors['username'] = 'Username must be 4-20 characters and contain only letters, numbers, underscores, and dots';
      }
      isValid = false;
    }

    // Password validation
    if (!this.formData.account.password) {
      this.validationErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.formData.account.password.length < 8) {
      this.validationErrors['password'] = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (this.getPasswordStrength() < 3) {
      this.validationErrors['password'] = 'Password is too weak. Please create a stronger password to proceed to the next step';
      isValid = false;
    }

    // Confirm password validation
    if (!this.formData.account.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Please confirm your password';
      isValid = false;
    } else if (this.formData.account.password !== this.formData.account.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Passwords do not match';
      isValid = false;
    }

    // Terms and conditions validation
    if (!this.acceptedTerms) {
      this.validationErrors['acceptedTerms'] = 'You must accept the terms and conditions to proceed';
      isValid = false;
    }

    return isValid;
  }

  validatePersonalInfo(): boolean {
    this.validationErrors = {};
    let isValid = true;

    const personalInfo = this.formData.personalInfo;

    // Required personal info fields
    if (!personalInfo.lastName || personalInfo.lastName.trim() === '') {
      this.validationErrors['lastName'] = 'Last name is required';
      isValid = false;
    }

    if (!personalInfo.firstName || personalInfo.firstName.trim() === '') {
      this.validationErrors['firstName'] = 'First name is required';
      isValid = false;
    }

    if (!personalInfo.middleName || personalInfo.middleName.trim() === '') {
      this.validationErrors['middleName'] = 'Middle name is required';
      isValid = false;
    }

    if (!personalInfo.gender || personalInfo.gender.trim() === '') {
      this.validationErrors['gender'] = 'Gender is required';
      isValid = false;
    }

    if (!personalInfo.birthDate || personalInfo.birthDate.trim() === '') {
      this.validationErrors['birthDate'] = 'Birth date is required';
      isValid = false;
    }

    if (!personalInfo.birthPlace || personalInfo.birthPlace.trim() === '') {
      this.validationErrors['birthPlace'] = 'Birth place is required';
      isValid = false;
    }

    if (!personalInfo.civilStatus || personalInfo.civilStatus.trim() === '') {
      this.validationErrors['civilStatus'] = 'Civil status is required';
      isValid = false;
    }

    // Validate nationality based on selection type
    if (personalInfo.nationalityType === 'Others') {
      if (!personalInfo.nationality || personalInfo.nationality.trim() === '') {
        this.validationErrors['nationality'] = 'Nationality is required when "Others" is selected';
        isValid = false;
      }
    } else if (personalInfo.nationalityType === 'Filipino') {
      // Ensure nationality is set to Filipino if that's selected
      personalInfo.nationality = 'Filipino';
    } else {
      this.validationErrors['nationality'] = 'Nationality type is required';
      isValid = false;
    }

    if (!personalInfo.religion || personalInfo.religion.trim() === '') {
      this.validationErrors['religion'] = 'Religion is required';
      isValid = false;
    }

    if (!personalInfo.educationalAttainment || personalInfo.educationalAttainment.trim() === '') {
      this.validationErrors['educationalAttainment'] = 'Educational attainment is required';
      isValid = false;
    }

    // Occupation is optional (for unemployed/students)
    // if (!personalInfo.occupation || personalInfo.occupation.trim() === '') {
    //   this.validationErrors['occupation'] = 'Occupation is required';
    //   isValid = false;
    // }

    if (!personalInfo.employmentStatus || personalInfo.employmentStatus.trim() === '') {
      this.validationErrors['employmentStatus'] = 'Employment status is required';
      isValid = false;
    }

    // Email validation in personal info
    if (!personalInfo.email || personalInfo.email.trim() === '') {
      this.validationErrors['email'] = 'Email address is required';
      isValid = false;
    } else if (!this.isValidEmail(personalInfo.email)) {
      this.validationErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    if (!personalInfo.contactNo || personalInfo.contactNo.trim() === '') {
      this.validationErrors['contactNo'] = 'Contact number is required';
      isValid = false;
    } else if (personalInfo.contactNo.length !== 10) {
      this.validationErrors['contactNo'] = 'Contact number must be exactly 10 digits';
      isValid = false;
    } else if (!/^\d{10}$/.test(personalInfo.contactNo)) {
      this.validationErrors['contactNo'] = 'Contact number must contain only numbers';
      isValid = false;
    }

    // PWD validation - field is required
    if (!personalInfo.pwd || personalInfo.pwd.trim() === '') {
      this.validationErrors['pwd'] = 'PWD status is required';
      isValid = false;
    } else if (personalInfo.pwd === 'Yes') {
      // If PWD is "Yes", PWD ID is required
      if (!personalInfo.pwdIdNo || personalInfo.pwdIdNo.trim() === '') {
        this.validationErrors['pwdIdNo'] = 'PWD ID Number is required when PWD status is Yes';
        isValid = false;
      }
    }

    // Monthly income is optional (for unemployed/students)
    if (personalInfo.monthlyIncome !== null && personalInfo.monthlyIncome !== undefined && personalInfo.monthlyIncome < 0) {
      this.validationErrors['monthlyIncome'] = 'Monthly income cannot be negative';
      isValid = false;
    }

    // Dropdown fields that are required
    if (!personalInfo.indigent || personalInfo.indigent.trim() === '') {
      this.validationErrors['indigent'] = 'Indigent status is required';
      isValid = false;
    }

    if (!personalInfo.soloParent || personalInfo.soloParent.trim() === '') {
      this.validationErrors['soloParent'] = 'Solo parent status is required';
      isValid = false;
    } else if (personalInfo.soloParent === 'Yes') {
      if (!personalInfo.soloParentIdNo || personalInfo.soloParentIdNo.trim() === '') {
        this.validationErrors['soloParentIdNo'] = 'Solo parent ID number is required when solo parent status is Yes';
        isValid = false;
      }
    }

    if (!personalInfo.seniorCitizen || personalInfo.seniorCitizen.trim() === '') {
      this.validationErrors['seniorCitizen'] = 'Senior citizen status is required';
      isValid = false;
    } else if (personalInfo.seniorCitizen === 'Yes') {
      if (!personalInfo.seniorCitizenIdNo || personalInfo.seniorCitizenIdNo.trim() === '') {
        this.validationErrors['seniorCitizenIdNo'] = 'Senior citizen ID number is required when senior citizen status is Yes';
        isValid = false;
      }
    }

    if (!personalInfo.fourPsMember || personalInfo.fourPsMember.trim() === '') {
      this.validationErrors['fourPsMember'] = '4Ps member status is required';
      isValid = false;
    }

    if (!personalInfo.registeredVoter || personalInfo.registeredVoter.trim() === '') {
      this.validationErrors['registeredVoter'] = 'Registered voter status is required';
      isValid = false;
    }

    // Address fields
    if (!personalInfo.purokNo || personalInfo.purokNo.trim() === '') {
      this.validationErrors['purokNo'] = 'Purok number is required';
      isValid = false;
    }

    if (!personalInfo.houseNo || personalInfo.houseNo.trim() === '') {
      this.validationErrors['houseNo'] = 'House number is required';
      isValid = false;
    }

    if (!personalInfo.street || personalInfo.street.trim() === '') {
      this.validationErrors['street'] = 'Street is required';
      isValid = false;
    }

    if (!personalInfo.housingOwnership || personalInfo.housingOwnership.trim() === '') {
      this.validationErrors['housingOwnership'] = 'Housing ownership is required';
      isValid = false;
    }

    if (personalInfo.yearsInBarangay === null || personalInfo.yearsInBarangay === undefined || personalInfo.yearsInBarangay === '') {
      this.validationErrors['yearsInBarangay'] = 'Years in barangay is required';
      isValid = false;
    } else {
      const y = Number(personalInfo.yearsInBarangay);
      if (isNaN(y) || !Number.isFinite(y) || y < 0) {
        this.validationErrors['yearsInBarangay'] = 'Please enter a valid non-negative number';
        isValid = false;
      }
    }

    // Date validation with age restriction
    if (personalInfo.birthDate) {
      const birthDate = new Date(personalInfo.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 0 || age > 150) {
        this.validationErrors['birthDate'] = 'Please enter a valid birth date';
        isValid = false;
      } else if (age < 18) {
        this.validationErrors['birthDate'] = 'You must be at least 18 years old to register. Only legal adults can create accounts for barangay services.';
        isValid = false;
      }
    }

    // Government ID validation - at least one is required
    const otherDetails = this.formData.otherDetails;
    const hasNationalId = otherDetails.nationalIdNo && otherDetails.nationalIdNo.trim() !== '';
    const hasVotersId = otherDetails.votersIdNo && otherDetails.votersIdNo.trim() !== '';
    
    if (!hasNationalId && !hasVotersId) {
      this.validationErrors['nationalIdNo'] = 'Please provide at least one government ID (National ID or Voter\'s ID)';
      this.validationErrors['votersIdNo'] = 'Please provide at least one government ID (National ID or Voter\'s ID)';
      isValid = false;
    }

    return isValid;
  }

  validateEmergencyContact(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Emergency contact validation
    if (!this.formData.emergencyContact.fullName || this.formData.emergencyContact.fullName.trim() === '') {
      this.validationErrors['ecFullName'] = 'Emergency contact full name is required';
      isValid = false;
    }

    if (!this.formData.emergencyContact.relationship || this.formData.emergencyContact.relationship.trim() === '') {
      this.validationErrors['ecRelationship'] = 'Emergency contact relationship is required';
      isValid = false;
    }

    if (!this.formData.emergencyContact.contactNo || this.formData.emergencyContact.contactNo.trim() === '') {
      this.validationErrors['ecContactNo'] = 'Emergency contact number is required';
      isValid = false;
    } else if (this.formData.emergencyContact.contactNo.length !== 10) {
      this.validationErrors['ecContactNo'] = 'Emergency contact number must be exactly 10 digits';
      isValid = false;
    } else if (!/^\d{10}$/.test(this.formData.emergencyContact.contactNo)) {
      this.validationErrors['ecContactNo'] = 'Emergency contact number must contain only numbers';
      isValid = false;
    }

    if (!this.formData.emergencyContact.address || this.formData.emergencyContact.address.trim() === '') {
      this.validationErrors['ecAddress'] = 'Emergency contact address is required';
      isValid = false;
    }

    return isValid;
  }

  validateOtherDetails(): boolean {
    const otherDetails = this.formData.otherDetails;

    // Automatically set status to "Active" for new registrations
    otherDetails.status = 'Active';

    // Set default date of registration to current date and time
    if (!otherDetails.dateOfRegistration) {
      otherDetails.dateOfRegistration = new Date().toISOString().split('T')[0];
    }

    // For other details, we'll make them optional since they're not critical
    // but we can add validation here if needed
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  // Clear conditional fields when parent field changes
  onPwdChange() {
    if (this.formData.personalInfo.pwd !== 'Yes') {
      this.formData.personalInfo.pwdIdNo = '';
    }
    // Clear validation error when field changes
    if (this.validationErrors['pwd']) {
      delete this.validationErrors['pwd'];
    }
    if (this.validationErrors['pwdIdNo']) {
      delete this.validationErrors['pwdIdNo'];
    }
  }

  onSoloParentChange() {
    if (this.formData.personalInfo.soloParent !== 'Yes') {
      this.formData.personalInfo.soloParentIdNo = '';
    }
    if (this.validationErrors['soloParent']) {
      delete this.validationErrors['soloParent'];
    }
    if (this.validationErrors['soloParentIdNo']) {
      delete this.validationErrors['soloParentIdNo'];
    }
  }

  onSeniorCitizenChange() {
    if (this.formData.personalInfo.seniorCitizen !== 'Yes') {
      this.formData.personalInfo.seniorCitizenIdNo = '';
    }
    if (this.validationErrors['seniorCitizen']) {
      delete this.validationErrors['seniorCitizen'];
    }
    if (this.validationErrors['seniorCitizenIdNo']) {
      delete this.validationErrors['seniorCitizenIdNo'];
    }
  }

  onNationalityTypeChange() {
    if (this.formData.personalInfo.nationalityType === 'Filipino') {
      this.formData.personalInfo.nationality = 'Filipino';
    } else {
      this.formData.personalInfo.nationality = '';
    }
    // Clear validation error when field changes
    if (this.validationErrors['nationality']) {
      delete this.validationErrors['nationality'];
    }
  }

  resetNationalitySelection() {
    this.formData.personalInfo.nationalityType = 'Filipino';
    this.formData.personalInfo.nationality = 'Filipino';
    // Clear validation error when field changes
    if (this.validationErrors['nationality']) {
      delete this.validationErrors['nationality'];
    }
  }

  // Change form submit handler to show modal instead of submit
  onNextOrShowPreview() {
    this.errorMessage = ''; // Clear any previous errors
    
    if (this.currentStep === 3) {
      // Validate all form steps before showing preview
      const step1Valid = this.validateStep1();
      const step2Valid = this.validatePersonalInfo();
      const step3Valid = this.validateEmergencyContact();
      
      if (step1Valid && step2Valid && step3Valid) {
        this.showPreviewModal = true;
      } else {
        this.errorMessage = 'Please input your information in the required fields before proceeding.';
        // Scroll to first error field
        setTimeout(() => {
          const firstErrorField = document.querySelector('.border-red-500');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }

  // Called when user confirms in the modal
  async onSubmit() {
    if (this.isLoading) return; // Prevent multiple submissions

    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Starting registration process...');
      console.log('Using profile image URL:', this.formData.profileImage);
      
      // STEP 0: Comprehensive validation before creating any accounts
      console.log('Step 0: Validating all data...');
      
      // Validate all form steps
      const step1Valid = this.validateStep1();
      const step2Valid = this.validatePersonalInfo();  
      const step3Valid = this.validateEmergencyContact();
      
      if (!step1Valid || !step2Valid || !step3Valid) {
        throw new Error('Please fill in all required fields correctly.');
      }

      // Set automatic values for other details
      this.validateOtherDetails();

      // STEP 0.5: Validate critical data completeness
      console.log('Step 0.5: Validating data completeness...');
      
      // Check all required personal info fields are present and not empty
      const requiredFields = [
        { field: this.formData.personalInfo.lastName, name: 'Last Name' },
        { field: this.formData.personalInfo.firstName, name: 'First Name' },
        { field: this.formData.personalInfo.middleName, name: 'Middle Name' },
        { field: this.formData.personalInfo.gender, name: 'Gender' },
        { field: this.formData.personalInfo.birthDate, name: 'Birth Date' },
        { field: this.formData.personalInfo.birthPlace, name: 'Birth Place' },
        { field: this.formData.personalInfo.civilStatus, name: 'Civil Status' },
        { field: this.formData.personalInfo.nationality, name: 'Nationality' },
        { field: this.formData.personalInfo.religion, name: 'Religion' },
        { field: this.formData.personalInfo.contactNo, name: 'Contact Number' },
        { field: this.formData.personalInfo.purokNo, name: 'Purok Number' },
        { field: this.formData.personalInfo.houseNo, name: 'House Number' },
        { field: this.formData.personalInfo.street, name: 'Street' },
        { field: this.formData.emergencyContact.fullName, name: 'Emergency Contact Name' },
        { field: this.formData.emergencyContact.relationship, name: 'Emergency Contact Relationship' },
        { field: this.formData.emergencyContact.contactNo, name: 'Emergency Contact Number' },
        { field: this.formData.emergencyContact.address, name: 'Emergency Contact Address' }
      ];

      for (const req of requiredFields) {
        if (!req.field || req.field.toString().trim() === '') {
          throw new Error(`${req.name} is required and cannot be empty.`);
        }
      }

      // Check numeric fields (monthly income is now optional)
      if (this.formData.personalInfo.monthlyIncome && this.formData.personalInfo.monthlyIncome <= 0) {
        throw new Error('Monthly income must be a positive number if provided.');
      }

      // Check dropdown selections
      const dropdownFields = [
        { field: this.formData.personalInfo.pwd, name: 'PWD Status' },
        { field: this.formData.personalInfo.indigent, name: 'Indigent Status' },
        { field: this.formData.personalInfo.soloParent, name: 'Solo Parent Status' },
        { field: this.formData.personalInfo.seniorCitizen, name: 'Senior Citizen Status' },
        { field: this.formData.personalInfo.fourPsMember, name: '4Ps Member Status' },
        { field: this.formData.personalInfo.registeredVoter, name: 'Registered Voter Status' }
      ];

      for (const dropdown of dropdownFields) {
        if (!dropdown.field || dropdown.field.trim() === '') {
          throw new Error(`${dropdown.name} must be selected.`);
        }
      }

      // Validate conditional fields
      if (this.formData.personalInfo.pwd === 'Yes') {
        if (!this.formData.personalInfo.pwdIdNo || this.formData.personalInfo.pwdIdNo.trim() === '') {
          throw new Error('PWD ID Number is required when PWD status is Yes.');
        }
      }

      if (this.formData.personalInfo.soloParent === 'Yes') {
        if (!this.formData.personalInfo.soloParentIdNo || this.formData.personalInfo.soloParentIdNo.trim() === '') {
          throw new Error('Solo Parent ID Number is required when Solo Parent status is Yes.');
        }
      }

      if (this.formData.personalInfo.seniorCitizen === 'Yes') {
        if (!this.formData.personalInfo.seniorCitizenIdNo || this.formData.personalInfo.seniorCitizenIdNo.trim() === '') {
          throw new Error('Senior Citizen ID Number is required when Senior Citizen status is Yes.');
        }
      }

      // Validate email format one more time
      if (!this.isValidEmail(this.formData.personalInfo.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Validate username format one more time
      if (!this.isValidUsername(this.formData.account.username)) {
        throw new Error('Please enter a valid username (4-20 characters, letters, numbers, underscores, and dots only).');
      }

      // Validate password requirements
      if (this.formData.account.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      if (this.formData.account.password !== this.formData.account.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      console.log('All validation passed. Checking for duplicate registration...');

      // Update loading status for duplicate check
      this.loadingStatus = 'Checking Duplicate Registration';

      // Check for duplicate resident registration BEFORE creating any accounts
      const duplicateCheck = await this.userService.checkDuplicateResident(
        this.formData.personalInfo.firstName,
        this.formData.personalInfo.lastName,
        this.formData.personalInfo.birthDate,
        this.formData.personalInfo.contactNo,
        this.formData.personalInfo.email
      );

      if (duplicateCheck.isDuplicate) {
        const existing = duplicateCheck.existingResident!;
        const registrationDate = new Date(existing.registrationDate).toLocaleDateString();
        
        // Reset loading state before showing dialog
        this.isLoading = false;
        this.loadingStatus = 'Creating Account';
        
        let title = 'Registration Not Allowed';
        let message = '';
        let duplicatedField = '';
        
        // Determine which field is duplicated and create appropriate message
        if (duplicateCheck.duplicateType === 'email') {
          title = 'Email Already Registered';
          duplicatedField = 'email address';
          message = 'This email address is already registered to another resident.';
        } else if (duplicateCheck.duplicateType === 'contact') {
          title = 'Contact Number Already Registered';
          duplicatedField = 'contact number';
          message = 'This contact number is already registered to another resident.';
        } else if (duplicateCheck.duplicateType === 'name') {
          title = 'Name Already Registered';
          duplicatedField = 'full name';
          message = 'This full name is already registered to another resident.';
        } else {
          title = 'Duplicate Information Detected';
          duplicatedField = 'information';
          message = 'Some of your information is already registered to another resident.';
        }
        
        await Swal.fire({
          icon: 'warning',
          title: title,
          html: `
            <div style="text-align: left;">
              <p style="margin-bottom: 16px; color: #374151; font-size: 15px;">${message}</p>
              <div style="background-color: #fef3cd; border: 1px solid #f6cc47; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <svg style="width: 20px; height: 20px; color: #92400e; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <strong style="color: #92400e;">Duplicate ${duplicatedField} detected</strong>
                </div>
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                  For privacy and security reasons, we cannot show existing resident details.
                </p>
              </div>
              <p style="margin-top: 12px; font-size: 14px; color: #6b7280;">
                <strong>If this is you:</strong> Please try logging in with your existing account.<br>
                <strong>Need help?</strong> Contact the Barangay New Cabalan office for assistance.
              </p>
              <div style="background-color: #e0f2fe; border-left: 4px solid #0288d1; padding: 10px; margin-top: 12px; font-size: 13px;">
                <strong>Office Contact:</strong> (047) 224-2176<br>
                <strong>Location:</strong> Corner Mabini St., Purok 2, New Cabalan, Olongapo City
              </div>
            </div>
          `,
          confirmButtonText: 'I Understand',
          confirmButtonColor: '#3b82f6',
          backdrop: `rgba(0, 0, 0, 0.4)`,
          allowOutsideClick: false,
          customClass: {
            popup: 'swal2-popup-custom'
          }
        });
        
        return;
      }

      console.log('No duplicate found. Proceeding with account creation...');
      
      // Update loading status for account creation
      this.loadingStatus = 'Creating Account';

      // Variables to track what was created for rollback
      let authResponse: any = null;
      let userDocCreated = false;
      let residentDocCreated = false;

      try {
        // STEP 1: Create user in Appwrite Auth
        console.log('Step 1: Creating user account...');
        this.loadingStatus = 'Creating User Account';
        authResponse = await this.authService.register({
          username: this.formData.account.username,
          password: this.formData.account.password,
          confirmPassword: this.formData.account.confirmPassword
        });
        console.log('Auth account created successfully with ID:', authResponse.$id);

        // STEP 2: Create user document in users collection
        console.log('Step 2: Creating user document...');
        this.loadingStatus = 'Setting Up User Profile';
        const userDoc = {
          uid: authResponse.$id,
          username: this.formData.account.username,
          email: this.formData.personalInfo.email,
          role: 'resident',
          created_at: new Date().toISOString(),
          is_active: false // User needs admin approval before login
        };
        await this.userService.createUser(userDoc);
        userDocCreated = true;
        console.log('User document created successfully');

        // STEP 3: Create resident document
        console.log('Step 3: Creating resident document...');
        this.loadingStatus = 'Saving Resident Information';
        const residentDoc = {
          profileImage: this.formData.profileImage || '', 
          userId: authResponse.$id,
          email: this.formData.personalInfo.email,
          lastName: this.formData.personalInfo.lastName,
          firstName: this.formData.personalInfo.firstName,
          middleName: this.formData.personalInfo.middleName,
          suffix: this.formData.personalInfo.suffix,
          gender: this.formData.personalInfo.gender,
          birthDate: this.formData.personalInfo.birthDate,
          birthPlace: this.formData.personalInfo.birthPlace,
          civilStatus: this.formData.personalInfo.civilStatus,
          nationality: this.formData.personalInfo.nationality,
          religion: this.formData.personalInfo.religion,
          occupation: this.formData.personalInfo.occupation,
          educationalAttainment: this.formData.personalInfo.educationalAttainment || '',
          employmentStatus: this.formData.personalInfo.employmentStatus || '',
          housingOwnership: this.formData.personalInfo.housingOwnership || '',
          yearsInBarangay: this.formData.personalInfo.yearsInBarangay || null,
          contactNo: '+63' + this.formData.personalInfo.contactNo,
          pwd: this.formData.personalInfo.pwd,
          pwdIdNo: this.formData.personalInfo.pwd === 'Yes' ? this.formData.personalInfo.pwdIdNo : '',
          monthlyIncome: this.formData.personalInfo.monthlyIncome,
          indigent: this.formData.personalInfo.indigent,
          soloParent: this.formData.personalInfo.soloParent,
          soloParentIdNo: this.formData.personalInfo.soloParent === 'Yes' ? this.formData.personalInfo.soloParentIdNo : '',
          seniorCitizen: this.formData.personalInfo.seniorCitizen,
          seniorCitizenIdNo: this.formData.personalInfo.seniorCitizen === 'Yes' ? this.formData.personalInfo.seniorCitizenIdNo : '',
          fourPsMember: this.formData.personalInfo.fourPsMember,
          registeredVoter: this.formData.personalInfo.registeredVoter,
          purokNo: this.formData.personalInfo.purokNo,
          houseNo: this.formData.personalInfo.houseNo,
          street: this.formData.personalInfo.street,
          ecFullName: this.formData.emergencyContact.fullName,
          ecRelation: this.formData.emergencyContact.relationship,
          ecContactNo: '+63' + this.formData.emergencyContact.contactNo,
          ecAddress: this.formData.emergencyContact.address,
          NationalIdNo: this.formData.otherDetails.nationalIdNo,
          votersIdNo: this.formData.otherDetails.votersIdNo,
          status: 'Active',
          dateOfRegistration: new Date().toISOString(),
          approvalStatus: 'Pending', // Pending admin approval
          approvedAt: null
        };
        
        console.log('Creating resident document with profile image:', residentDoc.profileImage);
        
        await this.userService.createResident(residentDoc);
        residentDocCreated = true;
        console.log('Resident document created successfully');
        
        console.log('Registration completed successfully');
        
        // Show success modal
        this.showPreviewModal = false;
        this.showSuccessModal = true;

      } catch (dbError: any) {
        console.error('Database operation failed:', dbError);
        
        // ROLLBACK: Attempt to clean up database records if they were created
        console.log('Starting rollback process...');
        
        try {
          // Try to delete resident document if it was created
          if (residentDocCreated && authResponse?.$id) {
            console.log('Rolling back: Deleting resident document...');
            await this.userService.deleteResident(authResponse.$id);
            console.log('Resident document rollback completed');
          }
          
          // Try to delete user document if it was created
          if (userDocCreated && authResponse?.$id) {
            console.log('Rolling back: Deleting user document...');
            await this.userService.deleteUser(authResponse.$id);
            console.log('User document rollback completed');
          }
          
          // Attempt to clean up auth session
          if (authResponse?.$id) {
            console.log('Rolling back: Cleaning up auth session...');
            await this.authService.attemptAccountCleanup();
            console.log('Auth session cleanup completed');
          }
          
        } catch (rollbackError) {
          console.error('Error during rollback:', rollbackError);
          // Continue with error handling even if rollback fails
        }
        
        // Re-throw the original database error
        throw dbError;
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error types with better messaging
      if (error.message && error.message.includes('user with the same email already exists')) {
        this.errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
      } else if (error.message && error.message.includes('Invalid document structure')) {
        this.errorMessage = 'There was an error with the registration data. Please check all fields and try again.';
      } else if (error.message && error.message.includes('Network request failed')) {
        this.errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message && error.message.includes('Document with the requested ID could not be found')) {
        this.errorMessage = 'Database error occurred. Please try again. If the problem persists, contact support.';
      } else if (error.message && (
          error.message.includes('required') || 
          error.message.includes('cannot be empty') || 
          error.message.includes('must be selected') ||
          error.message.includes('valid email') ||
          error.message.includes('password') ||
          error.message.includes('ID Number') ||
          error.message.includes('must be a positive number') ||
          error.message.includes('must be selected')
        )) {
        this.errorMessage = error.message;
      } else if (error.code === 409) {
        this.errorMessage = 'This email is already registered. Please use a different email address.';
      } else if (error.code === 400) {
        this.errorMessage = 'Invalid registration data. Please check all fields and try again.';
      } else if (error.code === 500) {
        this.errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        this.errorMessage = `Registration failed: ${error.message}`;
      } else {
        this.errorMessage = 'An unexpected error occurred during registration. Please try again. If the problem persists, contact support.';
      }
    } finally {
      this.isLoading = false;
      this.loadingStatus = 'Creating Account';
    }
  }

  onSuccessOk() {
    this.showSuccessModal = false;
    this.router.navigate(['/sign-in']);
  }

  acceptTermsAndClose() {
    this.acceptedTerms = true;
    this.showTermsModal = false;
    // Clear any validation error for terms
    if (this.validationErrors['acceptedTerms']) {
      delete this.validationErrors['acceptedTerms'];
    }
  }

  // Enhanced helper methods for better UX
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const password = this.formData.account.password;
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 5);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0:
      case 1:
        return 'Very weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Strong';
      case 5:
        return 'Very strong';
      default:
        return '';
    }
  }

  passwordMismatch(): boolean {
    return this.formData.account.password !== this.formData.account.confirmPassword && this.formData.account.confirmPassword !== '';
  }

  isValidUsername(username: string): boolean {
    // Username must be 4-20 characters, containing only letters, numbers, underscores, and dots
    const usernameRegex = /^[a-zA-Z0-9_.]{4,20}$/;
    return usernameRegex.test(username);
  }

  getInvalidUsernameCharacters(username: string): string[] {
    if (!username) return [];
    
    const validChars = /[a-zA-Z0-9_.]/;
    const invalidChars: string[] = [];
    
    for (let i = 0; i < username.length; i++) {
      const char = username[i];
      if (!validChars.test(char) && !invalidChars.includes(char)) {
        invalidChars.push(char);
      }
    }
    
    return invalidChars;
  }

  // Real-time validation clearing method
  clearFieldError(fieldName: string) {
    if (this.validationErrors && this.validationErrors[fieldName]) {
      delete this.validationErrors[fieldName];
    }
  }

  canProceedToStep2(): boolean {
    return !!(this.formData.account.username &&
              this.formData.account.password &&
              this.formData.account.confirmPassword &&
              this.acceptedTerms &&
              !this.passwordMismatch() &&
              this.isValidUsername(this.formData.account.username) &&
              this.formData.account.password.length >= 8 &&
              this.getPasswordStrength() >= 3);
  }

  // Method to handle real-time validation clearing on input
  onFieldInput(fieldName: string, value: any) {
    // Clear error when user starts typing in a field
    if (value && value.toString().trim() !== '') {
      this.clearFieldError(fieldName);
      
      // Special handling for government IDs - clear both errors if one is filled
      if (fieldName === 'nationalIdNo' || fieldName === 'votersIdNo') {
        const hasNationalId = this.formData.otherDetails.nationalIdNo && this.formData.otherDetails.nationalIdNo.trim() !== '';
        const hasVotersId = this.formData.otherDetails.votersIdNo && this.formData.otherDetails.votersIdNo.trim() !== '';
        
        // If at least one government ID is filled, clear both errors
        if (hasNationalId || hasVotersId) {
          this.clearFieldError('nationalIdNo');
          this.clearFieldError('votersIdNo');
        }
      }
    }
  }

  // Method to handle real-time validation clearing for dropdowns/selects
  onFieldChange(fieldName: string, value: any) {
    // Clear error when user selects a value in dropdown
    if (value && value.toString().trim() !== '') {
      this.clearFieldError(fieldName);
    }
  }

  // Method to handle religion selection changes
  onReligionChange(event: any) {
    const selectedValue = event.target.value;
    
    if (selectedValue === 'Others') {
      this.religionType = 'others';
      this.formData.personalInfo.religion = ''; // Clear the field for custom input
    } else {
      this.religionType = 'predefined';
      this.formData.personalInfo.religion = selectedValue;
      // Clear error when a predefined religion is selected
      if (selectedValue && selectedValue.trim() !== '') {
        this.clearFieldError('religion');
      }
    }
  }
}
