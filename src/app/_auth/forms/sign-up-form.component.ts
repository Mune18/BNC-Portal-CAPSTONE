import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full">
      <form class="w-120 h-112 max-w-m bg-white p-6 rounded-4xl shadow-md" (submit)="onSubmit($event)">
        <h2 class="text-center text-2xl font-semibold mb-4">Register</h2>
        <hr class="border-t border-gray-200 mx-5 mb-4">
        <div class="mx-3 mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
          <input
            type="name"
            id="name"
            placeholder="Enter name"
            class="border-none rounded bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mx-3 mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            class="border-none rounded bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mx-3 mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            class="border-none rounded bg-blue-50 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="flex items-center justify-center">
          <button
            type="submit"
            class="w-35 bg-blue-800 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
        </div>
        <p class="text-center mt-4">
          Already have an account? <a href="sign-in" class="text-blue-600 hover:underline">Login Now</a>
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
