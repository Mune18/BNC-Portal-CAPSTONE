import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full w-full px-3 sm:px-6 lg:px-8 py-4 pt-20 lg:pt-4">
      <form class="w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl transition-all duration-300 mx-auto" (submit)="onSubmit($event)">
        <h2 class="text-center text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Register</h2>
        <hr class="border-t border-gray-200 mb-4 sm:mb-6">
        
        <div class="mb-4 sm:mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
          <input
            type="name"
            id="name"
            placeholder="Enter name"
            class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        
        <div class="mb-4 sm:mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        
        <div class="mb-6 sm:mb-8">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            class="border border-gray-200 rounded-lg bg-blue-50 w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>
        
        <div class="flex items-center justify-center mb-4 sm:mb-6">
          <button
            type="submit"
            class="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          >
            Next
          </button>
        </div>
        
        <p class="text-center text-sm sm:text-base text-gray-600">
          Already have an account? 
          <a href="sign-in" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition">Login Now</a>
        </p>
      </form>
    </div>
  `,
  styles: ``
})
export class SignUpFormComponent {
  constructor(private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    // Add your form validation logic here
    
    // Navigate to sign-up-information form
    this.router.navigate(['/sign-up-information']);
  }
}
