import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { ComplaintService } from '../../shared/services/complaint.service';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { DataRefreshService } from '../../shared/services/data-refresh.service';
import { HouseholdService } from '../../shared/services/household.service';
import { ResidentInfo } from '../../shared/types/resident';
import { Announcement } from '../../shared/types/announcement';
import { Complaint } from '../../shared/types/complaint';
import { Subscription } from 'rxjs';
import Chart from 'chart.js/auto';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusFormatPipe, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p class="text-gray-600 text-lg">Overview of the barangay's analytics and management tools</p>
        </div>

      <!-- Unified Loading Indicator -->
      <div *ngIf="loading" class="w-full">
        <app-loading type="spinner" [fullScreen]="true" message="Loading dashboard data..."></app-loading>
      </div>

      <div *ngIf="!loading">
        <!-- Analytics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <!-- Total Residents -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-300 overflow-hidden" [routerLink]="['/admin/residents']">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Residents</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ totalResidents }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Resident Approval -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-purple-100 hover:border-purple-300 overflow-hidden" [routerLink]="['/admin/residents']" [queryParams]="{ filter: 'pending' }">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pending Registrations</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ pendingResidentApprovals }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Update Requests -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-amber-100 hover:border-amber-300 overflow-hidden" [routerLink]="['/admin/update-requests']">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Resident Information Update Requests</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{{ pendingUpdateRequests }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Complaints -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-orange-100 hover:border-orange-300 overflow-hidden" [routerLink]="['/admin/reports']">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pending Complaints</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{{ pendingComplaints }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Senior Citizens -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-indigo-100 hover:border-indigo-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Senior Citizens</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ seniorCitizensCount }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- PWD -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal-100 hover:border-teal-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">PWD</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{{ pwdCount }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 4Ps Members -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 hover:border-green-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">4Ps Members</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ fourPsCount }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Solo Parents -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 hover:border-pink-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Solo Parents</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{{ soloParentCount }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Indigent -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 hover:border-red-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Indigent</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{{ indigentCount }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Household Requests -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-amber-100 hover:border-amber-300 overflow-hidden" [routerLink]="['/admin/household-requests']">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Pending Household Requests</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{{ pendingHouseholdRequests }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Households -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-300 overflow-hidden" [routerLink]="['/admin/household-requests']">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Total Households</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ totalHouseholds }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Avg Members per Household -->
          <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-100 hover:border-emerald-300 overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Avg. Members/Household</p>
                <p class="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{{ avgHouseholdSize }}</p>
              </div>
              <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Priority Actions Widget -->
        <div class="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-2xl p-6 mb-6 shadow-lg shadow-red-500/20" *ngIf="priorityActions.length > 0">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="ml-3 font-bold text-lg text-red-900">Requires Immediate Attention</h3>
            <span class="ml-auto bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">{{ priorityActions.length }}</span>
          </div>
          <ul class="space-y-3">
            <li *ngFor="let action of priorityActions" 
                class="group flex items-start space-x-3 p-4 bg-white rounded-xl border-l-4 border-red-500 hover:bg-gradient-to-r hover:from-white hover:to-red-50 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                (click)="handlePriorityAction(action)">
              <div class="flex-shrink-0 mt-1">
                <div class="w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-md shadow-red-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-red-900 group-hover:text-red-700 transition-colors">{{ action.title }}</p>
                <p class="text-xs text-red-700 mt-1">{{ action.description }}</p>
                <p class="text-xs text-red-500 mt-1.5 font-medium">{{ action.timeAgo }}</p>
              </div>
              <div class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          </ul>
        </div>

        <!-- Top 5 Largest Households -->
        <div *ngIf="householdAnalytics" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Top 5 Largest Households
          </h3>
          <div class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rank</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Household Code</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Head of Household</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Members</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let household of householdAnalytics.topHouseholds; let i = index" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-800': i === 0,
                            'bg-gray-100 text-gray-800': i === 1,
                            'bg-orange-100 text-orange-800': i === 2,
                            'bg-blue-50 text-blue-600': i > 2
                          }">
                      {{ i + 1 }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900 font-semibold">{{ household.householdCode }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ household.headName }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ household.address }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {{ household.memberCount }} members
                    </span>
                  </td>
                </tr>
                <tr *ngIf="!householdAnalytics.topHouseholds || householdAnalytics.topHouseholds.length === 0" class="bg-gray-50">
                  <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">No household data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Activity & Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Recent Activity Column -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Recent Complaints -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex justify-between items-center mb-5">
                <h2 class="text-xl font-bold text-gray-900">Recent Complaints</h2>
                <a [routerLink]="['/admin/reports']" class="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">View All →</a>
              </div>
              <div *ngIf="recentComplaints.length === 0" class="text-gray-400 text-center py-8 font-medium">
                No complaints found
              </div>
              <ul *ngIf="recentComplaints.length > 0" class="space-y-3">
                <li *ngFor="let complaint of recentComplaints" class="group p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0 mr-3">
                      <p class="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{{ complaint.subject }}</p>
                      <p class="text-xs text-gray-500 mt-1 font-medium">{{ complaint.createdAt | date:'MMM d, y' }}</p>
                    </div>
                    <!-- Recent Complaints badge -->
                    <span 
                      class="px-3 py-1.5 text-xs font-bold rounded-full shadow-sm" 
                      [ngClass]="{
                        'bg-gradient-to-r from-yellow-400 to-amber-500 text-white': complaint.status === 'pending',
                        'bg-gradient-to-r from-blue-400 to-blue-600 text-white': complaint.status === 'in_review',
                        'bg-gradient-to-r from-green-400 to-emerald-600 text-white': complaint.status === 'resolved',
                        'bg-gradient-to-r from-red-400 to-rose-600 text-white': complaint.status === 'rejected'
                      }"
                    >
                      {{ complaint.status | statusFormat }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Recent Announcements -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex justify-between items-center mb-5">
                <h2 class="text-xl font-bold text-gray-900">Recent Announcements</h2>
                <a [routerLink]="['/admin/announcements']" class="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">View All →</a>
              </div>
              <div *ngIf="recentAnnouncements.length === 0" class="text-gray-400 text-center py-8 font-medium">
                No announcements found
              </div>
              <ul *ngIf="recentAnnouncements.length > 0" class="space-y-3">
                <li *ngFor="let announcement of recentAnnouncements" class="group p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 rounded-xl transition-all duration-300 border border-transparent hover:border-green-200">
                  <p class="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{{ announcement.title }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <p class="text-xs text-gray-500 font-medium">{{ announcement.createdAt | date:'MMM d, y' }}</p>
                    <!-- Recent Announcements badge -->
                    <span 
                      class="px-3 py-1 text-xs font-bold rounded-full shadow-sm"
                      [ngClass]="{
                        'bg-gradient-to-r from-green-400 to-emerald-600 text-white': announcement.status === 'active',
                        'bg-gradient-to-r from-gray-400 to-gray-600 text-white': announcement.status === 'archived'
                      }"
                    >
                      {{ announcement.status | statusFormat }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Residents by Gender -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Residents by Gender</h2>
              <div class="flex items-center">
                <div class="w-1/2 h-48">
                  <canvas id="genderChart"></canvas>
                </div>
                <div class="w-1/2 px-4">
                  <div class="flex items-center mb-3">
                    <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Male</span>
                      <span class="font-semibold">{{ genderStats.male }}</span>
                    </div>
                  </div>
                  <div class="flex items-center mb-3">
                    <div class="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Female</span>
                      <span class="font-semibold">{{ genderStats.female }}</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Other/Undisclosed</span>
                      <span class="font-semibold">{{ genderStats.other }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Housing Ownership -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Housing Ownership</h2>
              <div class="h-64">
                <canvas id="housingChart"></canvas>
              </div>
            </div>

            <!-- Children by Age Group -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Children by Age Group</h2>
              <div class="h-64">
                <canvas id="childrenAgeChart"></canvas>
              </div>
            </div>

            <!-- Employment Status -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Employment Status</h2>
              <div class="h-64">
                <canvas id="employmentChart"></canvas>
              </div>
            </div>

            <!-- Household Size Distribution -->
            <div *ngIf="householdAnalytics" class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Household Size Distribution</h2>
              <div class="h-64">
                <canvas id="householdSizeChart"></canvas>
              </div>
            </div>

            <!-- Household Heads by Gender -->
            <div *ngIf="householdAnalytics" class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Household Heads by Gender</h2>
              <div class="h-64">
                <canvas id="headGenderChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Charts Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Residents by Age Group -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Residents by Age Group</h2>
              <div class="h-48">
                <canvas id="ageGroupChart"></canvas>
              </div>
            </div>

            <!-- Educational Attainment -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Educational Attainment</h2>
              <div class="h-64">
                <canvas id="educationChart"></canvas>
              </div>
            </div>

            <!-- Detailed Age Distribution -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Detailed Age Distribution</h2>
              <div class="h-64">
                <canvas id="detailedAgeChart"></canvas>
              </div>
            </div>

            <!-- Youth Distribution -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Youth Distribution (13-30 years old)</h2>
              <div class="h-64">
                <canvas id="youthChart"></canvas>
              </div>
            </div>

            <!-- Years in Barangay -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Residency Duration</h2>
              <div class="h-64">
                <canvas id="yearsInBarangayChart"></canvas>
              </div>
            </div>

            <!-- Complaints by Month -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Complaint Trends (Last 6 Months)</h2>
              <div class="h-64">
                <canvas id="complaintsTimeChart"></canvas>
              </div>
            </div>

            <!-- Residents per Purok -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Residents per Purok</h2>
              <div class="h-64">
                <canvas id="purokChart"></canvas>
              </div>
            </div>

            <!-- Households by Purok -->
            <div *ngIf="householdAnalytics" class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Households by Purok</h2>
              <div class="h-64">
                <canvas id="householdsByPurokChart"></canvas>
              </div>
            </div>

            <!-- Household Heads by Age Group -->
            <div *ngIf="householdAnalytics" class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Household Heads by Age Group</h2>
              <div class="h-64">
                <canvas id="headAgeChart"></canvas>
              </div>
            </div>

            <!-- Newest Residents -->
            <div class="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900">Newest Residents</h2>
                <a [routerLink]="['/admin/residents']" class="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">View All →</a>
              </div>
              <div *ngIf="newestResidents.length === 0" class="text-gray-400 text-center py-8 font-medium">
                No residents found
              </div>
              <div *ngIf="newestResidents.length > 0" class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date Registered</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let resident of newestResidents" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden mr-3 shadow-md">
                            <img *ngIf="resident.profileImage" [src]="resident.profileImage" alt="Profile" class="w-full h-full object-cover">
                            <span *ngIf="!resident.profileImage" class="text-white font-bold text-sm">{{ resident.personalInfo.firstName.charAt(0) }}</span>
                          </div>
                          <span class="text-sm font-semibold text-gray-900">
                            {{ resident.personalInfo.firstName }} {{ resident.personalInfo.lastName }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {{ resident.personalInfo.contactNo }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {{ formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      min-height: 200px;
      height: 200px;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Statistics
  loading = true;
  totalResidents = 0;
  pendingResidentApprovals = 0;
  pendingComplaints = 0;
  pendingUpdateRequests = 0;
  newResidentsLastMonth = 0;

  // Household Statistics
  pendingHouseholdRequests = 0;
  totalHouseholds = 0;
  avgHouseholdSize = 0;

  // Phase 1 additions
  priorityActions: any[] = [];

  // Recent data
  newestResidents: ResidentInfo[] = [];
  recentComplaints: Complaint[] = [];
  recentAnnouncements: Announcement[] = [];

  // Stats for charts
  genderStats = {
    male: 0,
    female: 0,
    other: 0
  };

  ageGroups = {
    labels: ['0-12', '13-19', '20-35', '36-59', '60+'],
    data: [0, 0, 0, 0, 0]
  };

  // New comprehensive analytics
  seniorCitizensCount = 0;
  pwdCount = 0;
  fourPsCount = 0;
  soloParentCount = 0;
  indigentCount = 0;
  
  educationalAttainmentStats = {
    labels: ['Elementary', 'High School', 'College', 'Vocational'],
    data: [0, 0, 0, 0]
  };
  
  employmentStats = {
    labels: ['Employed', 'Unemployed', 'Self-Employed', 'OFW', 'Student', 'Retired', 'Housewife'],
    data: [0, 0, 0, 0, 0, 0, 0]
  };
  
  housingStats = {
    labels: ['Owned', 'Rented', 'Living with Relatives', 'Others'],
    data: [0, 0, 0, 0]
  };
  
  detailedAgeGroups = {
    labels: ['Children (0-12)', 'Youth (13-17)', 'Working Age (18-59)', 'Senior (60+)'],
    data: [0, 0, 0, 0]
  };
  
  youthDistribution = {
    labels: ['13-15', '16-18', '19-21', '22-24', '25-30'],
    data: [0, 0, 0, 0, 0]
  };

  yearsInBarangayStats = {
    labels: ['<1 year', '1-5 years', '6-10 years', '11-20 years', '20+ years'],
    data: [0, 0, 0, 0, 0]
  };

  childrenByAgeStats = {
    labels: ['Daycare (0-3)', 'Kinder (4-5)', 'Elementary (6-12)', 'Teens (13-17)'],
    data: [0, 0, 0, 0]
  };

  complaintsByMonthStats = {
    labels: [] as string[],
    data: [] as number[]
  };

  purokDistributionStats = {
    labels: [] as string[],
    data: [] as number[]
  };

  // Household Analytics
  householdAnalytics: any = null;
  private householdsByPurokChart: Chart | null = null;
  private householdSizeChart: Chart | null = null;
  private headGenderChart: Chart | null = null;
  private headAgeChart: Chart | null = null;

  private genderChart: Chart | null = null;
  private ageGroupChart: Chart | null = null;
  private educationChart: Chart | null = null;
  private employmentChart: Chart | null = null;
  private housingChart: Chart | null = null;
  private detailedAgeChart: Chart | null = null;
  private youthChart: Chart | null = null;
  private yearsInBarangayChart: Chart | null = null;
  private childrenAgeChart: Chart | null = null;
  private complaintsTimeChart: Chart | null = null;
  private purokChart: Chart | null = null;
  private chartsRendered = false;
  private refreshSubscription?: Subscription;

  constructor(
    private adminService: AdminService,
    private announcementService: AnnouncementService,
    private complaintService: ComplaintService,
    private residentUpdateService: ResidentUpdateService,
    private dataRefreshService: DataRefreshService,
    private householdService: HouseholdService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      // Load critical stats first for immediate display
      await this.loadCriticalStats();
      this.loading = false;
      
      // Load additional data in background
      this.loadBackgroundData();
      
      // Subscribe to dashboard stats refresh notifications
      this.refreshSubscription = this.dataRefreshService.onRefresh('dashboard-stats').subscribe(() => {
        this.loadCriticalStats();
        this.loadBackgroundData();
        this.loadPriorityActions(); // Refresh priority actions
      });
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      this.loading = false;
    }
  }

  private async loadCriticalStats() {
    try {
      // Load only essential stats for immediate display
      const [residentStats, announcements, pendingResidents, householdStats, pendingHouseholdMembers] = await Promise.all([
        this.adminService.getResidentStats(),
        this.announcementService.getActiveAnnouncements(),
        this.adminService.getPendingResidents(),
        this.householdService.getHouseholdStats(),
        this.householdService.getPendingHouseholdMembers()
      ]);

      // Set immediate stats
      this.totalResidents = (residentStats as any).total || 0;
      this.newResidentsLastMonth = (residentStats as any).recent || 0;
      this.pendingResidentApprovals = pendingResidents.length || 0;
      this.recentAnnouncements = announcements.slice(0, 3);
      
      // Set household stats
      this.pendingHouseholdRequests = pendingHouseholdMembers.length || 0;
      this.totalHouseholds = householdStats.totalHouseholds || 0;
      this.avgHouseholdSize = householdStats.avgHouseholdSize || 0;
    } catch (error) {
      console.error('Error loading critical stats:', error);
    }
  }

  private async loadBackgroundData() {
    try {
      // Load remaining data in background
      const [complaints, updateRequests, newestResidents] = await Promise.all([
        this.loadComplaints(),
        this.loadUpdateRequests(),
        this.adminService.getNewestResidents(5)
      ]);

      this.newestResidents = newestResidents;

      // Load Phase 1 features
      await this.loadPriorityActions();

      // Load full resident data for charts only if needed
      setTimeout(() => this.loadFullResidentDataForCharts(), 100);
    } catch (error) {
      console.error('Error loading background data:', error);
    }
  }

  private async loadFullResidentDataForCharts() {
    try {
      const residents = await this.adminService.getAllResidents();
      this.calculateGenderStats(residents);
      this.calculateAgeGroups(residents);
      this.calculateComprehensiveStats(residents);
      await this.calculateComplaintsByMonth();
      await this.loadHouseholdAnalytics();
      
      // Render charts after data is ready
      setTimeout(() => this.renderCharts(), 100);
    } catch (error) {
      console.error('Error loading full resident data for charts:', error);
    }
  }

  private async loadHouseholdAnalytics() {
    try {
      this.householdAnalytics = await this.householdService.getHouseholdAnalytics();
      console.log('Household analytics loaded:', this.householdAnalytics);
    } catch (error) {
      console.error('Error loading household analytics:', error);
    }
  }

  private calculateGenderStats(residents: ResidentInfo[]) {
    this.genderStats = { male: 0, female: 0, other: 0 };
    residents.forEach(resident => {
      if (resident.personalInfo.gender?.toLowerCase() === 'male') {
        this.genderStats.male++;
      } else if (resident.personalInfo.gender?.toLowerCase() === 'female') {
        this.genderStats.female++;
      } else {
        this.genderStats.other++;
      }
    });
  }

  private calculateAgeGroups(residents: ResidentInfo[]) {
    this.ageGroups.data = [0, 0, 0, 0, 0];
    residents.forEach(resident => {
      const age = this.calculateAge(resident.personalInfo.birthDate);
      if (age <= 12) {
        this.ageGroups.data[0]++;
      } else if (age <= 19) {
        this.ageGroups.data[1]++;
      } else if (age <= 35) {
        this.ageGroups.data[2]++;
      } else if (age <= 59) {
        this.ageGroups.data[3]++;
      } else {
        this.ageGroups.data[4]++;
      }
    });
  }

  private calculateComprehensiveStats(residents: ResidentInfo[]) {
    // Reset all stats
    this.seniorCitizensCount = 0;
    this.pwdCount = 0;
    this.fourPsCount = 0;
    this.soloParentCount = 0;
    this.indigentCount = 0;
    this.educationalAttainmentStats.data = [0, 0, 0, 0];
    this.employmentStats.data = [0, 0, 0, 0, 0, 0, 0];
    this.housingStats.data = [0, 0, 0, 0];
    this.detailedAgeGroups.data = [0, 0, 0, 0];
    this.youthDistribution.data = [0, 0, 0, 0, 0];
    this.yearsInBarangayStats.data = [0, 0, 0, 0, 0];
    this.childrenByAgeStats.data = [0, 0, 0, 0];

    residents.forEach(resident => {
      const age = this.calculateAge(resident.personalInfo.birthDate);

      // Senior Citizens (60+)
      if (age >= 60 || resident.personalInfo.seniorCitizen === 'Yes') {
        this.seniorCitizensCount++;
      }

      // PWD
      if (resident.personalInfo.pwd === 'Yes') {
        this.pwdCount++;
      }

      // 4Ps Members
      if (resident.personalInfo.fourPsMember === 'Yes') {
        this.fourPsCount++;
      }

      // Solo Parents
      if (resident.personalInfo.soloParent === 'Yes') {
        this.soloParentCount++;
      }

      // Indigent
      if (resident.personalInfo.indigent === 'Yes') {
        this.indigentCount++;
      }

      // Educational Attainment
      const education = resident.personalInfo.educationalAttainment;
      if (education === 'ElementaryGraduate') {
        this.educationalAttainmentStats.data[0]++;
      } else if (education === 'HighSchoolGraduate') {
        this.educationalAttainmentStats.data[1]++;
      } else if (education === 'CollegeGraduate') {
        this.educationalAttainmentStats.data[2]++;
      } else if (education === 'Vocational') {
        this.educationalAttainmentStats.data[3]++;
      }

      // Employment Status
      const employment = resident.personalInfo.employmentStatus;
      if (employment === 'Employed') {
        this.employmentStats.data[0]++;
      } else if (employment === 'Unemployed') {
        this.employmentStats.data[1]++;
      } else if (employment === 'SelfEmployed') {
        this.employmentStats.data[2]++;
      } else if (employment === 'OFW') {
        this.employmentStats.data[3]++;
      } else if (employment === 'Student') {
        this.employmentStats.data[4]++;
      } else if (employment === 'Retired') {
        this.employmentStats.data[5]++;
      } else if (employment === 'Housewife') {
        this.employmentStats.data[6]++;
      }

      // Housing Ownership
      const housing = resident.personalInfo.housingOwnership;
      if (housing === 'Owned') {
        this.housingStats.data[0]++;
      } else if (housing === 'Rented') {
        this.housingStats.data[1]++;
      } else if (housing === 'Living with Relatives') {
        this.housingStats.data[2]++;
      } else if (housing === 'Others') {
        this.housingStats.data[3]++;
      }

      // Detailed Age Groups
      if (age <= 12) {
        this.detailedAgeGroups.data[0]++;  // Children
      } else if (age <= 17) {
        this.detailedAgeGroups.data[1]++;  // Youth
      } else if (age <= 59) {
        this.detailedAgeGroups.data[2]++;  // Working Age
      } else {
        this.detailedAgeGroups.data[3]++;  // Senior
      }

      // Youth Distribution (13-30)
      if (age >= 13 && age <= 15) {
        this.youthDistribution.data[0]++;
      } else if (age >= 16 && age <= 18) {
        this.youthDistribution.data[1]++;
      } else if (age >= 19 && age <= 21) {
        this.youthDistribution.data[2]++;
      } else if (age >= 22 && age <= 24) {
        this.youthDistribution.data[3]++;
      } else if (age >= 25 && age <= 30) {
        this.youthDistribution.data[4]++;
      }

      // Years in Barangay
      const years = resident.personalInfo.yearsInBarangay || 0;
      if (years < 1) {
        this.yearsInBarangayStats.data[0]++;
      } else if (years <= 5) {
        this.yearsInBarangayStats.data[1]++;
      } else if (years <= 10) {
        this.yearsInBarangayStats.data[2]++;
      } else if (years <= 20) {
        this.yearsInBarangayStats.data[3]++;
      } else {
        this.yearsInBarangayStats.data[4]++;
      }

      // Children by Age Group
      if (age <= 3) {
        this.childrenByAgeStats.data[0]++;  // Daycare
      } else if (age <= 5) {
        this.childrenByAgeStats.data[1]++;  // Kinder
      } else if (age <= 12) {
        this.childrenByAgeStats.data[2]++;  // Elementary
      } else if (age <= 17) {
        this.childrenByAgeStats.data[3]++;  // Teens
      }
    });

    // Calculate Purok Distribution
    const purokCounts = new Map<string, number>();
    residents.forEach(resident => {
      const purokNo = resident.personalInfo.purokNo || 'Unassigned';
      purokCounts.set(purokNo, (purokCounts.get(purokNo) || 0) + 1);
    });

    // Sort puroks numerically
    const sortedPuroks = Array.from(purokCounts.keys()).sort((a, b) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return parseInt(a) - parseInt(b);
    });

    this.purokDistributionStats.labels = sortedPuroks.map(p => p === 'Unassigned' ? p : `Purok ${p}`);
    this.purokDistributionStats.data = sortedPuroks.map(p => purokCounts.get(p) || 0);
  }

  private async calculateComplaintsByMonth() {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      
      // Get last 6 months
      const monthsData = new Map<string, number>();
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthsData.set(monthKey, 0);
      }
      
      // Count complaints per month
      complaints.forEach(complaint => {
        const date = new Date(complaint.createdAt);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (monthsData.has(monthKey)) {
          monthsData.set(monthKey, (monthsData.get(monthKey) || 0) + 1);
        }
      });
      
      this.complaintsByMonthStats.labels = Array.from(monthsData.keys());
      this.complaintsByMonthStats.data = Array.from(monthsData.values());
    } catch (error) {
      console.error('Error calculating complaints by month:', error);
    }
  }

  ngAfterViewInit() {
    // Wait for Angular to finish rendering and data to be loaded
    setTimeout(() => {
      this.renderCharts();
    }, 400); // Increased delay for DOM/data readiness
  }

  ngAfterViewChecked() {
    if (!this.loading && !this.chartsRendered) {
      const genderCanvas = document.getElementById('genderChart');
      const ageCanvas = document.getElementById('ageGroupChart');
      if (genderCanvas && ageCanvas) {
        this.renderCharts();
        this.chartsRendered = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.genderChart) this.genderChart.destroy();
    if (this.ageGroupChart) this.ageGroupChart.destroy();
    if (this.educationChart) this.educationChart.destroy();
    if (this.employmentChart) this.employmentChart.destroy();
    if (this.housingChart) this.housingChart.destroy();
    if (this.detailedAgeChart) this.detailedAgeChart.destroy();
    if (this.youthChart) this.youthChart.destroy();
    if (this.yearsInBarangayChart) this.yearsInBarangayChart.destroy();
    if (this.childrenAgeChart) this.childrenAgeChart.destroy();
    if (this.complaintsTimeChart) this.complaintsTimeChart.destroy();
    if (this.purokChart) this.purokChart.destroy();
    if (this.householdsByPurokChart) this.householdsByPurokChart.destroy();
    if (this.householdSizeChart) this.householdSizeChart.destroy();
    if (this.headGenderChart) this.headGenderChart.destroy();
    if (this.headAgeChart) this.headAgeChart.destroy();
    this.refreshSubscription?.unsubscribe();
  }

  private async loadAnnouncements() {
    try {
      const announcements = await this.announcementService.getAllAnnouncements();
      
      // Get recent announcements
      this.recentAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  private async loadComplaints() {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      this.pendingComplaints = complaints.filter(c => 
        c.status === 'pending' || c.status === 'in_review'
      ).length;
      
      // Get recent complaints
      this.recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  }

  private async loadUpdateRequests() {
    try {
      const updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      this.pendingUpdateRequests = updateRequests.filter(request => 
        request.status === 'pending'
      ).length;
    } catch (error) {
      console.error('Error loading update requests:', error);
    }
  }

  private renderCharts() {
    this.renderGenderChart();
    this.renderAgeGroupChart();
    this.renderEducationChart();
    this.renderEmploymentChart();
    this.renderHousingChart();
    this.renderDetailedAgeChart();
    this.renderYouthChart();
    this.renderYearsInBarangayChart();
    this.renderChildrenAgeChart();
    this.renderComplaintsTimeChart();
    this.renderPurokChart();
    this.renderHouseholdCharts();
  }

  private renderHouseholdCharts() {
    if (!this.householdAnalytics) return;

    this.renderHouseholdsByPurokChart();
    this.renderHouseholdSizeChart();
    this.renderHeadGenderChart();
    this.renderHeadAgeChart();
  }

  private renderHouseholdsByPurokChart() {
    const canvas = document.getElementById('householdsByPurokChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.householdsByPurokChart) this.householdsByPurokChart.destroy();

    const labels = Object.keys(this.householdAnalytics.byPurok).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return parseInt(a) - parseInt(b);
    }).map(p => p === 'Unknown' ? p : `Purok ${p}`);
    
    const data = labels.map(label => {
      const purokNo = label === 'Unknown' ? 'Unknown' : label.replace('Purok ', '');
      return this.householdAnalytics.byPurok[purokNo] || 0;
    });

    this.householdsByPurokChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Households',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { size: 12 }, color: '#6B7280' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 11, weight: 500 as any }, color: '#374151', maxRotation: 45, minRotation: 45 },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderHouseholdSizeChart() {
    const canvas = document.getElementById('householdSizeChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.householdSizeChart) this.householdSizeChart.destroy();

    this.householdSizeChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.householdAnalytics.sizeDistribution),
        datasets: [{
          data: Object.values(this.householdAnalytics.sizeDistribution),
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(239, 68, 68, 0.85)'
          ],
          borderWidth: 3,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'bottom',
            labels: { padding: 15, font: { size: 11, weight: 500 as any }, color: '#374151', usePointStyle: true }
          },
          title: { display: false }
        },
        cutout: '60%'
      }
    });
  }

  private renderHeadGenderChart() {
    const canvas = document.getElementById('headGenderChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.headGenderChart) this.headGenderChart.destroy();

    this.headGenderChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [
            this.householdAnalytics.headDemographics.byGender.Male,
            this.householdAnalytics.headDemographics.byGender.Female
          ],
          backgroundColor: ['rgba(59, 130, 246, 0.85)', 'rgba(236, 72, 153, 0.85)'],
          borderWidth: 3,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'bottom',
            labels: { padding: 15, font: { size: 11, weight: 500 as any }, color: '#374151', usePointStyle: true }
          },
          title: { display: false }
        }
      }
    });
  }

  private renderHeadAgeChart() {
    const canvas = document.getElementById('headAgeChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.headAgeChart) this.headAgeChart.destroy();

    this.headAgeChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: Object.keys(this.householdAnalytics.headDemographics.byAgeGroup),
        datasets: [{
          label: 'Household Heads',
          data: Object.values(this.householdAnalytics.headDemographics.byAgeGroup),
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { size: 12 }, color: '#6B7280' },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 12, weight: 500 as any }, color: '#374151' },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderGenderChart() {
    const canvas = document.getElementById('genderChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Gender chart canvas not found');
      return;
    }
    if (this.genderChart) this.genderChart.destroy();

    // If all values are zero, Chart.js won't render. Add a dummy value for display.
    const data = [this.genderStats.male, this.genderStats.female, this.genderStats.other];
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0];

    this.genderChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          data: chartData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.9)',  // Blue gradient
            'rgba(236, 72, 153, 0.9)',  // Pink gradient
            'rgba(156, 163, 175, 0.9)'  // Gray gradient
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 15,
          hoverBorderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        cutout: '65%',
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  private renderAgeGroupChart() {
    const canvas = document.getElementById('ageGroupChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Age group chart canvas not found');
      return;
    }
    if (this.ageGroupChart) this.ageGroupChart.destroy();

    // If all values are zero, Chart.js won't render. Add a dummy value for display.
    const data = this.ageGroups.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0];

    this.ageGroupChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.ageGroups.labels,
        datasets: [{
          label: 'Residents',
          data: chartData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',   // blue
            'rgba(16, 185, 129, 0.85)',   // green
            'rgba(99, 102, 241, 0.85)',   // indigo
            'rgba(139, 92, 246, 0.85)',   // purple
            'rgba(245, 158, 11, 0.85)'    // amber
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderEducationChart() {
    const canvas = document.getElementById('educationChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Education chart canvas not found');
      return;
    }
    if (this.educationChart) this.educationChart.destroy();

    const data = this.educationalAttainmentStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0];

    this.educationChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.educationalAttainmentStats.labels,
        datasets: [{
          label: 'Residents',
          data: chartData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(139, 92, 246, 0.85)'
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderEmploymentChart() {
    const canvas = document.getElementById('employmentChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Employment chart canvas not found');
      return;
    }
    if (this.employmentChart) this.employmentChart.destroy();

    const data = this.employmentStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0, 0, 0];

    this.employmentChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: this.employmentStats.labels,
        datasets: [{
          data: chartData,
          backgroundColor: [
            'rgba(16, 185, 129, 0.9)',   // green - Employed
            'rgba(239, 68, 68, 0.9)',    // red - Unemployed
            'rgba(59, 130, 246, 0.9)',   // blue - Self-Employed
            'rgba(245, 158, 11, 0.9)',   // amber - OFW
            'rgba(99, 102, 241, 0.9)',   // indigo - Student
            'rgba(156, 163, 175, 0.9)',  // gray - Retired
            'rgba(236, 72, 153, 0.9)'    // pink - Housewife
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 12,
          hoverBorderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 11, weight: 500 as any },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        cutout: '60%',
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  private renderHousingChart() {
    const canvas = document.getElementById('housingChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Housing chart canvas not found');
      return;
    }
    if (this.housingChart) this.housingChart.destroy();

    const data = this.housingStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0];

    this.housingChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.housingStats.labels,
        datasets: [{
          data: chartData,
          backgroundColor: [
            'rgba(16, 185, 129, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(156, 163, 175, 0.9)'
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 12,
          hoverBorderWidth: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true,
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 11, weight: 500 as any },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  private renderDetailedAgeChart() {
    const canvas = document.getElementById('detailedAgeChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Detailed age chart canvas not found');
      return;
    }
    if (this.detailedAgeChart) this.detailedAgeChart.destroy();

    const data = this.detailedAgeGroups.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0];

    this.detailedAgeChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.detailedAgeGroups.labels,
        datasets: [{
          label: 'Population',
          data: chartData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(139, 92, 246, 0.85)'
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderYouthChart() {
    const canvas = document.getElementById('youthChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Youth chart canvas not found');
      return;
    }
    if (this.youthChart) this.youthChart.destroy();

    const data = this.youthDistribution.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0];

    this.youthChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.youthDistribution.labels,
        datasets: [{
          label: 'Youth Population',
          data: chartData,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  private renderYearsInBarangayChart() {
    const canvas = document.getElementById('yearsInBarangayChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Years in barangay chart canvas not found');
      return;
    }
    if (this.yearsInBarangayChart) this.yearsInBarangayChart.destroy();

    const data = this.yearsInBarangayStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0];

    this.yearsInBarangayChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.yearsInBarangayStats.labels,
        datasets: [{
          label: 'Residents',
          data: chartData,
          backgroundColor: [
            'rgba(239, 68, 68, 0.85)',   // red - new
            'rgba(245, 158, 11, 0.85)',  // amber
            'rgba(16, 185, 129, 0.85)',  // green
            'rgba(59, 130, 246, 0.85)',  // blue
            'rgba(139, 92, 246, 0.85)'   // purple - long-time
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderChildrenAgeChart() {
    const canvas = document.getElementById('childrenAgeChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Children age chart canvas not found');
      return;
    }
    if (this.childrenAgeChart) this.childrenAgeChart.destroy();

    const data = this.childrenByAgeStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0];

    this.childrenAgeChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.childrenByAgeStats.labels,
        datasets: [{
          label: 'Children',
          data: chartData,
          backgroundColor: [
            'rgba(236, 72, 153, 0.85)',
            'rgba(244, 114, 182, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(96, 165, 250, 0.85)'
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private renderComplaintsTimeChart() {
    const canvas = document.getElementById('complaintsTimeChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Complaints time chart canvas not found');
      return;
    }
    if (this.complaintsTimeChart) this.complaintsTimeChart.destroy();

    const data = this.complaintsByMonthStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0, 0];

    this.complaintsTimeChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.complaintsByMonthStats.labels,
        datasets: [{
          label: 'Complaints',
          data: chartData,
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 12, weight: 500 as any },
              color: '#374151'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  private renderPurokChart() {
    const canvas = document.getElementById('purokChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Purok chart canvas not found');
      return;
    }
    if (this.purokChart) this.purokChart.destroy();

    const data = this.purokDistributionStats.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1];
    const labels = hasData ? this.purokDistributionStats.labels : ['No Data'];

    // Generate gradient colors for each purok
    const colors = [
      'rgba(59, 130, 246, 0.85)',   // Blue
      'rgba(16, 185, 129, 0.85)',   // Green
      'rgba(245, 158, 11, 0.85)',   // Amber
      'rgba(139, 92, 246, 0.85)',   // Purple
      'rgba(236, 72, 153, 0.85)',   // Pink
      'rgba(20, 184, 166, 0.85)',   // Teal
      'rgba(251, 146, 60, 0.85)',   // Orange
      'rgba(99, 102, 241, 0.85)',   // Indigo
      'rgba(244, 63, 94, 0.85)',    // Rose
      'rgba(34, 197, 94, 0.85)',    // Emerald
      'rgba(168, 85, 247, 0.85)',   // Violet
      'rgba(14, 165, 233, 0.85)',   // Sky
      'rgba(234, 179, 8, 0.85)',    // Yellow
      'rgba(239, 68, 68, 0.85)',    // Red
      'rgba(156, 163, 175, 0.85)'   // Gray for Unassigned
    ];

    const backgroundColors = labels.map((_, index) => colors[index % colors.length]);

    this.purokChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Residents',
          data: chartData,
          backgroundColor: backgroundColors,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return `Residents: ${value} (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              precision: 0,
              font: { size: 12 },
              color: '#6B7280'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: { size: 11, weight: 500 as any },
              color: '#374151',
              maxRotation: 45,
              minRotation: 45
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  calculateAge(birthDate: string | undefined): number {
    if (!birthDate) return 0;
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  }

  // Phase 1 Methods
  handlePriorityAction(action: any): void {
    // Handle priority action click - navigate to appropriate page
    if (action.route) {
      // Use router to navigate
      window.location.href = action.route;
    }
  }

  private async loadPriorityActions(): Promise<void> {
    try {
      this.priorityActions = [];

      // Check for urgent items that need immediate attention
      
      // 1. Check for pending approvals older than 7 days
      const pendingResidents = await this.adminService.getPendingResidents();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const oldPendingResidents = pendingResidents.filter(resident => {
        const createdAt = new Date(resident.$createdAt || '');
        return createdAt < sevenDaysAgo;
      });

      if (oldPendingResidents.length > 0) {
        this.priorityActions.push({
          title: `${oldPendingResidents.length} Resident Approvals Overdue`,
          description: 'Some resident registrations have been pending for more than 7 days',
          timeAgo: 'Over 7 days ago',
          route: '/admin/residents?filter=pending',
          type: 'approval'
        });
      }

      // 2. Check for unresolved complaints older than 5 days
      const complaints = await this.complaintService.getAllComplaints();
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      
      const oldComplaints = complaints.filter(complaint => {
        const createdAt = new Date(complaint.createdAt);
        return createdAt < fiveDaysAgo && (complaint.status === 'pending' || complaint.status === 'in_review');
      });

      if (oldComplaints.length > 0) {
        this.priorityActions.push({
          title: `${oldComplaints.length} Unresolved Complaints`,
          description: 'Some complaints have been pending for more than 5 days',
          timeAgo: 'Over 5 days ago',
          route: '/admin/reports?status=pending',
          type: 'complaint'
        });
      }

      // 3. Check for pending update requests older than 3 days
      const updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const oldUpdateRequests = updateRequests.filter(request => {
        const createdAt = new Date(request.createdAt);
        return createdAt < threeDaysAgo && request.status === 'pending';
      });

      if (oldUpdateRequests.length > 0) {
        this.priorityActions.push({
          title: `${oldUpdateRequests.length} Update Requests Pending`,
          description: 'Some update requests have been pending for more than 3 days',
          timeAgo: 'Over 3 days ago',
          route: '/admin/update-requests',
          type: 'update'
        });
      }

    } catch (error) {
      console.error('Error loading priority actions:', error);
    }
  }
}
