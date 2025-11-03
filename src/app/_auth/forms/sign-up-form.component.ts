import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <!-- Logo Section -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 bg-blue-800 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Welcome to BNC Portal</h1>
        <p class="text-sm sm:text-base text-gray-600">Create your account to get started</p>
      </div>

      <!-- Registration Form -->
      <form class="w-full max-w-md bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl" (ngSubmit)="onSubmit()" #registrationForm="ngForm">
        <!-- Progress Indicator -->
        <div class="flex justify-center mb-6">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
        
        <!-- Name Field -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="name">
            Full Name <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="formData.name"
              #nameInput="ngModel"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              [class.border-red-500]="nameInput.invalid && nameInput.touched"
              required
              minlength="2"
              autocomplete="name"
            />
            <div class="absolute right-3 top-3">
              <svg *ngIf="nameInput.valid && nameInput.touched" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div *ngIf="nameInput.invalid && nameInput.touched" class="mt-1 text-sm text-red-600">
            <span *ngIf="nameInput.errors?.['required']">Name is required</span>
            <span *ngIf="nameInput.errors?.['minlength']">Name must be at least 2 characters</span>
          </div>
        </div>
        
        <!-- Username Field -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="username">
            Username <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="formData.username"
              #usernameInput="ngModel"
              placeholder="Choose a unique username"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              [class.border-red-500]="usernameInput.invalid && usernameInput.touched"
              [class.border-green-500]="usernameInput.valid && usernameInput.touched"
              required
              minlength="4"
              maxlength="20"
              pattern="^[a-zA-Z0-9_]+$"
              autocomplete="username"
            />
            <div class="absolute right-3 top-3">
              <svg *ngIf="usernameInput.valid && usernameInput.touched" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="usernameInput.invalid && usernameInput.touched" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div *ngIf="usernameInput.invalid && usernameInput.touched" class="mt-1 text-sm text-red-600">
            <span *ngIf="usernameInput.errors?.['required']">Username is required</span>
            <span *ngIf="usernameInput.errors?.['minlength']">Username must be at least 4 characters</span>
            <span *ngIf="usernameInput.errors?.['maxlength']">Username cannot exceed 20 characters</span>
            <span *ngIf="usernameInput.errors?.['pattern']">Username can only contain letters, numbers, and underscores</span>
          </div>
          <div *ngIf="usernameInput.valid && usernameInput.touched" class="mt-1 text-sm text-green-600">
            ✓ Valid username
          </div>
        </div>
        
        <!-- Password Field -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
            Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              [type]="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              [(ngModel)]="formData.password"
              #passwordInput="ngModel"
              placeholder="Create a strong password"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              [class.border-red-500]="passwordInput.invalid && passwordInput.touched"
              [class.border-green-500]="getPasswordStrength() >= 4 && passwordInput.touched"
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
          <div *ngIf="formData.password && passwordInput.touched" class="mt-2">
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
          
          <div *ngIf="passwordInput.invalid && passwordInput.touched" class="mt-1 text-sm text-red-600">
            <span *ngIf="passwordInput.errors?.['required']">Password is required</span>
            <span *ngIf="passwordInput.errors?.['minlength']">Password must be at least 8 characters</span>
          </div>
        </div>

        <!-- Confirm Password Field -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="confirmPassword">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="formData.confirmPassword"
              #confirmPasswordInput="ngModel"
              placeholder="Re-enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              [class.border-red-500]="(confirmPasswordInput.invalid && confirmPasswordInput.touched) || (passwordMismatch() && confirmPasswordInput.touched)"
              [class.border-green-500]="!passwordMismatch() && confirmPasswordInput.touched && formData.confirmPassword"
              required
              autocomplete="new-password"
            />
            <div class="absolute right-3 top-3">
              <svg *ngIf="!passwordMismatch() && confirmPasswordInput.touched && formData.confirmPassword" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div *ngIf="passwordMismatch() && confirmPasswordInput.touched" class="mt-1 text-sm text-red-600">
            Passwords do not match
          </div>
          <div *ngIf="!passwordMismatch() && confirmPasswordInput.touched && formData.confirmPassword" class="mt-1 text-sm text-green-600">
            ✓ Passwords match
          </div>
        </div>
        
        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="!registrationForm.valid || passwordMismatch() || isLoading"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span *ngIf="!isLoading" class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
            Continue to Next Step
          </span>
          <span *ngIf="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>
        
        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Already have an account? 
            <button type="button" (click)="navigateToLogin()" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-200 ml-1">
              Sign in here
            </button>
          </p>
        </div>
      </form>
      
      <!-- Footer -->
      <div class="mt-8 text-center text-xs text-gray-500">
        <p>By creating an account, you agree to our terms and conditions</p>
      </div>
    </div>
  `,
  styles: `
    @keyframes slideInFromBottom {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    form {
      animation: slideInFromBottom 0.6s ease-out;
    }
    
    .gradient-text {
      background: linear-gradient(45deg, #3B82F6, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `
})
export class SignUpFormComponent {
  formData = {
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  };
  
  showPassword = false;
  isLoading = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Store form data in session storage for the next step
      sessionStorage.setItem('signupStep1Data', JSON.stringify(this.formData));
      
      // Navigate to detailed information form
      this.router.navigate(['/sign-up-information']);
      this.isLoading = false;
    }, 1000);
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  getPasswordStrength(): number {
    const password = this.formData.password;
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
    return this.formData.password !== this.formData.confirmPassword && this.formData.confirmPassword !== '';
  }
  
  navigateToLogin() {
    this.router.navigate(['/sign-in']);
  }
}
