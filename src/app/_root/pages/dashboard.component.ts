import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Overview of the barangay's analytics and management tools</p>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Total Residents -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Total Residents</h2>
              <p class="text-gray-600 text-sm">1,245</p>
            </div>
          </div>
        </div>

        <!-- Active Complaints -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.934-.816 1.994-1.851L21 10a2 2 0 00-2-2H5a2 2 0 00-2 2v6.149c0 1.035.816 1.851 1.851 1.994z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Active Complaints</h2>
              <p class="text-gray-600 text-sm">8</p>
            </div>
          </div>
        </div>

        <!-- Announcements Posted -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Announcements</h2>
              <p class="text-gray-600 text-sm">24</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Barangay Events -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Upcoming Barangay Events</h2>
        <ul class="divide-y divide-gray-200">
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">Clean-up Drive</p>
              <p class="text-sm text-gray-600">June 10, 2025 - 7:00 AM</p>
            </div>
            <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Scheduled</span>
          </li>
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">Barangay Fiesta</p>
              <p class="text-sm text-gray-600">June 20, 2025 - 5:00 PM</p>
            </div>
            <span class="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Upcoming</span>
          </li>
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">Medical Mission</p>
              <p class="text-sm text-gray-600">July 5, 2025 - 8:00 AM</p>
            </div>
            <span class="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Planned</span>
          </li>
        </ul>
      </div>

      <!-- Residents Demographics (Modern Graphs) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Age Group Bar Graph -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Residents by Age Group</h2>
          <div class="w-full h-56 flex flex-col justify-end">
            <div class="flex items-end h-full gap-4">
              <div class="flex flex-col items-center flex-1">
                <div class="bg-blue-500 w-10 rounded-t-lg transition-all" style="height: 45%;">
                  <span class="sr-only">320</span>
                </div>
                <span class="mt-2 text-xs text-gray-700">0-12</span>
                <span class="text-xs text-gray-500">320</span>
              </div>
              <div class="flex flex-col items-center flex-1">
                <div class="bg-green-500 w-10 rounded-t-lg transition-all" style="height: 30%;">
                  <span class="sr-only">210</span>
                </div>
                <span class="mt-2 text-xs text-gray-700">13-19</span>
                <span class="text-xs text-gray-500">210</span>
              </div>
              <div class="flex flex-col items-center flex-1">
                <div class="bg-purple-500 w-10 rounded-t-lg transition-all" style="height: 80%;">
                  <span class="sr-only">570</span>
                </div>
                <span class="mt-2 text-xs text-gray-700">20-59</span>
                <span class="text-xs text-gray-500">570</span>
              </div>
              <div class="flex flex-col items-center flex-1">
                <div class="bg-yellow-500 w-10 rounded-t-lg transition-all" style="height: 20%;">
                  <span class="sr-only">145</span>
                </div>
                <span class="mt-2 text-xs text-gray-700">60+</span>
                <span class="text-xs text-gray-500">145</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Gender Pie Graph (CSS-based) -->
        <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 self-start">Residents by Gender</h2>
          <div class="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg viewBox="0 0 36 36" class="w-full h-full">
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke="#3B82F6"
                stroke-width="4"
                stroke-dasharray="49.6 50.4"
                stroke-dashoffset="0"
              />
              <circle
                cx="18" cy="18" r="16"
                fill="none"
                stroke="#F472B6"
                stroke-width="4"
                stroke-dasharray="50.4 49.6"
                stroke-dashoffset="-49.6"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-gray-800">1245</span>
              <span class="text-xs text-gray-500">Total</span>
            </div>
          </div>
          <div class="flex justify-center gap-6 w-full">
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <span class="text-sm text-gray-700">Male</span>
              <span class="font-semibold text-gray-900 ml-1">620</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full bg-pink-400"></span>
              <span class="text-sm text-gray-700">Female</span>
              <span class="font-semibold text-gray-900 ml-1">625</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Modern graph styles are handled inline and with Tailwind CSS utility classes */
  `]
})
export class DashboardComponent {}
