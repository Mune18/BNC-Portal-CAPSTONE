import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { DataRefreshService } from '../../shared/services/data-refresh.service';
import { Announcement } from '../../shared/types/announcement';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center min-h-screen">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p class="text-gray-600 font-medium">Loading announcements...</p>
        </div>
      </div>

      <div *ngIf="!loading">
        <!-- Hero Header Section -->
        <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
          <!-- Background Pattern with Barangay Logos -->
          <div class="absolute inset-0 opacity-2.5">
            <div class="w-full h-full" style="background-image: 
              url('/assets/BNC_Portal_Logo.png'), 
              url('/assets/Olongapo_City_Logo.png');
              background-size: 80px 80px, 60px 60px;
              background-position: 0 0, 40px 40px;
              background-repeat: repeat;">
            </div>
          </div>
          
          <!-- Additional scattered logos for better coverage -->
          <div class="absolute inset-0 opacity-2.5">
            <div class="w-full h-full" style="background-image: 
              url('/assets/BNC_Portal_Logo.png');
              background-size: 50px 50px;
              background-position: 60px 20px;
              background-repeat: repeat;">
            </div>
          </div>
          
          <div class="relative container mx-auto px-4 py-8 md:py-12">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
              <!-- Welcome Content -->
              <div class="text-center md:text-left flex-1">

                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  Welcome to <span class="text-yellow-300">BNC Portal</span>
                </h1>
                <p class="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 leading-relaxed">
                  Stay connected with your community. Access important announcements, services, and emergency information all in one place.
                </p>
              </div>

              <!-- Emergency Contact Button -->
              <div class="flex justify-center md:justify-end">
                <button
                  class="group bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
                  (click)="showEmergencyContact = true"
                >
                  <svg class="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Emergency Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Container -->
        <div class="container mx-auto px-4 py-8 md:py-12">
          <!-- Announcements Section -->
          <div *ngIf="announcements.length > 0">
            <!-- Section Header -->
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Latest Announcements</h2>
                <p class="text-gray-600">Stay updated with important community news and updates</p>
              </div>
              <div class="hidden md:flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ announcements.length }} announcement{{ announcements.length !== 1 ? 's' : '' }}
              </div>
            </div>

            <!-- Desktop Layout (Hidden on Mobile) -->
            <div class="hidden lg:block">
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Main Content Area -->
                <div class="lg:col-span-3 space-y-8">
                  <!-- Latest Announcement -->
                  <div 
                    *ngIf="getLatestAnnouncement()" 
                    class="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    (click)="openAnnouncement(getLatestAnnouncement()!)"
                  >
                    <div class="flex flex-col md:flex-row h-full">
                      <!-- Content -->
                      <div class="flex-1 p-8">
                        <div class="flex items-center space-x-2 mb-4">
                          <span class="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full animate-pulse">
                            LATEST ANNOUNCEMENT
                          </span>
                          <span class="text-sm text-gray-500">{{ getLatestAnnouncement()!.createdAt | date:'mediumDate' }}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {{ getLatestAnnouncement()!.title }}
                        </h3>
                        <p class="text-gray-700 mb-6 line-clamp-3 leading-relaxed">{{ getLatestAnnouncement()!.content }}</p>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center text-sm text-gray-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ getLatestAnnouncement()!.createdAt | date:'shortTime' }}
                          </div>
                          <div class="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                            <span class="mr-2">Read more</span>
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <!-- Image -->
                      <div class="md:w-80 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <img 
                          *ngIf="getLatestAnnouncement()!.image" 
                          [src]="getImageUrl(getLatestAnnouncement()!.image)" 
                          class="w-full h-full object-cover" 
                          alt="Announcement image"
                        >
                        <div *ngIf="!getLatestAnnouncement()!.image" class="text-center p-8">
                          <svg class="w-24 h-24 text-green-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                          <p class="text-green-400 font-medium">Latest Announcement</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Recent Announcements Section -->
                  <div *ngIf="getRecentAnnouncements().length > 0">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="text-2xl font-bold text-gray-900">Recent Announcements</h3>
                      <div class="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                        This Week ({{ getRecentAnnouncements().length }})
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div
                        *ngFor="let announcement of getRecentAnnouncements()"
                        class="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        (click)="openAnnouncement(announcement)"
                      >
                        <!-- Card Image -->
                        <div class="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden">
                          <img 
                            *ngIf="announcement.image" 
                            [src]="getImageUrl(announcement.image)" 
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            alt="Announcement image"
                          >
                          <div *ngIf="!announcement.image" class="text-center p-6">
                            <svg class="w-16 h-16 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            <p class="text-blue-400 font-medium text-sm">Announcement</p>
                          </div>
                        </div>
                        
                        <!-- Card Content -->
                        <div class="p-6">
                          <div class="flex items-center space-x-2 mb-3">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                              ANNOUNCEMENT
                            </span>
                            <span class="text-xs text-gray-500">{{ announcement.createdAt | date:'MMM d' }}</span>
                          </div>
                          
                          <h4 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {{ announcement.title }}
                          </h4>
                          
                          <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ announcement.content }}</p>
                          
                          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex items-center text-xs text-gray-500">
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              {{ announcement.createdAt | date:'shortTime' }}
                            </div>
                            <div class="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                              <span class="mr-1">Read</span>
                              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                  <!-- Quick Stats -->
                  <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      Community Updates
                    </h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span class="text-sm font-medium text-blue-900">Total Announcements</span>
                        <span class="text-lg font-bold text-blue-600">{{ announcements.length }}</span>
                      </div>
                      <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span class="text-sm font-medium text-green-900">This Week</span>
                        <span class="text-lg font-bold text-green-600">{{ getWeeklyCount() }}</span>
                      </div>
                      <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span class="text-sm font-medium text-orange-900">Recent Posts</span>
                        <span class="text-lg font-bold text-orange-600">{{ getRecentAnnouncements().length }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Old Announcements List -->
                  <div class="bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-semibold text-gray-900">Old Announcements</h4>
                      <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {{ getAllOldAnnouncements().length }}
                      </div>
                    </div>
                    <div>
                      <div
                        *ngFor="let announcement of getOldAnnouncements()"
                        class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                        (click)="openAnnouncement(announcement)"
                      >
                        <h5 class="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 line-clamp-2">
                          {{ announcement.title }}
                        </h5>
                        <p class="text-xs text-gray-500">{{ announcement.createdAt | date:'mediumDate' }}</p>
                      </div>
                      <div *ngIf="getAllOldAnnouncements().length === 0" class="text-center py-4">
                        <p class="text-gray-500 text-sm">No old announcements</p>
                      </div>
                      <div *ngIf="getAllOldAnnouncements().length > 5" class="pt-3 border-t border-gray-100">
                        <button
                          (click)="openOldAnnouncementsModal()"
                          class="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>View All Old Announcements</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile Layout (Visible on Mobile) -->
            <div class="lg:hidden space-y-6">
              <!-- Latest Announcement Mobile -->
              <div 
                *ngIf="getLatestAnnouncement()"
                class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer transform active:scale-95"
                (click)="openAnnouncement(getLatestAnnouncement()!)"
              >
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-2 flex-1">
                      <span class="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                        LATEST ANNOUNCEMENT
                      </span>
                    </div>
                    <span class="text-xs text-gray-500 flex-shrink-0">{{ getLatestAnnouncement()!.createdAt | date:'MMM d' }}</span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 mb-3 leading-tight">{{ getLatestAnnouncement()!.title }}</h3>
                  <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ getLatestAnnouncement()!.content }}</p>
                  
                  <!-- Image Preview -->
                  <div *ngIf="getLatestAnnouncement()!.image" class="mb-4 rounded-xl overflow-hidden">
                    <img 
                      [src]="getImageUrl(getLatestAnnouncement()!.image)" 
                      class="w-full h-48 object-cover" 
                      alt="Announcement image"
                    >
                  </div>
                  
                  <!-- Footer -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ getLatestAnnouncement()!.createdAt | date:'shortTime' }}
                    </div>
                    <div class="flex items-center text-green-600 text-sm font-medium">
                      <span class="mr-1">Tap to read</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Announcements Mobile -->
              <div *ngIf="getRecentAnnouncements().length > 0" class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-bold text-gray-900">Recent This Week</h3>
                  <span class="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">{{ getRecentAnnouncements().length }}</span>
                </div>
                <div
                  *ngFor="let announcement of getRecentAnnouncements()"
                  class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer transform active:scale-95"
                  (click)="openAnnouncement(announcement)"
                >
                  <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center space-x-2 flex-1">
                        <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          RECENT
                        </span>
                      </div>
                      <span class="text-xs text-gray-500 flex-shrink-0">{{ announcement.createdAt | date:'MMM d' }}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-gray-900 mb-3 leading-tight">{{ announcement.title }}</h3>
                    <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ announcement.content }}</p>
                    
                    <!-- Image Preview -->
                    <div *ngIf="announcement.image" class="mb-4 rounded-xl overflow-hidden">
                      <img 
                        [src]="getImageUrl(announcement.image)" 
                        class="w-full h-48 object-cover" 
                        alt="Announcement image"
                      >
                    </div>
                    
                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div class="flex items-center text-xs text-gray-500">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ announcement.createdAt | date:'shortTime' }}
                      </div>
                      <div class="flex items-center text-blue-600 text-sm font-medium">
                        <span class="mr-1">Tap to read</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="announcements.length === 0" class="text-center py-16">
            <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">No announcements yet</h3>
              <p class="text-gray-600 mb-6">Stay tuned for important updates and announcements from your community.</p>
              <button 
                (click)="loadAnnouncements()" 
                class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency Contact Modal -->
      <div
        *ngIf="showEmergencyContact"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/40" (click)="closeEmergencyContact()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg class="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Emergency Contacts
            </h2>
            <button
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              (click)="closeEmergencyContact()"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- Modal Body -->
          <div class="p-6">
            <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p class="text-red-800 font-medium text-sm">For immediate emergency assistance</p>
              </div>
            </div>
            <img 
              src="/assets/emergency-hotlines.jpg" 
              alt="Emergency Hotlines" 
              class="w-full h-auto rounded-xl shadow-lg"
              onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block'"
            >
            <div style="display: none;" class="bg-gradient-to-br from-red-100 to-orange-100 p-8 rounded-xl text-center">
              <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <p class="text-red-600 font-semibold">Emergency Hotlines</p>
              <p class="text-red-500 text-sm mt-2">Contact information will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcement Detail Modal -->
      <div
        *ngIf="selectedAnnouncement"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/40" (click)="closeAnnouncement()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl z-10 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                  ANNOUNCEMENT
                </span>
                <span class="text-sm text-gray-500">{{ selectedAnnouncement.createdAt | date:'mediumDate' }}</span>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
                (click)="closeAnnouncement()"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="p-6 md:p-8 space-y-6">
            <!-- Title Section -->
            <div class="space-y-4">
              <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {{ selectedAnnouncement.title }}
              </h2>
              
              <!-- Meta Information -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Published {{ selectedAnnouncement.createdAt | date:'medium' }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <span>Community Announcement</span>
                </div>
              </div>
            </div>
            
            <!-- Image Section -->
            <div *ngIf="selectedAnnouncement.image" class="flex justify-center">
              <div class="max-w-2xl w-full rounded-2xl p-3">
                <img 
                  [src]="getImageUrl(selectedAnnouncement.image)" 
                  class="w-full h-auto object-contain max-h-80 rounded-xl bg-white shadow-md" 
                  alt="Announcement image"
                >
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="prose prose-lg max-w-none">
              <div class="bg-gray-50 rounded-xl p-6 md:p-8">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Announcement Details</h3>
                    <p class="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">{{ selectedAnnouncement.content }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer Actions -->
            <div class="pt-6 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Last updated: {{ selectedAnnouncement.createdAt | date:'short' }}</span>
                </div>
                <div class="flex gap-3">
                  <button
                    (click)="closeAnnouncement()"
                    class="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium text-sm"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Old Announcements Modal -->
      <div
        *ngIf="showOldAnnouncementsModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 backdrop-blur-md bg-black/40" (click)="closeOldAnnouncementsModal()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl z-10 max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Old Announcements Archive</h2>
                  <p class="text-sm text-gray-500">Browse all past announcements</p>
                </div>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
                (click)="closeOldAnnouncementsModal()"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Date Filter Section -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label for="dateFilter" class="text-sm font-medium text-gray-700">Filter by date:</label>
                  <div class="flex gap-2">
                    <input
                      id="dateFilter"
                      type="date"
                      [(ngModel)]="selectedDate"
                      (ngModelChange)="onDateFilterChange()"
                      class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                    <button
                      *ngIf="selectedDate"
                      (click)="clearDateFilter()"
                      class="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
                      title="Clear date filter"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex items-center text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
                <span class="font-medium">{{ filteredOldAnnouncements.length }}</span>
                <span class="ml-1">announcement{{ filteredOldAnnouncements.length !== 1 ? 's' : '' }}</span>
                <span *ngIf="selectedDate" class="ml-1">on {{ selectedDate | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Announcements Grid -->
            <div *ngIf="filteredOldAnnouncements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                *ngFor="let announcement of filteredOldAnnouncements"
                class="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                (click)="openAnnouncement(announcement); closeOldAnnouncementsModal()"
              >
                <!-- Card Image -->
                <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    *ngIf="announcement.image" 
                    [src]="getImageUrl(announcement.image)" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt="Announcement image"
                  >
                  <div *ngIf="!announcement.image" class="text-center p-6">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <p class="text-gray-400 font-medium text-sm">Archive</p>
                  </div>
                </div>
                
                <!-- Card Content -->
                <div class="p-6">
                  <div class="flex items-center space-x-2 mb-3">
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      ARCHIVED
                    </span>
                    <span class="text-xs text-gray-500">{{ announcement.createdAt | date:'MMM d, y' }}</span>
                  </div>
                  
                  <h4 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {{ announcement.title }}
                  </h4>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ announcement.content }}</p>
                  
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ announcement.createdAt | date:'shortTime' }}
                    </div>
                    <div class="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      <span class="mr-1">Read</span>
                      <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredOldAnnouncements.length === 0" class="text-center py-16">
              <div class="max-w-md mx-auto">
                <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">
                  {{ selectedDate ? 'No announcements found for this date' : 'No old announcements yet' }}
                </h3>
                <p class="text-gray-600 mb-6">
                  {{ selectedDate 
                    ? 'Try selecting a different date to find announcements.' 
                    : 'Old announcements will appear here as new ones are published.' 
                  }}
                </p>
                <button
                  *ngIf="selectedDate"
                  (click)="clearDateFilter()"
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                >
                  Clear Date Filter
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                <span class="font-medium">{{ getAllOldAnnouncements().length }}</span> total old announcements
              </div>
              <button
                (click)="closeOldAnnouncementsModal()"
                class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fixed {
      position: fixed;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .z-50 {
      z-index: 50;
    }
    .max-w-screen-md {
      max-width: 450px;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  loading = true;
  selectedAnnouncement: Announcement | null = null;
  showEmergencyContact = false;
  showAllOldAnnouncements = false;
  showOldAnnouncementsModal = false;
  selectedDate: string = '';
  filteredOldAnnouncements: Announcement[] = [];
  private refreshSubscription?: Subscription;

  constructor(
    private announcementService: AnnouncementService,
    private dataRefreshService: DataRefreshService
  ) {}

  async ngOnInit() {
    // Show content immediately, load announcements in background
    this.loading = false;
    this.loadAnnouncements();
    
    // Subscribe to refresh notifications
    this.refreshSubscription = this.dataRefreshService.onRefresh('announcements').subscribe(() => {
      this.loadAnnouncements();
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  async loadAnnouncements() {
    try {
      this.loading = true;
      this.announcements = await this.announcementService.getActiveAnnouncements();
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      this.loading = false;
    }
  }

  openAnnouncement(announcement: Announcement) {
    this.selectedAnnouncement = announcement;
  }

  closeAnnouncement() {
    this.selectedAnnouncement = null;
  }

  closeEmergencyContact() {
    this.showEmergencyContact = false;
  }

  getImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return '';
    return this.announcementService.getImageUrl(imageUrl);
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getWeeklyCount(): number {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = this.getEndOfWeek();
    
    return this.announcements.filter(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      return announcementDate >= startOfWeek && announcementDate <= endOfWeek;
    }).length;
  }

  getLatestAnnouncement(): Announcement | null {
    if (this.announcements.length === 0) return null;
    // Sort by creation date descending and get the most recent one
    const sorted = [...this.announcements].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0];
  }

  getRecentAnnouncements(): Announcement[] {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = this.getEndOfWeek();
    const latestAnnouncement = this.getLatestAnnouncement();
    
    return this.announcements.filter(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      const isThisWeek = announcementDate >= startOfWeek && announcementDate <= endOfWeek;
      const isNotLatest = latestAnnouncement ? announcement.$id !== latestAnnouncement.$id : true;
      return isThisWeek && isNotLatest;
    }).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 9); // Show up to 9 recent announcements
  }

  getOldAnnouncements(): Announcement[] {
    const startOfWeek = this.getStartOfWeek();
    
    const oldAnnouncements = this.announcements.filter(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      return announcementDate < startOfWeek;
    }).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Return all if showAllOldAnnouncements is true, otherwise limit to 5
    return this.showAllOldAnnouncements ? oldAnnouncements : oldAnnouncements.slice(0, 5);
  }

  getAllOldAnnouncements(): Announcement[] {
    const startOfWeek = this.getStartOfWeek();
    
    return this.announcements.filter(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      return announcementDate < startOfWeek;
    }).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  toggleShowAllOldAnnouncements(): void {
    this.showAllOldAnnouncements = !this.showAllOldAnnouncements;
  }

  openOldAnnouncementsModal(): void {
    this.showOldAnnouncementsModal = true;
    this.filteredOldAnnouncements = this.getAllOldAnnouncements();
    this.selectedDate = '';
  }

  closeOldAnnouncementsModal(): void {
    this.showOldAnnouncementsModal = false;
    this.selectedDate = '';
    this.filteredOldAnnouncements = [];
  }

  onDateFilterChange(): void {
    if (!this.selectedDate) {
      this.filteredOldAnnouncements = this.getAllOldAnnouncements();
      return;
    }

    const selectedDateObj = new Date(this.selectedDate);
    const startOfDay = new Date(selectedDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    this.filteredOldAnnouncements = this.getAllOldAnnouncements().filter(announcement => {
      const announcementDate = new Date(announcement.createdAt);
      return announcementDate >= startOfDay && announcementDate <= endOfDay;
    });
  }

  clearDateFilter(): void {
    this.selectedDate = '';
    this.filteredOldAnnouncements = this.getAllOldAnnouncements();
  }

  private getStartOfWeek(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Start of day
    return startOfWeek;
  }

  private getEndOfWeek(): Date {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999); // End of day
    return endOfWeek;
  }
}
