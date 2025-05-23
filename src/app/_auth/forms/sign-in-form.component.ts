import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in-form',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-full">
      <form class="w-120 h-90 max-w-m bg-white p-6 rounded-4xl shadow-md">
        <h2 class="text-center text-2xl font-semibold mb-4">Login</h2>
        <hr class="border-t border-gray-200 mx-3 mb-4">
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
            Login
          </button>
        </div>
        <p class="text-center mt-4">
          Don't have an account? <a href="sign-up" class="text-blue-600 hover:underline">Sign Up Now</a>
        </p>
      </form>
    </div>
  `,
  styles: ``
})
export class SignInFormComponent {}
