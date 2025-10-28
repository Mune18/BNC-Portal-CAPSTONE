import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoginData } from '../../shared/types/auth';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen w-full px-3 sm:px-6 lg:px-8 py-4 pt-20 lg:pt-4">
        <form 
          class="w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-300 mx-auto"
          (ngSubmit)="onSubmit()"
        >
          <!-- Header -->
          <div class="text-center mb-6 sm:mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p class="text-sm sm:text-base text-gray-600">Sign in to your account</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div class="flex items-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm sm:text-base">{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Email Field -->
          <div class="mb-4 sm:mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="loginData.email"
              name="email"
              placeholder="Enter your email"
              class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
              [disabled]="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="mb-4 sm:mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
              Password *
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="loginData.password"
              name="password"
              placeholder="Enter your password"
              class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
              [disabled]="isLoading"
            />
          </div>

          <!-- Login Button -->
          <div class="mb-4 sm:mb-6">
            <button
              type="submit"
              class="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center text-sm sm:text-base"
              [disabled]="isLoading"
            >
              <svg *ngIf="isLoading" class="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-sm sm:text-base text-gray-600">
              Don't have an account? 
              <a href="sign-up-information" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition">
                Create Account
              </a>
            </p>
          </div>
        </form>
    </div>
  `,
  styles: [`
    /* Clean, minimal styling for the sign-in form */
  `]
})
export class SignInFormComponent {
  loginData: LoginData = { email: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    
    try {
      // First check if there's an active session and delete it
      try {
        const currentSession = await this.authService.getSession();
        if (currentSession) {
          await this.authService.deleteSession(currentSession.$id);
          console.log('Deleted existing session before login');
        }
      } catch (sessionError) {
        // No active session, which is fine
        console.log('No active session found, proceeding with login');
      }

      // Now proceed with the login
      await this.authService.login(this.loginData);

      // 2. Get current user info from Appwrite
      const account = await this.authService.getAccount();

      // 3. Fetch user document from your database to check role
      const userDoc = await this.userService.getUserInformation(account.$id);

      if (userDoc && userDoc.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userDoc && userDoc.role === 'resident') {
        // Check if resident account has restricted access
        if (userDoc.otherDetails && (userDoc.otherDetails.status === 'Deceased' || userDoc.otherDetails.status === 'Archived')) {
          // Show specific alerts for deceased or archived accounts
          if (userDoc.otherDetails.status === 'Deceased') {
            await this.showDeceasedAccountAlert();
          } else if (userDoc.otherDetails.status === 'Archived') {
            await this.showArchivedAccountAlert();
          }
          await this.authService.logout();
          this.isLoading = false;
          return;
        }
        
        // Handle inactive accounts - reactivate them upon login
        if (userDoc.otherDetails && userDoc.otherDetails.status === 'Inactive') {
          try {
            // Update status to Active
            const updatedResident = { ...userDoc };
            updatedResident.otherDetails.status = 'Active';
            
            // Update in database (you'll need to implement this method)
            await this.userService.updateUserStatus(account.$id, 'Active');
            
            console.log('Inactive account reactivated upon login');
          } catch (error) {
            console.error('Error reactivating inactive account:', error);
            // Continue with login even if status update fails
          }
        }
        
        this.router.navigate(['/user/home']);
      } else {
        this.errorMessage = 'Unknown user role or user not found.';
        this.isLoading = false;
      }
    } catch (error: any) {
      this.errorMessage = 'Invalid email or password.';
      console.error('Login failed:', error);
      this.isLoading = false;
    }
  }

  async showDeceasedAccountAlert() {
    await Swal.fire({
      icon: 'info',
      title: 'Account Notice',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-4">This account is marked as <strong>deceased</strong> in our records and cannot be accessed.</p>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">If you believe this is an error:</h4>
            <ul class="text-gray-700 text-sm space-y-1">
              <li>• Please contact the Barangay New Cabalan office</li>
              <li>• Bring valid identification documents</li>
              <li>• Speak with the administrator to update records</li>
              <li>• Provide necessary documentation for verification</li>
            </ul>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-gray-600 text-sm">
              <strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM<br>
              <strong>Location:</strong> Corner Mabini St., Purok 2, New Cabalan, Olongapo City<br>
              <strong>Contact:</strong> (047) 224-2176
            </p>
          </div>
        </div>
      `,
      confirmButtonText: 'I Understand',
      confirmButtonColor: '#6B7280',
      allowOutsideClick: false,
      allowEscapeKey: false,
      width: '500px',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0',
        title: 'text-xl font-bold text-gray-700 mb-4',
        htmlContainer: 'text-left',
        confirmButton: 'font-semibold py-3 px-6 rounded-lg transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105'
      },
      backdrop: 'rgba(15, 23, 42, 0.7)',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
    });
  }

  async showArchivedAccountAlert() {
    await Swal.fire({
      icon: 'warning',
      title: 'Account Archived',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-4">This account has been <strong>archived</strong> and cannot be accessed at this time.</p>
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-orange-800 mb-2">To restore your account:</h4>
            <ul class="text-orange-700 text-sm space-y-1">
              <li>• Contact the Barangay New Cabalan office</li>
              <li>• Bring valid identification documents</li>
              <li>• Speak with the administrator about account restoration</li>
              <li>• Complete the account reactivation process</li>
            </ul>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-gray-600 text-sm">
              <strong>Office Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM<br>
              <strong>Location:</strong> Corner Mabini St., Purok 2, New Cabalan, Olongapo City<br>
              <strong>Contact:</strong> (047) 224-2176
            </p>
          </div>
        </div>
      `,
      confirmButtonText: 'I Understand',
      confirmButtonColor: '#EA580C',
      allowOutsideClick: false,
      allowEscapeKey: false,
      width: '500px',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0',
        title: 'text-xl font-bold text-orange-700 mb-4',
        htmlContainer: 'text-left',
        confirmButton: 'font-semibold py-3 px-6 rounded-lg transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105'
      },
      backdrop: 'rgba(15, 23, 42, 0.7)',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
    });
  }
}
