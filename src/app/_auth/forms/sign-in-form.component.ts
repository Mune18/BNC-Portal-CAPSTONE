import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoginData } from '../../shared/types/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen px-2 sm:px-6">
        <form 
          class="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300"
          (ngSubmit)="onSubmit()"
        >
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p class="text-gray-600">Sign in to your account</p>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errorMessage }}
            </div>
          </div>

          <!-- Email Field -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="loginData.email"
              name="email"
              placeholder="Enter your email"
              class="border border-gray-200 rounded-lg bg-blue-50 w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
              [disabled]="isLoading"
            />
          </div>

          <!-- Password Field -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
              Password *
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="loginData.password"
              name="password"
              placeholder="Enter your password"
              class="border border-gray-200 rounded-lg bg-blue-50 w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
              [disabled]="isLoading"
            />
          </div>

          <!-- Login Button -->
          <div class="mb-6">
            <button
              type="submit"
              class="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
              [disabled]="isLoading"
            >
              <svg *ngIf="isLoading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-gray-600">
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
}
