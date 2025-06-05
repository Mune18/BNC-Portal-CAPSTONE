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
    <div class="flex flex-col items-center justify-center h-full">
      <form class="w-120 h-90 max-w-m bg-white p-6 rounded-4xl shadow-md" (ngSubmit)="onSubmit()">
        <h2 class="text-center text-2xl font-semibold mb-4">Login</h2>
        <hr class="border-t border-gray-200 mx-3 mb-4">
        <div class="mx-3 mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="loginData.email"
            name="email"
            placeholder="Enter email"
            class="border-none rounded bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="mx-3 mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="loginData.password"
            name="password"
            placeholder="Enter password"
            class="border-none rounded bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div class="flex items-center justify-center">
          <button
            type="submit"
            class="w-35 bg-blue-800 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
        <p class="text-center mt-4">
          Don't have an account? <a href="sign-up-information" class="text-blue-600 hover:underline">Sign Up Now</a>
        </p>
        <div *ngIf="errorMessage" class="text-red-600 text-center mt-2">{{ errorMessage }}</div>
      </form>
    </div>
  `,
  styles: ``
})
export class SignInFormComponent {
  loginData: LoginData = { email: '', password: '' };
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async onSubmit() {
    this.errorMessage = '';
    try {
      // 1. Login and get session
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
      }
    } catch (error: any) {
      this.errorMessage = 'Invalid email or password.';
      console.error('Login failed:', error);
    }
  }
}
