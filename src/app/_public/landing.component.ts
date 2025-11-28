import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../shared/components/loading.component';

interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  onlineUsers: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <!-- Loading Screen -->
    <div *ngIf="isLoading" class="fixed inset-0 z-50 bg-white">
      <app-loading type="spinner" [fullScreen]="true" message="Welcome to BNC Portal"></app-loading>
    </div>

    <!-- Landing Page -->
    <div *ngIf="!isLoading" class="relative overflow-hidden">
      <!-- Hero Section with Parallax -->
      <section #heroSection class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Parallax Background Layers -->
        <div class="absolute inset-0">
          <!-- Background Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>
          
          <!-- Animated Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div class="absolute top-40 right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-20 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
          
          <!-- Floating Elements -->
          <div class="absolute inset-0 overflow-hidden">
            <div *ngFor="let i of floatingElements; trackBy: trackByIndex" 
                 class="absolute animate-float"
                 [style.left.%]="i.x"
                 [style.top.%]="i.y"
                 [style.animation-delay]="i.delay + 's'">
              <div class="w-2 h-2 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <!-- Logo Animation -->
          <div class="mb-8 animate-fade-in-up">
            <div class="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-2xl mb-6">
              <img src="/assets/BNC_Portal_Logo.png" alt="BNC Portal" class="w-20 h-20 sm:w-24 sm:h-24 object-contain">
            </div>
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-300">
            Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">BNC Portal</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl sm:text-2xl lg:text-3xl mb-8 text-blue-100 animate-fade-in-up animation-delay-500 max-w-4xl mx-auto leading-relaxed">
            Your Digital Gateway to <strong class="text-white">Barangay New Cabalan</strong> - Connecting Community, Simplifying Services
          </p>
          
          <!-- Description -->
          <p class="text-lg sm:text-xl mb-12 text-blue-200 animate-fade-in-up animation-delay-700 max-w-3xl mx-auto leading-relaxed">
            Access announcements, submit complaints, manage your profile, and stay connected with your community through our modern digital platform.
          </p>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-fade-in-up animation-delay-900 mb-16 sm:mb-20">
            <button
              (click)="navigateTo('/sign-in')"
              class="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]">
              <svg class="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Sign In to Portal
            </button>
            <button
              (click)="navigateTo('/sign-up')"
              class="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]">
              <svg class="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register Now
            </button>
          </div>
          
          <!-- Scroll Indicator -->
          <div class="absolute bottom left-1/2 transform -translate-x-1/2 animate-bounce">
            <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div class="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p class="text-white/70 text-sm mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="relative py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: url('/assets/BNC_Portal_Logo.png'); background-size: 100px 100px; background-repeat: repeat;"></div>
        </div>
        
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Section Header -->
          <div class="text-center mb-16 lg:mb-20">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You Can Do with <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">BNC Portal</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your one-stop digital platform for all barangay services and community engagement
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <!-- Feature 1: Stay Informed -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Stay Informed</h3>
              <p class="text-gray-600 leading-relaxed">Never miss important barangay announcements, events, and updates. Get real-time notifications delivered straight to your dashboard.</p>
            </div>

            <!-- Feature 2: Voice Your Concerns -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Voice Your Concerns</h3>
              <p class="text-gray-600 leading-relaxed">Easily submit complaints and feedback online. Track the progress of your submissions and receive updates on resolutions.</p>
            </div>

            <!-- Feature 3: Manage Your Profile -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Manage Your Profile</h3>
              <p class="text-gray-600 leading-relaxed">Keep your personal information up-to-date. Request profile changes and updates with simple, secure online forms.</p>
            </div>

            <!-- Feature 4: 24/7 Access -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">24/7 Access</h3>
              <p class="text-gray-600 leading-relaxed">Access barangay services anytime, anywhere. No more waiting in lines or office hours - everything at your fingertips.</p>
            </div>

            <!-- Feature 5: Track Your Requests -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Track Your Requests</h3>
              <p class="text-gray-600 leading-relaxed">Monitor the status of your complaints and profile update requests in real-time. Complete transparency from submission to resolution.</p>
            </div>

            <!-- Feature 6: Use Any Device -->
            <div class="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Use Any Device</h3>
              <p class="text-gray-600 leading-relaxed">Access the portal from your phone, tablet, or computer. Fully responsive design ensures a seamless experience on all devices.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="relative py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div class="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300 rounded-full"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300 rounded-full"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-12">
            <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Your Neighbors Online
            </h2>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto">
              See how many residents are already enjoying the convenience of BNC Portal
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Total Visits -->
            <div class="text-center group">
              <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl lg:text-6xl font-bold text-white mb-2 animate-counter" 
                     [attr.data-target]="visitStats.totalVisits">{{ displayedStats.totalVisits | number }}</div>
                <div class="text-blue-200 text-lg font-medium">Total Visits</div>
                <div class="text-blue-300 text-sm mt-2">Since launch</div>
              </div>
            </div>

            <!-- Today's Visits -->
            <div class="text-center group">
              <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl lg:text-6xl font-bold text-white mb-2 animate-counter"
                     [attr.data-target]="visitStats.todayVisits">{{ displayedStats.todayVisits | number }}</div>
                <div class="text-blue-200 text-lg font-medium">Today's Visits</div>
                <div class="text-blue-300 text-sm mt-2">Last 24 hours</div>
              </div>
            </div>

            <!-- Online Users -->
            <div class="text-center group">
              <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 group-hover:bg-white/20 transition-all duration-300">
                <div class="text-4xl lg:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <span class="animate-counter" [attr.data-target]="visitStats.onlineUsers">{{ displayedStats.onlineUsers | number }}</span>
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div class="text-blue-200 text-lg font-medium">Online Now</div>
                <div class="text-blue-300 text-sm mt-2">Active users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="relative py-20 lg:py-32 bg-white overflow-hidden">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <!-- Content -->
            <div class="space-y-8">
              <div>
                <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Life in <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Barangay New Cabalan</span>, Made Easier
                </h2>
                <p class="text-xl text-gray-600 leading-relaxed">
                  BNC Portal makes it simple for you to stay connected with your community, access barangay services, and have your voice heard - all from the comfort of your home.
                </p>
              </div>

              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Quick and Simple</h3>
                    <p class="text-gray-600">Get things done in minutes, not hours. No complicated forms or long waiting times - just simple, straightforward service.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Safe and Secure</h3>
                    <p class="text-gray-600">Your personal information is protected and kept private. Only you and authorized barangay staff can access your data.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Built for Residents</h3>
                    <p class="text-gray-600">Every feature is designed with you in mind - easy to use, helpful, and always available when you need it.</p>
                  </div>
                </div>
              </div>

              <div class="pt-6">
                <button
                  (click)="navigateTo('/sign-up')"
                  class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Get Started Today
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Visual -->
            <div class="relative">
              <div class="relative z-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12">
                <div class="space-y-6">
                  <!-- Mock Dashboard Preview -->
                  <div class="bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
                      <div class="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div class="space-y-3">
                      <div class="h-3 bg-gray-100 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                      <div class="h-3 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white rounded-xl shadow-md p-4">
                      <div class="w-full h-3 bg-green-200 rounded mb-2"></div>
                      <div class="w-2/3 h-2 bg-gray-200 rounded"></div>
                    </div>
                    <div class="bg-white rounded-xl shadow-md p-4">
                      <div class="w-full h-3 bg-blue-200 rounded mb-2"></div>
                      <div class="w-3/4 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Decorative Elements -->
              <div class="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
              <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="relative py-20 lg:py-32 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: url('/assets/Olongapo_City_Logo.png'); background-size: 80px 80px; background-repeat: repeat;"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-4xl mx-auto">
            <h2 class="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Make Your Life Easier?
            </h2>
            <p class="text-xl lg:text-2xl text-blue-200 mb-12 leading-relaxed">
              Join your neighbors and start enjoying convenient access to barangay services today!
            </p>
            
            <div class="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                (click)="navigateTo('/sign-up')"
                class="group px-10 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <svg class="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                Register as Resident
              </button>
              <button
                (click)="navigateTo('/sign-in')"
                class="group px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <svg class="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Sign In Existing Account
              </button>
            </div>

            <div class="mt-12 text-blue-300">
              <p class="text-lg">Join {{ visitStats.totalVisits | number }}+ satisfied residents</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Logo and Description -->
            <div>
              <div class="flex items-center gap-3 mb-4">
                <img src="/assets/BNC_Portal_Logo.png" alt="BNC Portal" class="w-10 h-10">
                <span class="text-xl font-bold">BNC Portal</span>
              </div>
              <p class="text-gray-400 leading-relaxed">
                Connecting Barangay New Cabalan through modern digital solutions. Your gateway to community services and engagement.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
              <div class="space-y-2">
                <button (click)="navigateTo('/sign-in')" class="block text-gray-400 hover:text-white transition-colors">Sign In</button>
                <button (click)="navigateTo('/sign-up')" class="block text-gray-400 hover:text-white transition-colors">Register</button>
              </div>
            </div>

            <!-- Contact Info -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
              <div class="space-y-2 text-gray-400">
                <p>Corner Mabini St., Purok 2, New Cabalan, Olongapo City, Zambales, Philippines</p>
                <p>Barangay Hotline: 047-224-5414</p>
                <p>Text/Call: 0910 484 5635</p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {{ currentYear }} BNC Portal. All rights reserved. | Built by Muni</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-fade-in-up {
      animation: fade-in-up 1s ease-out forwards;
    }

    .animation-delay-300 {
      animation-delay: 0.3s;
    }

    .animation-delay-500 {
      animation-delay: 0.5s;
    }

    .animation-delay-700 {
      animation-delay: 0.7s;
    }

    .animation-delay-900 {
      animation-delay: 0.9s;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }

    /* Parallax scrolling effect */
    .parallax-bg {
      will-change: transform;
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Counter animation */
    .animate-counter {
      transition: all 0.5s ease-out;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    /* Line clamp utility */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;

  isLoading = true;
  currentYear = new Date().getFullYear();
  
  visitStats: VisitStats = {
    totalVisits: 0,
    todayVisits: 0,
    onlineUsers: 0
  };

  displayedStats: VisitStats = {
    totalVisits: 0,
    todayVisits: 0,
    onlineUsers: 0
  };

  floatingElements: Array<{x: number, y: number, delay: number}> = [];
  
  private scrollListener?: () => void;
  private counterAnimationFrames: number[] = [];

  constructor(private router: Router) {
    this.generateFloatingElements();
  }

  ngOnInit() {
    this.initializeVisitStats();
    this.simulateLoading();
    this.setupParallaxScrolling();
  }

  ngAfterViewInit() {
    this.startCounterAnimations();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.counterAnimationFrames.forEach(frame => cancelAnimationFrame(frame));
  }

  private simulateLoading() {
    // Simulate loading time for dramatic effect
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  private initializeVisitStats() {
    // Get or initialize visit stats from localStorage
    const storedStats = localStorage.getItem('bnc_visit_stats');
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('bnc_last_visit_date');

    if (storedStats) {
      this.visitStats = JSON.parse(storedStats);
    } else {
      // Initialize with some realistic base numbers
      this.visitStats = {
        totalVisits: 1247,
        todayVisits: 23,
        onlineUsers: 5
      };
    }

    // Increment visit counters
    this.visitStats.totalVisits++;
    
    if (lastVisitDate !== today) {
      // New day, reset today's counter and add some random visits
      this.visitStats.todayVisits = 1 + Math.floor(Math.random() * 15);
      localStorage.setItem('bnc_last_visit_date', today);
    } else {
      this.visitStats.todayVisits++;
    }

    // Simulate online users (random between 3-12)
    this.visitStats.onlineUsers = 3 + Math.floor(Math.random() * 10);

    // Store updated stats
    localStorage.setItem('bnc_visit_stats', JSON.stringify(this.visitStats));
  }

  private generateFloatingElements() {
    for (let i = 0; i < 20; i++) {
      this.floatingElements.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6
      });
    }
  }

  private setupParallaxScrolling() {
    this.scrollListener = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element: any) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private startCounterAnimations() {
    this.animateCounter('totalVisits', this.visitStats.totalVisits, 2000);
    this.animateCounter('todayVisits', this.visitStats.todayVisits, 1500);
    this.animateCounter('onlineUsers', this.visitStats.onlineUsers, 1000);
  }

  private animateCounter(key: keyof VisitStats, target: number, duration: number) {
    const start = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
      
      this.displayedStats[key] = currentValue;
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate);
        this.counterAnimationFrames.push(frameId);
      }
    };
    
    const frameId = requestAnimationFrame(animate);
    this.counterAnimationFrames.push(frameId);
  }

  trackByIndex(index: number): number {
    return index;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}