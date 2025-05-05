import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Overview of the system's analytics and management tools</p>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <!-- Pending Requests -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l-4-4m0 0l4-4m-4 4h16" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Pending Requests</h2>
              <p class="text-gray-600 text-sm">32</p>
            </div>
          </div>
        </div>

        <!-- Approved Requests -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Approved Requests</h2>
              <p class="text-gray-600 text-sm">120</p>
            </div>
          </div>
        </div>

        <!-- Disapproved Requests -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Disapproved Requests</h2>
              <p class="text-gray-600 text-sm">15</p>
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

        <!-- Accounts to Verify -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-800">Accounts to Verify</h2>
              <p class="text-gray-600 text-sm">5</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul class="divide-y divide-gray-200">
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">John Doe</p>
              <p class="text-sm text-gray-600">Submitted a document request</p>
            </div>
            <p class="text-sm text-gray-500">2 hours ago</p>
          </li>
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">Jane Smith</p>
              <p class="text-sm text-gray-600">Request approved</p>
            </div>
            <p class="text-sm text-gray-500">1 day ago</p>
          </li>
          <li class="py-4 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">Mark Johnson</p>
              <p class="text-sm text-gray-600">Request disapproved</p>
            </div>
            <p class="text-sm text-gray-500">3 days ago</p>
          </li>
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button class="bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Add New Resident
        </button>
        <button class="bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition">
          Approve Requests
        </button>
        <button class="bg-red-600 text-white px-4 py-3 rounded-lg shadow hover:bg-red-700 transition">
          Disapprove Requests
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
