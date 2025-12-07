import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../shared/components/loading.component';
import { AnalyticsService } from '../shared/services/analytics.service';

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
          <div class="absolute inset-0 opacity-[0.08]">
            <div class="absolute top-20 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob will-change-transform"></div>
            <div class="absolute top-40 right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000 will-change-transform"></div>
            <div class="absolute bottom-20 left-40 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 will-change-transform"></div>
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
          <div class="mb-6 sm:mb-8 animate-fade-in-up">
            <div class="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-2xl mb-4 sm:mb-6">
              <img src="/assets/BNC_Portal_Logo.png" alt="BNC Portal" class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain">
            </div>
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in-up animation-delay-300 px-2">
            Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">BNC Portal</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-blue-100 animate-fade-in-up animation-delay-500 max-w-4xl mx-auto leading-relaxed px-4">
            Your Digital Gateway to <strong class="text-white">Barangay New Cabalan</strong> - Connecting Community, Simplifying Services
          </p>
          
          <!-- Description -->
          <p class="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-blue-200 animate-fade-in-up animation-delay-700 max-w-3xl mx-auto leading-relaxed px-4">
            Access announcements, submit complaints, manage your profile, and stay connected with your community through our modern digital platform.
          </p>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center animate-fade-in-up animation-delay-900 mb-12 sm:mb-16 lg:mb-20 px-4">
            <button
              (click)="navigateTo('/sign-in')"
              class="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm sm:text-base rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[200px]">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Sign In to Portal
            </button>
            <button
              (click)="navigateTo('/sign-up')"
              class="group px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm sm:text-base rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[200px]">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register Now
            </button>
          </div>
          
          <!-- Scroll Indicator - Hidden on mobile -->
          <div class="hidden sm:block absolute bottom left-1/2 transform -translate-x-1/2 animate-bounce">
            <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div class="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
            <p class="text-white/70 text-sm mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <!-- Ultra Modern Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50"></div>
        
        <!-- Mesh Gradient Background -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Large Gradient Orbs with better blending -->
          <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/30 via-indigo-300/20 to-transparent rounded-full blur-3xl animate-mesh-1"></div>
          <div class="absolute top-20 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-purple-300/25 via-pink-300/15 to-transparent rounded-full blur-3xl animate-mesh-2"></div>
          <div class="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-300/20 via-blue-300/15 to-transparent rounded-full blur-3xl animate-mesh-3"></div>
          
          <!-- Accent Gradient Orbs -->
          <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-400/15 to-purple-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
          <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-400/15 to-cyan-400/10 rounded-full blur-2xl animate-pulse-slow animation-delay-3000"></div>
        </div>
        
        <!-- Animated Particles -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Particle System -->
          <div class="absolute top-[10%] left-[15%] w-1 h-1 bg-blue-400/40 rounded-full animate-particle-1"></div>
          <div class="absolute top-[25%] left-[75%] w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-particle-2"></div>
          <div class="absolute top-[40%] left-[25%] w-1 h-1 bg-purple-400/40 rounded-full animate-particle-3"></div>
          <div class="absolute top-[60%] left-[80%] w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-particle-4"></div>
          <div class="absolute top-[75%] left-[35%] w-1 h-1 bg-cyan-400/40 rounded-full animate-particle-5"></div>
          <div class="absolute top-[85%] left-[65%] w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-particle-6"></div>
          <div class="absolute top-[15%] left-[50%] w-1 h-1 bg-indigo-400/35 rounded-full animate-particle-1 animation-delay-2000"></div>
          <div class="absolute top-[50%] left-[10%] w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-particle-3 animation-delay-1000"></div>
        </div>
        
        <!-- Modern Geometric Shapes -->
        <div class="absolute inset-0 overflow-hidden opacity-30">
          <div class="absolute top-20 right-32 w-32 h-32 border border-indigo-300/20 rounded-2xl rotate-12 animate-rotate-slow"></div>
          <div class="absolute bottom-40 left-20 w-24 h-24 border border-blue-300/20 rounded-full animate-scale-pulse"></div>
          <div class="absolute top-1/2 right-1/4 w-20 h-20 border border-purple-300/20 rounded-lg -rotate-45 animate-rotate-reverse"></div>
        </div>
        
        <!-- Subtle Grid Overlay -->
        <div class="absolute inset-0 opacity-[0.015]">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, #4F46E5 1px, transparent 0); background-size: 50px 50px;"></div>
        </div>
        
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Section Header -->
          <div class="text-center mb-10 sm:mb-16 lg:mb-20">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              What You Can Do with <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">BNC Portal</span>
            </h2>
            <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Your one-stop digital platform for all barangay services and community engagement
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <!-- Feature 1: Stay Informed -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 sm:hover:-translate-y-3 border border-gray-200/50 hover:border-blue-300/50 overflow-hidden animate-fade-in-up">
              <!-- Gradient Overlay on Hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <!-- Animated Icon Container -->
              <div class="relative mb-4 sm:mb-6">
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/50">
                  <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                </div>
                <!-- Floating Badge -->
                <div class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full"></div>
              </div>
              
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">Stay Informed</h3>
              <p class="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Never miss important barangay announcements, events, and updates. Get real-time notifications delivered straight to your dashboard.</p>
              
              <!-- Bottom Accent Line -->
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            <!-- Feature 2: Voice Your Concerns -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-200/50 hover:border-green-300/50 overflow-hidden animate-fade-in-up animation-delay-300">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div class="relative mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-green-500/50">
                  <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Voice Your Concerns</h3>
              <p class="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Easily submit complaints and feedback online. Track the progress of your submissions and receive updates on resolutions.</p>
              
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            <!-- Feature 3: Manage Your Profile -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-200/50 hover:border-purple-300/50 overflow-hidden animate-fade-in-up animation-delay-500">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div class="relative mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-purple-500/50">
                  <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full"></div>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Manage Your Profile</h3>
              <p class="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Keep your personal information up-to-date. Request profile changes and updates with simple, secure online forms.</p>
              
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            <!-- Feature 4: 24/7 Access -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-200/50 hover:border-orange-300/50 overflow-hidden animate-fade-in-up animation-delay-700">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div class="relative mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-orange-500/50">
                  <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full"></div>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">24/7 Access</h3>
              <p class="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Access barangay services anytime, anywhere. No more waiting in lines or office hours - everything at your fingertips.</p>
              
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            <!-- Feature 5: Track Your Requests -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-200/50 hover:border-teal-300/50 overflow-hidden animate-fade-in-up animation-delay-900">
              <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div class="relative mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-teal-500/50">
                  <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full"></div>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">Track Your Requests</h3>
              <p class="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Monitor the status of your complaints and profile update requests in real-time. Complete transparency from submission to resolution.</p>
              
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            <!-- Feature 6: Use Any Device -->
            <div class="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 border border-gray-200/50 hover:border-indigo-300/50 overflow-hidden animate-fade-in-up animation-delay-1100">
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div class="relative mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-indigo-500/50">
                  <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                <div class="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full"></div>
              </div>
              
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">Use Any Device</h3>
              <p class="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">Access the portal from your phone, tablet, or computer. Fully responsive design ensures a seamless experience on all devices.</p>
              
              <div class="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <!-- Modern Animated Background -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Animated Gradient Waves -->
          <div class="absolute inset-0">
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/25 via-transparent to-indigo-600/25 animate-wave-smooth will-change-transform"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-purple-500/20 via-transparent to-blue-500/20 animate-wave-reverse will-change-transform"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 animate-wave-diagonal will-change-transform"></div>
          </div>
          
          <!-- Enhanced Floating Orbs -->
          <div class="absolute top-10 left-[5%] w-48 h-48 bg-gradient-to-br from-white/15 to-blue-300/10 rounded-full blur-3xl animate-float-orb-smooth will-change-transform"></div>
          <div class="absolute bottom-10 right-[8%] w-40 h-40 bg-gradient-to-tl from-yellow-300/20 to-indigo-400/10 rounded-full blur-3xl animate-float-orb-diagonal will-change-transform"></div>
          <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-300/15 to-purple-400/10 rounded-full blur-2xl animate-float-orb-slow will-change-transform"></div>
          <div class="absolute bottom-1/4 right-1/3 w-44 h-44 bg-gradient-to-bl from-cyan-300/15 to-blue-500/10 rounded-full blur-3xl animate-float-orb-smooth animation-delay-2000 will-change-transform"></div>
          <div class="absolute top-[15%] right-[20%] w-36 h-36 bg-gradient-to-tr from-indigo-400/15 to-purple-300/10 rounded-full blur-2xl animate-float-orb-diagonal animation-delay-3000 will-change-transform"></div>
          
          <!-- Enhanced Sparkle Particles -->
          <div class="absolute top-[20%] left-[10%] w-2 h-2 bg-white/70 rounded-full animate-sparkle-float"></div>
          <div class="absolute top-[40%] left-[85%] w-1.5 h-1.5 bg-white/60 rounded-full animate-sparkle-pulse"></div>
          <div class="absolute top-[70%] left-[20%] w-1 h-1 bg-white/70 rounded-full animate-sparkle-float animation-delay-1000"></div>
          <div class="absolute top-[30%] left-[50%] w-2 h-2 bg-white/60 rounded-full animate-sparkle-pulse animation-delay-1000"></div>
          <div class="absolute top-[80%] left-[70%] w-1.5 h-1.5 bg-white/70 rounded-full animate-sparkle-float animation-delay-2000"></div>
          <div class="absolute top-[55%] left-[65%] w-1 h-1 bg-blue-200/60 rounded-full animate-sparkle-pulse animation-delay-3000"></div>
          <div class="absolute top-[25%] left-[35%] w-1.5 h-1.5 bg-indigo-200/50 rounded-full animate-sparkle-float animation-delay-2500"></div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Join Your Neighbors Online
            </h2>
            <p class="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
              See how many residents are already enjoying the convenience of BNC Portal
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <!-- Total Visits -->
            <div class="text-center group">
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15 animate-fade-in-up">
                <!-- Glow Effect -->
                <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                  <div class="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 animate-counter animate-number-glow" 
                       [attr.data-target]="visitStats.totalVisits">{{ displayedStats.totalVisits | number }}</div>
                  <div class="text-blue-200 text-base sm:text-lg font-medium">Total Visits</div>
                  <div class="text-blue-300 text-xs sm:text-sm mt-1 sm:mt-2">Since launch</div>
                </div>
                
                <!-- Decorative Element -->
                <div class="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>

            <!-- Today's Visits -->
            <div class="text-center group">
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15 animate-fade-in-up animation-delay-300">
                <!-- Glow Effect -->
                <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                  <div class="text-4xl lg:text-6xl font-bold text-white mb-2 animate-counter animate-number-glow"
                       [attr.data-target]="visitStats.todayVisits">{{ displayedStats.todayVisits | number }}</div>
                  <div class="text-blue-200 text-lg font-medium">Today's Visits</div>
                  <div class="text-blue-300 text-sm mt-2">Last 24 hours</div>
                </div>
                
                <!-- Decorative Element -->
                <div class="absolute -top-2 -right-2 w-4 h-4 bg-indigo-400 rounded-full animate-ping animation-delay-1000"></div>
              </div>
            </div>

            <!-- Online Users -->
            <div class="text-center group">
              <div class="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15 animate-fade-in-up animation-delay-500">
                <!-- Glow Effect -->
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="relative z-10">
                  <div class="text-4xl lg:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <span class="animate-counter animate-number-glow" [attr.data-target]="visitStats.onlineUsers">{{ displayedStats.onlineUsers | number }}</span>
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  </div>
                  <div class="text-blue-200 text-lg font-medium">Online Now</div>
                  <div class="text-blue-300 text-sm mt-2">Active users</div>
                </div>
                
                <!-- Decorative Element -->
                <div class="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <!-- Modern Animated Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40"></div>
        
        <!-- Mesh Gradient Background -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Large Morphing Gradients -->
          <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/25 via-indigo-300/15 to-transparent rounded-full blur-3xl animate-mesh-1"></div>
          <div class="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-gradient-to-tr from-purple-300/20 via-pink-300/10 to-transparent rounded-full blur-3xl animate-mesh-2"></div>
          <div class="absolute -bottom-32 right-1/4 w-[480px] h-[480px] bg-gradient-to-tl from-cyan-300/20 via-blue-300/10 to-transparent rounded-full blur-3xl animate-mesh-3"></div>
          
          <!-- Medium Accent Orbs -->
          <div class="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/8 rounded-full blur-2xl animate-pulse-slow"></div>
          <div class="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-l from-blue-400/12 to-cyan-400/8 rounded-full blur-2xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <!-- Floating Particles -->
        <div class="absolute inset-0 overflow-hidden opacity-60">
          <div class="absolute top-[15%] left-[20%] w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-particle-1"></div>
          <div class="absolute top-[35%] left-[70%] w-1 h-1 bg-indigo-400/40 rounded-full animate-particle-2"></div>
          <div class="absolute top-[55%] left-[30%] w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-particle-3"></div>
          <div class="absolute top-[75%] left-[65%] w-1 h-1 bg-pink-400/40 rounded-full animate-particle-4"></div>
          <div class="absolute top-[25%] left-[85%] w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-particle-5"></div>
          <div class="absolute top-[65%] left-[15%] w-1 h-1 bg-blue-400/40 rounded-full animate-particle-6"></div>
        </div>
        
        <!-- Geometric Elements -->
        <div class="absolute inset-0 overflow-hidden opacity-20">
          <div class="absolute top-24 right-20 w-24 h-24 border border-indigo-300/30 rounded-2xl rotate-12 animate-rotate-slow"></div>
          <div class="absolute bottom-32 left-16 w-20 h-20 border border-blue-300/30 rounded-full animate-scale-pulse"></div>
          <div class="absolute top-1/2 right-1/3 w-16 h-16 border border-purple-300/30 rounded-lg -rotate-45 animate-rotate-reverse"></div>
        </div>
        
        <!-- Gradient Lines -->
        <div class="absolute inset-0 overflow-hidden opacity-30">
          <div class="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent animate-line-slide"></div>
          <div class="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent animate-line-slide animation-delay-3000"></div>
        </div>
        
        <!-- Subtle Dot Pattern -->
        <div class="absolute inset-0 opacity-[0.015]">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, #4F46E5 1px, transparent 0); background-size: 60px 60px;"></div>
        </div>
        
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <!-- Content -->
            <div class="space-y-8 animate-fade-in-up">
              <div>
                <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Life in <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient">Barangay New Cabalan</span>, Made Easier
                </h2>
                <p class="text-xl text-gray-600 leading-relaxed">
                  BNC Portal makes it simple for you to stay connected with your community, access barangay services, and have your voice heard - all from the comfort of your home.
                </p>
              </div>

              <div class="space-y-6">
                <!-- Feature Item 1 -->
                <div class="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-500 hover:shadow-lg hover:-translate-x-2">
                  <div class="relative">
                    <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-blue-300/50">
                      <svg class="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Quick and Simple</h3>
                    <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Get things done in minutes, not hours. No complicated forms or long waiting times - just simple, straightforward service.</p>
                  </div>
                </div>

                <!-- Feature Item 2 -->
                <div class="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-500 hover:shadow-lg hover:-translate-x-2 animation-delay-300">
                  <div class="relative">
                    <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-green-300/50">
                      <svg class="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">Safe and Secure</h3>
                    <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Your personal information is protected and kept private. Only you and authorized barangay staff can access your data.</p>
                  </div>
                </div>

                <!-- Feature Item 3 -->
                <div class="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-all duration-500 hover:shadow-lg hover:-translate-x-2 animation-delay-500">
                  <div class="relative">
                    <div class="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-purple-300/50">
                      <svg class="w-7 h-7 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <div class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Built for Residents</h3>
                    <p class="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Every feature is designed with you in mind - easy to use, helpful, and always available when you need it.</p>
                  </div>
                </div>
              </div>

              <div class="pt-6 flex justify-center lg:justify-start">
                <button
                  (click)="navigateTo('/sign-up')"
                  class="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                  <!-- Animated Background -->
                  <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <span class="relative z-10">Get Started Today</span>
                  <svg class="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                  
                  <!-- Shine Effect -->
                  <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </div>
            </div>

            <!-- Visual -->
            <div class="relative animate-fade-in-up animation-delay-300">
              <!-- Main Card - Hidden on mobile, visible on lg and up -->
              <div class="hidden lg:block relative z-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div class="space-y-6">
                  <!-- Mock Dashboard Preview with Animation -->
                  <div class="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-500 animate-slide-in-right">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg animate-pulse"></div>
                      <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded flex-1 animate-shimmer"></div>
                    </div>
                    <div class="space-y-3">
                      <div class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4 animate-shimmer animation-delay-300"></div>
                      <div class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2 animate-shimmer animation-delay-500"></div>
                      <div class="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-5/6 animate-shimmer animation-delay-700"></div>
                    </div>
                  </div>
                  
                  <!-- Stats Cards -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white rounded-xl shadow-lg p-4 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 animate-slide-in-right animation-delay-300">
                      <div class="w-full h-3 bg-gradient-to-r from-green-200 to-green-300 rounded mb-2"></div>
                      <div class="w-2/3 h-2 bg-gray-200 rounded"></div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4 transform hover:scale-105 hover:rotate-1 transition-all duration-500 animate-slide-in-right animation-delay-500">
                      <div class="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded mb-2"></div>
                      <div class="w-3/4 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Decorative Floating Elements -->
              <div class="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-yellow-300/40 to-orange-400/30 rounded-full blur-2xl animate-float-orb-3"></div>
              <div class="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-br from-purple-300/30 to-pink-400/30 rounded-full blur-2xl animate-float-orb-1 animation-delay-2000"></div>
              
              <!-- Geometric Shapes -->
              <div class="absolute top-10 right-10 w-16 h-16 border-2 border-indigo-300/30 rounded-xl rotate-12 animate-rotate-slow"></div>
              <div class="absolute bottom-16 left-8 w-12 h-12 border-2 border-blue-300/30 rounded-full animate-scale-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="relative py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 overflow-hidden">
        <!-- Modern Animated Background -->
        <div class="absolute inset-0">
          <!-- Radial Gradient Orbs -->
          <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-transparent rounded-full blur-3xl animate-float-orb-1"></div>
          <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/25 via-pink-500/15 to-transparent rounded-full blur-3xl animate-float-orb-2"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-500/15 rounded-full blur-3xl animate-blob-slow"></div>
          
          <!-- Floating Particles -->
          <div class="absolute top-[10%] left-[15%] w-2 h-2 bg-blue-300/60 rounded-full animate-float-particle"></div>
          <div class="absolute top-[25%] right-[20%] w-3 h-3 bg-indigo-300/50 rounded-full animate-float-particle animation-delay-1000"></div>
          <div class="absolute bottom-[20%] left-[25%] w-2 h-2 bg-purple-300/60 rounded-full animate-float-particle animation-delay-2000"></div>
          <div class="absolute top-[60%] right-[15%] w-2.5 h-2.5 bg-cyan-300/50 rounded-full animate-float-particle animation-delay-3000"></div>
          <div class="absolute bottom-[35%] left-[40%] w-2 h-2 bg-blue-400/60 rounded-full animate-float-particle animation-delay-1500"></div>
          <div class="absolute top-[40%] right-[35%] w-3 h-3 bg-indigo-400/50 rounded-full animate-float-particle animation-delay-2500"></div>
          
          <!-- Geometric Shapes -->
          <div class="absolute top-20 left-[10%] w-24 h-24 border border-blue-300/20 rounded-2xl rotate-12 animate-rotate-slow"></div>
          <div class="absolute bottom-24 right-[12%] w-32 h-32 border border-indigo-300/15 rounded-full animate-scale-pulse animation-delay-1000"></div>
          <div class="absolute top-[45%] left-[8%] w-20 h-20 border-2 border-purple-300/20 rotate-45 animate-rotate-rev"></div>
          <div class="absolute bottom-[40%] right-[10%] w-16 h-16 border border-cyan-300/25 rounded-xl animate-float-orb-3"></div>
          
          <!-- Animated Grid Lines -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-line-slide"></div>
            <div class="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-line-slide animation-delay-1000"></div>
            <div class="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-line-slide animation-delay-2000"></div>
          </div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-4xl mx-auto">
            <!-- Main Heading with Glow Effect -->
            <div class="relative inline-block mb-6 sm:mb-8 px-4">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-2xl animate-pulse-glow"></div>
              <h2 class="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up">
                Ready to Make Your Life Easier?
              </h2>
            </div>
            
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-200 mb-8 sm:mb-10 lg:mb-12 leading-relaxed animate-fade-in-up animation-delay-300 px-4">
              Join your neighbors and start enjoying convenient access to barangay services today!
            </p>
            
            <!-- Enhanced CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up animation-delay-500 px-4">
              <button
                (click)="navigateTo('/sign-up')"
                class="group relative px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden w-full sm:w-auto">
                <!-- Shimmer Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-shimmer"></div>
                
                <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span class="relative z-10">Register as Resident</span>
                
                <!-- Glow Effect on Hover -->
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl"></div>
              </button>
              
              <button
                (click)="navigateTo('/sign-in')"
                class="group relative px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-base sm:text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden w-full sm:w-auto">
                <!-- Shimmer Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <svg class="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                <span class="relative z-10">Sign In Existing Account</span>
                
                <!-- Glow Effect on Hover -->
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-xl"></div>
              </button>
            </div>

            <!-- Enhanced Stats Display -->
            <div class="relative inline-block animate-fade-in-up animation-delay-700 px-4">
              <div class="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse-glow"></div>
              <div class="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 sm:px-8 sm:py-4">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="relative">
                    <div class="absolute inset-0 bg-blue-400/30 rounded-full blur-md animate-ping"></div>
                    <div class="relative w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <p class="text-base sm:text-lg font-semibold text-blue-200">
                    Join <span class="text-white font-bold text-lg sm:text-xl">{{ visitStats.onlineUsers | number }}+</span> satisfied residents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-8 sm:py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <!-- Logo and Description -->
            <div>
              <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src="/assets/BNC_Portal_Logo.png" alt="BNC Portal" class="w-8 h-8 sm:w-10 sm:h-10">
                <span class="text-lg sm:text-xl font-bold">BNC Portal</span>
              </div>
              <p class="text-sm sm:text-base text-gray-400 leading-relaxed">
                Connecting Barangay New Cabalan through modern digital solutions. Your gateway to community services and engagement.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
              <div class="space-y-2">
                <button (click)="navigateTo('/sign-in')" class="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors">Sign In</button>
                <button (click)="navigateTo('/sign-up')" class="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors">Register</button>
              </div>
            </div>

            <!-- Contact Info -->
            <div>
              <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Information</h3>
              <div class="space-y-2 text-sm sm:text-base text-gray-400">
                <p>Corner Mabini St., Purok 2, New Cabalan, Olongapo City, Zambales, Philippines</p>
                <p>Barangay Hotline: 047-224-5414</p>
                <p>Text/Call: 0910 484 5635</p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p class="text-xs sm:text-sm">&copy; {{ currentYear }} BNC Portal. All rights reserved. | Built by Muni</p>
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
      50% {
        transform: translate(25px, -30px) scale(1.05);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }

    @keyframes blob-slow {
      0%, 100% {
        transform: translate(0px, 0px) scale(1);
      }
      25% {
        transform: translate(40px, -60px) scale(1.15);
      }
      50% {
        transform: translate(-50px, 30px) scale(0.95);
      }
      75% {
        transform: translate(30px, 40px) scale(1.1);
      }
    }

    @keyframes mesh-1 {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1) rotate(5deg);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.95) rotate(-5deg);
      }
    }

    @keyframes mesh-2 {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      33% {
        transform: translate(-40px, 30px) scale(1.15) rotate(-8deg);
      }
      66% {
        transform: translate(30px, -25px) scale(0.9) rotate(8deg);
      }
    }

    @keyframes mesh-3 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(25px, -35px) scale(1.08);
      }
    }

    @keyframes pulse-slow {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.05);
      }
    }

    @keyframes particle-1 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(100px, -200px) scale(0);
        opacity: 0;
      }
    }

    @keyframes particle-2 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(-150px, -180px) scale(0);
        opacity: 0;
      }
    }

    @keyframes particle-3 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(80px, 150px) scale(0);
        opacity: 0;
      }
    }

    @keyframes particle-4 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(-120px, 160px) scale(0);
        opacity: 0;
      }
    }

    @keyframes particle-5 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(140px, -140px) scale(0);
        opacity: 0;
      }
    }

    @keyframes particle-6 {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(-90px, -190px) scale(0);
        opacity: 0;
      }
    }

    @keyframes rotate-slow {
      0% {
        transform: rotate(12deg);
      }
      50% {
        transform: rotate(192deg);
      }
      100% {
        transform: rotate(372deg);
      }
    }

    @keyframes rotate-reverse {
      0% {
        transform: rotate(-45deg);
      }
      100% {
        transform: rotate(-405deg);
      }
    }

    @keyframes scale-pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.5;
      }
    }

    @keyframes wave-1 {
      0%, 100% {
        transform: translateX(0) translateY(0);
      }
      50% {
        transform: translateX(20px) translateY(-15px);
      }
    }

    @keyframes wave-2 {
      0%, 100% {
        transform: translateX(0) translateY(0);
      }
      50% {
        transform: translateX(-25px) translateY(20px);
      }
    }

    @keyframes wave-smooth {
      0% {
        transform: translateX(0) translateY(0) rotate(0deg);
      }
      25% {
        transform: translateX(30px) translateY(-20px) rotate(2deg);
      }
      50% {
        transform: translateX(60px) translateY(0) rotate(0deg);
      }
      75% {
        transform: translateX(30px) translateY(20px) rotate(-2deg);
      }
      100% {
        transform: translateX(0) translateY(0) rotate(0deg);
      }
    }

    @keyframes wave-reverse {
      0% {
        transform: translateX(0) translateY(0) rotate(0deg);
      }
      25% {
        transform: translateX(-35px) translateY(25px) rotate(-3deg);
      }
      50% {
        transform: translateX(-70px) translateY(0) rotate(0deg);
      }
      75% {
        transform: translateX(-35px) translateY(-25px) rotate(3deg);
      }
      100% {
        transform: translateX(0) translateY(0) rotate(0deg);
      }
    }

    @keyframes wave-diagonal {
      0% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(40px, -40px) scale(1.05);
      }
      100% {
        transform: translate(0, 0) scale(1);
      }
    }

    @keyframes float-orb-smooth {
      0% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      25% {
        transform: translate(30px, -30px) scale(1.1) rotate(5deg);
      }
      50% {
        transform: translate(60px, 0) scale(1.15) rotate(10deg);
      }
      75% {
        transform: translate(30px, 30px) scale(1.05) rotate(5deg);
      }
      100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
    }

    @keyframes float-orb-diagonal {
      0% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(-40px, 40px) scale(1.2);
      }
      66% {
        transform: translate(20px, -20px) scale(0.95);
      }
      100% {
        transform: translate(0, 0) scale(1);
      }
    }

    @keyframes float-orb-slow {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(25px, -35px) scale(1.12);
      }
    }

    @keyframes float-orb-1 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(15px, -20px) scale(1.1);
      }
      66% {
        transform: translate(-10px, 10px) scale(0.95);
      }
    }

    @keyframes float-orb-2 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(-20px, 15px) scale(1.15);
      }
      66% {
        transform: translate(15px, -12px) scale(0.9);
      }
    }

    @keyframes float-orb-3 {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(12px, -18px) scale(1.08);
      }
    }

    @keyframes sparkle-1 {
      0%, 100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes sparkle-float {
      0% {
        opacity: 0;
        transform: translateY(0) scale(0);
      }
      25% {
        opacity: 1;
        transform: translateY(-15px) scale(1.2);
      }
      50% {
        opacity: 0.8;
        transform: translateY(-30px) scale(1);
      }
      75% {
        opacity: 0.5;
        transform: translateY(-45px) scale(0.8);
      }
      100% {
        opacity: 0;
        transform: translateY(-60px) scale(0);
      }
    }

    @keyframes sparkle-pulse {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      25% {
        opacity: 1;
        transform: scale(1.5) rotate(90deg);
      }
      50% {
        opacity: 0.6;
        transform: scale(1) rotate(180deg);
      }
      75% {
        opacity: 0.3;
        transform: scale(1.2) rotate(270deg);
      }
    }

    @keyframes line-slide-slow {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      25% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
      75% {
        opacity: 0.5;
      }
      100% {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes line-slide-reverse {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      25% {
        opacity: 0.4;
      }
      50% {
        opacity: 0.8;
      }
      75% {
        opacity: 0.4;
      }
      100% {
        transform: translateX(-100%);
        opacity: 0;
      }
    }

    @keyframes sparkle-2 {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.2) rotate(180deg);
      }
    }

    @keyframes sparkle-3 {
      0%, 100% {
        opacity: 0;
        transform: scale(0);
      }
      33% {
        opacity: 0.8;
        transform: scale(1.1);
      }
      66% {
        opacity: 0.4;
        transform: scale(0.9);
      }
    }

    @keyframes line-slide {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes number-glow {
      0%, 100% {
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }
      50% {
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
      }
    }

    @keyframes gradient {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes slide-in-right {
      0% {
        opacity: 0;
        transform: translateX(50px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
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

    @keyframes float-slow {
      0%, 100% {
        transform: translateY(0px) translateX(0px);
      }
      33% {
        transform: translateY(-15px) translateX(10px);
      }
      66% {
        transform: translateY(15px) translateX(-10px);
      }
    }

    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-blob {
      animation: blob 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      will-change: transform;
    }

    .animate-blob-slow {
      animation: blob-slow 20s ease-in-out infinite;
    }

    .animate-mesh-1 {
      animation: mesh-1 25s ease-in-out infinite;
    }

    .animate-mesh-2 {
      animation: mesh-2 30s ease-in-out infinite;
    }

    .animate-mesh-3 {
      animation: mesh-3 28s ease-in-out infinite;
    }

    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }

    .animate-particle-1 {
      animation: particle-1 12s ease-in-out infinite;
    }

    .animate-particle-2 {
      animation: particle-2 15s ease-in-out infinite;
    }

    .animate-particle-3 {
      animation: particle-3 14s ease-in-out infinite;
    }

    .animate-particle-4 {
      animation: particle-4 13s ease-in-out infinite;
    }

    .animate-particle-5 {
      animation: particle-5 16s ease-in-out infinite;
    }

    .animate-particle-6 {
      animation: particle-6 11s ease-in-out infinite;
    }

    .animate-rotate-slow {
      animation: rotate-slow 40s linear infinite;
    }

    .animate-rotate-reverse {
      animation: rotate-reverse 35s linear infinite;
    }

    .animate-scale-pulse {
      animation: scale-pulse 6s ease-in-out infinite;
    }

    .animate-wave-1 {
      animation: wave-1 20s ease-in-out infinite;
    }

    .animate-wave-2 {
      animation: wave-2 25s ease-in-out infinite;
    }

    .animate-wave-smooth {
      animation: wave-smooth 15s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      will-change: transform;
    }

    .animate-wave-reverse {
      animation: wave-reverse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      will-change: transform;
    }

    .animate-wave-diagonal {
      animation: wave-diagonal 20s ease-in-out infinite;
      will-change: transform;
    }

    .animate-float-orb-1 {
      animation: float-orb-1 18s ease-in-out infinite;
    }

    .animate-float-orb-2 {
      animation: float-orb-2 22s ease-in-out infinite;
    }

    .animate-float-orb-3 {
      animation: float-orb-3 20s ease-in-out infinite;
    }

    .animate-float-orb-smooth {
      animation: float-orb-smooth 20s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      will-change: transform;
    }

    .animate-float-orb-diagonal {
      animation: float-orb-diagonal 16s ease-in-out infinite;
      will-change: transform;
    }

    .animate-float-orb-slow {
      animation: float-orb-slow 24s ease-in-out infinite;
      will-change: transform;
    }

    .animate-sparkle-1 {
      animation: sparkle-1 3s ease-in-out infinite;
    }

    .animate-sparkle-2 {
      animation: sparkle-2 4s ease-in-out infinite;
    }

    .animate-sparkle-3 {
      animation: sparkle-3 3.5s ease-in-out infinite;
    }

    .animate-sparkle-float {
      animation: sparkle-float 5s ease-in-out infinite;
    }

    .animate-sparkle-pulse {
      animation: sparkle-pulse 4s ease-in-out infinite;
    }

    .animate-line-slide {
      animation: line-slide 8s linear infinite;
    }

    .animate-line-slide-slow {
      animation: line-slide-slow 12s linear infinite;
    }

    .animate-line-slide-reverse {
      animation: line-slide-reverse 10s linear infinite;
    }

    .animate-number-glow {
      animation: number-glow 3s ease-in-out infinite;
    }

    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 3s ease infinite;
    }

    .animate-shimmer {
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.8s ease-out forwards;
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-float-slow {
      animation: float-slow 8s ease-in-out infinite;
    }

    .animate-fade-in-up {
      animation: fade-in-up 1s ease-out forwards;
    }

    .animation-delay-300 {
      animation-delay: 0.15s;
    }

    .animation-delay-500 {
      animation-delay: 0.25s;
    }

    .animation-delay-700 {
      animation-delay: 0.35s;
    }

    .animation-delay-900 {
      animation-delay: 0.45s;
    }

    .animation-delay-1000 {
      animation-delay: 1s;
    }

    .animation-delay-1100 {
      animation-delay: 1.1s;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-3000 {
      animation-delay: 3s;
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

    /* Pulse glow animation for CTA */
    @keyframes pulse-glow {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }

    .animate-pulse-glow {
      animation: pulse-glow 3s ease-in-out infinite;
    }

    .animation-delay-1500 {
      animation-delay: 1.5s;
    }

    .animation-delay-2500 {
      animation-delay: 2.5s;
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

  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  constructor() {
    this.generateFloatingElements();
  }

  ngOnInit() {
    this.initializeAnalytics();
    this.simulateLoading();
    this.setupParallaxScrolling();
  }

  ngAfterViewInit() {
    // Don't start counter animations here anymore
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.counterAnimationFrames.forEach(frame => cancelAnimationFrame(frame));
  }

  private async initializeAnalytics() {
    await this.recordPageVisit();
    await this.loadVisitStats();
  }

  private simulateLoading() {
    // Simulate loading time for dramatic effect
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  private async recordPageVisit() {
    const sessionRecorded = sessionStorage.getItem('visit_recorded');
    
    if (!sessionRecorded) {
      console.log('🔄 Recording page visit...');
      const result = await this.analyticsService.recordVisit();
      if (result) {
        console.log('✅ Visit recorded successfully');
        sessionStorage.setItem('visit_recorded', 'true');
      }
    } else {
      console.log('ℹ️ Visit already recorded this session');
    }
  }

  private async loadVisitStats() {
    try {
      console.log('📊 Loading visit statistics from Appwrite...');
      
      // Get statistics from Appwrite
      const stats = await this.analyticsService.getStatistics();
      console.log('📈 Stats from Appwrite:', stats);
      
      if (stats) {
        const todayVisits = await this.analyticsService.getTodayVisits();
        const activeUsers = await this.analyticsService.getActiveSessions();

        console.log('📅 Today visits:', todayVisits);
        console.log('👥 Active users:', activeUsers);

        this.visitStats = {
          totalVisits: stats.totalVisits,
          todayVisits: todayVisits,
          onlineUsers: activeUsers
        };

        console.log('✅ Visit stats loaded:', this.visitStats);
        
        // Start counter animations after loading real data
        this.startCounterAnimations();
      } else {
        console.log('⚠️ No stats found, using fallback');
        this.initializeVisitStatsFallback();
      }
    } catch (error) {
      console.error('❌ Error loading visit stats:', error);
      this.initializeVisitStatsFallback();
    }
  }

  private initializeVisitStatsFallback() {
    // Fallback method using localStorage
    const storedStats = localStorage.getItem('bnc_visit_stats');
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('bnc_last_visit_date');

    if (storedStats) {
      this.visitStats = JSON.parse(storedStats);
    } else {
      this.visitStats = {
        totalVisits: 0,
        todayVisits: 0,
        onlineUsers: 0
      };
    }

    // Increment visit counters
    this.visitStats.totalVisits++;
    
    if (lastVisitDate !== today) {
      this.visitStats.todayVisits = 1 + Math.floor(Math.random() * 15);
      localStorage.setItem('bnc_last_visit_date', today);
    } else {
      this.visitStats.todayVisits++;
    }

    this.visitStats.onlineUsers = 3 + Math.floor(Math.random() * 10);
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