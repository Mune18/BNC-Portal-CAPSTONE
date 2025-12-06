import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service'; // Add this import
import { UserService } from '../shared/services/user.service'; // Import UserService
import { ResidentInfo } from '../shared/types/resident'; // Import ResidentInfo model
import { NotificationService, Notification } from '../shared/services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root-layout-user',
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden">
      <!-- Mobile backdrop (removed - no longer needed) -->
      
      <aside id="separator-sidebar" 
             [class.hidden]="isMobile" 
             [class.translate-x-0]="!isSidebarHidden && !isMobile"
             [class.-translate-x-full]="isSidebarHidden && !isMobile"
             class="hidden md:block fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out" 
             aria-label="Sidebar">
        <div class="h-full border-r-1 border-gray-200 drop-shadow-sm px-3 py-4 overflow-y-auto bg-gray-50">
          
          <div class="flex items-center justify-center mb-1">
            <img src="/assets/BNC_Portal_Logo.png" alt="Logo" class="h-28 w-28">
          </div>
          <h1 class="text-center text-xl font-bold">BNC Portal</h1>
          <p class="text-center text-xs text-gray-600">Barangay New Cabalan System</p>
          <ul class="pt-4 mt-4 space-y-3 font-medium">
            <li>
              <a [routerLink]="['/user/profile']" routerLinkActive="bg-blue-100" (click)="onNavLinkClick()" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/profile-user.png" alt="Profile Icon" class="w-5 h-5">
                <span class="ms-3">Profile</span>
              </a>
            </li>
          </ul>
          <ul class="pt-4 mt-4 space-y-3 font-medium border-t border-gray-200 dark:border-gray-300">
            <li>
              <a [routerLink]="['/user/home']" routerLinkActive="bg-blue-100" (click)="onNavLinkClick()" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/home.png" alt="Home Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Home</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/user/household']" routerLinkActive="bg-blue-100" (click)="onNavLinkClick()" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">My Household</span>
              </a>
            </li>
            <!-- <li>
              <a [routerLink]="['/user/request']" routerLinkActive="bg-blue-100" (click)="onNavLinkClick()" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/google-docs.png" alt="Document Requests Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Document Requests</span>
              </a>
            </li> -->
            <li>
              <a [routerLink]="['/user/complaints']" routerLinkActive="bg-blue-100" (click)="onNavLinkClick()" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/report.png" alt="Complaints Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Complaints & Reports</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="flex-1 flex flex-col h-full transition-all duration-300 ml-0 md:ml-0"
           [class.md:ml-64]="!isSidebarHidden">
        <nav class="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
          <div class="flex items-center justify-between mx-auto p-3">
            <!-- Left side - Empty on desktop (sidebar always visible) -->
            <div class="hidden md:flex items-center">
              <!-- No hamburger button needed - sidebar always visible on desktop -->
            </div>

            <!-- Left side - Mobile logo/brand -->
            <div class="flex md:hidden items-center">
              <img src="/assets/BNC_Portal_Logo.png" alt="Logo" class="h-8 w-8 mr-2">
              <span class="text-lg font-bold text-gray-900">BNC Portal</span>
            </div>

            <!-- Right side - Icons -->
            <div class="flex items-center gap-4 ml-auto">
              <!-- Notification Button -->
              <div class="relative">
                <button (click)="toggleNotificationMenu()" class="notification-button relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"></path>
                  </svg>
                  <!-- Notification Badge -->
                  <span *ngIf="unreadNotificationsCount > 0" 
                        class="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[1.25rem] h-5">
                    {{ unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount }}
                  </span>
                </button>

                <!-- Notification Dropdown -->
                <div *ngIf="isNotificationMenuOpen" class="notification-menu absolute right-0 sm:-right-14 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-[60] max-h-96 overflow-hidden">
                  <div class="px-3 sm:px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
                      <div class="flex items-center gap-1 sm:gap-2">
                        <span class="text-xs text-gray-500" *ngIf="unreadNotificationsCount > 0">
                          {{ unreadNotificationsCount }} unread
                        </span>
                        <button *ngIf="notifications.length > 0" 
                                (click)="markAllAsRead()" 
                                class="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
                          Mark all read
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="max-h-80 overflow-y-auto">
                    <div *ngIf="notificationsLoading" class="p-4 text-center">
                      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                      <p class="text-sm text-gray-600 mt-2">Loading notifications...</p>
                    </div>

                    <div *ngIf="!notificationsLoading && notifications.length === 0" class="p-4 sm:p-6 text-center">
                      <svg class="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m0 0V4a1 1 0 011-1h10a1 1 0 011 1v1M6 20v1a1 1 0 001 1h10a1 1 0 001-1v-1"></path>
                      </svg>
                      <p class="text-sm text-gray-600 mt-2">No notifications</p>
                      <p class="text-xs text-gray-500">You're all caught up!</p>
                    </div>

                    <div *ngIf="!notificationsLoading && notifications.length > 0" class="divide-y divide-gray-100">
                      <div *ngFor="let notification of notifications; let i = index" 
                           class="p-2 sm:p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                           [class.bg-blue-50]="!notification.isRead"
                           (click)="handleNotificationClick(notification)">
                        <div class="flex items-start space-x-2 sm:space-x-3">
                          <!-- Notification Icon -->
                          <div class="flex-shrink-0 mt-1">
                            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                                 [ngClass]="notificationService.getNotificationColor(notification.type)">
                              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      [attr.d]="notificationService.getNotificationIcon(notification.type)"></path>
                              </svg>
                            </div>
                          </div>

                          <!-- Notification Content -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between">
                              <p class="text-xs sm:text-sm font-medium text-gray-900 truncate pr-2">{{ notification.title }}</p>
                              <div class="flex items-center flex-shrink-0">
                                <span *ngIf="notification.priority === 'high'" 
                                      class="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1" 
                                      title="High Priority"></span>
                                <span *ngIf="!notification.isRead" 
                                      class="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"
                                      title="Unread"></span>
                              </div>
                            </div>
                            <p class="text-xs text-gray-600 mt-1 line-clamp-2 pr-1">{{ notification.message }}</p>
                            <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(notification.timestamp) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="notifications.length > 5" class="border-t border-gray-200 bg-gray-50 px-3 sm:px-4 py-2">
                    <button class="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>

            <!-- Desktop Logout Button -->
            <button (click)="logout()" class="hidden md:inline-flex items-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>

            <!-- Desktop profile dropdown / Mobile logout button -->
            <div class="relative">
              <!-- Desktop Profile Button -->
              <button (click)="toggleProfileMenu()" class="profile-button hidden md:flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img *ngIf="userProfile && userProfile.profileImage" [src]="userProfile.profileImage" alt="Profile" class="w-full h-full object-cover">
                  <span *ngIf="!userProfile || !userProfile.profileImage" class="text-gray-600 font-medium">
                    {{ userProfile && userProfile.personalInfo && userProfile.personalInfo.firstName ? 
                       userProfile.personalInfo.firstName.charAt(0) : 'U' }}
                  </span>
                </div>
              </button>

              <!-- Logout Button (Mobile & Desktop) -->
              <button (click)="logout()" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>

              <!-- Desktop Dropdown menu -->
              <div *ngIf="isProfileMenuOpen" class="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <a [routerLink]="['/user/settings']" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" (click)="closeMenusOnMobile()">Settings</a>
                <hr class="my-1 border-gray-200">
                <a (click)="logout()" class="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Logout</a>
              </div>
            </div>
           </div>
          </div>
        </nav>

        <div class="flex-1 overflow-y-auto pb-16 md:pb-0">
          <!-- Main content goes here -->
          <router-outlet></router-outlet>
        </div>

        <!-- Mobile Bottom Navigation (Instagram-style) -->
        <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 bottom-nav-shadow">
          <div class="flex items-center justify-around py-2 px-4">
            <!-- Home -->
            <a [routerLink]="['/user/home']" 
               routerLinkActive="text-blue-600" 
               #homeLink="routerLinkActive"
               class="flex flex-col items-center py-2 px-3 transition-colors duration-200"
               [class.text-blue-600]="homeLink.isActive"
               [class.text-gray-600]="!homeLink.isActive">
              <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span class="text-xs">Home</span>
            </a>

            <!-- Complaints & Reports -->
            <a [routerLink]="['/user/complaints']" 
               routerLinkActive="text-blue-600" 
               #complaintsLink="routerLinkActive"
               class="flex flex-col items-center py-2 px-3 transition-colors duration-200"
               [class.text-blue-600]="complaintsLink.isActive"
               [class.text-gray-600]="!complaintsLink.isActive">
              <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-xs">Report</span>
            </a>

            <!-- Profile -->
            <a [routerLink]="['/user/profile']" 
               routerLinkActive="text-blue-600" 
               #profileLink="routerLinkActive"
               class="flex flex-col items-center py-2 px-3 transition-colors duration-200"
               [class.text-blue-600]="profileLink.isActive"
               [class.text-gray-600]="!profileLink.isActive">
              <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-1 border-2"
                   [class.border-blue-600]="profileLink.isActive"
                   [class.border-transparent]="!profileLink.isActive">
                <img *ngIf="userProfile && userProfile.profileImage" 
                     [src]="userProfile.profileImage" 
                     alt="Profile" 
                     class="w-full h-full object-cover">
                <span *ngIf="!userProfile || !userProfile.profileImage" 
                      class="text-xs text-gray-600 font-medium">
                  {{ userProfile && userProfile.personalInfo && userProfile.personalInfo.firstName ? 
                     userProfile.personalInfo.firstName.charAt(0) : 'U' }}
                </span>
              </div>
              <span class="text-xs">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .hidden {
      display: none;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .notification-menu {
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .notification-button:hover svg {
      transform: scale(1.05);
      transition: transform 0.2s ease;
    }
    
    /* Mobile notification menu positioning */
    @media (max-width: 640px) {
      .notification-menu {
        position: fixed !important;
        top: 60px !important;
        right: 8px !important;
        left: 8px !important;
        bottom: auto !important;
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        transform: none !important;
        z-index: 9999 !important;
        max-height: calc(100vh - 160px) !important;
      }
    }
    
    /* Mobile profile menu positioning */
    @media (max-width: 640px) {
      .profile-menu {
        position: fixed !important;
        bottom: 80px !important;
        right: 8px !important;
        left: auto !important;
        top: auto !important;
        width: 200px !important;
        margin: 0 !important;
        transform: none !important;
      }
    }
    
    /* Bottom navigation styling */
    .bottom-nav-shadow {
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }
    
    /* Active bottom nav item */
    .bottom-nav-active {
      position: relative;
    }
    
    .bottom-nav-active::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: #3b82f6;
      border-radius: 1px;
    }
    
    /* Smooth transitions */
    aside {
      transition: transform 0.3s ease-in-out;
    }
    
    .-translate-x-full {
      transform: translateX(-100%);
    }
    
    .translate-x-0 {
      transform: translateX(0);
    }
  `]
})
export class RootLayoutUserComponent implements OnInit, OnDestroy {
  isSidebarHidden = false;
  isProfileMenuOpen = false;
  isNotificationMenuOpen = false;
  currentDateTime: Date = new Date();
  private dateTimeInterval: any;
  private notificationCheckInterval: any;
  userProfile: ResidentInfo | null = null;
  isMobile = false;
  
  // Notification properties
  notifications: Notification[] = [];
  unreadNotificationsCount = 0;
  notificationsLoading = false;

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private userService: UserService,
    public notificationService: NotificationService
  ) {
    this.checkIfMobile();
  }

  async ngOnInit() {
    // Hide sidebar on mobile (we use bottom nav instead), but always show on desktop
    if (this.isMobile) {
      this.isSidebarHidden = true;
    } else {
      this.isSidebarHidden = false; // Always show sidebar on desktop
    }
    
    // Update time every second
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    // Load initial notifications
    this.loadUserNotifications();

    // Check for new notifications every 10 seconds (smart refresh)
    this.notificationCheckInterval = setInterval(async () => {
      const hasNew = await this.notificationService.hasNewNotifications();
      if (hasNew) {
        this.loadUserNotifications();
      }
    }, 10000);
    
    // Load user profile
    try {
      const account = await this.authService.getAccount();
      if (account) {
        this.userProfile = await this.userService.getUserInformation(account.$id);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  ngOnDestroy() {
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval);
    }
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
    }
  }

  toggleSidebar() {
    // Only allow toggling on mobile, keep sidebar always open on desktop
    if (this.isMobile) {
      this.isSidebarHidden = !this.isSidebarHidden;
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleNotificationMenu() {
    this.isNotificationMenuOpen = !this.isNotificationMenuOpen;
    if (this.isNotificationMenuOpen) {
      // Always refresh when notification menu is opened
      this.loadUserNotifications();
    }
  }

  async loadUserNotifications() {
    try {
      this.notificationsLoading = true;
      const account = await this.authService.getAccount();
      if (account) {
        this.notifications = await this.notificationService.getUserNotifications(account.$id);
        this.unreadNotificationsCount = await this.notificationService.getUserUnreadCount(account.$id);
        
        // Update the last check timestamp
        this.notificationService.updateLastNotificationCheck();
      }
    } catch (error) {
      console.error('Error loading user notifications:', error);
    } finally {
      this.notificationsLoading = false;
    }
  }

  async handleNotificationClick(notification: Notification) {
    // Mark as read
    await this.notificationService.markAsRead(notification.id);
    
    // Update local state immediately
    notification.isRead = true;
    this.unreadNotificationsCount = Math.max(0, this.unreadNotificationsCount - 1);
    
    // Close notification menu
    this.isNotificationMenuOpen = false;
    
    // Navigate to the action URL if provided
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    }
  }

  async markAllAsRead() {
    try {
      await this.notificationService.markAllAsRead();
      
      // Update local state immediately
      this.notifications.forEach(n => n.isRead = true);
      this.unreadNotificationsCount = 0;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }

  async logout() {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        title: 'text-lg font-semibold text-gray-900',
        htmlContainer: 'text-sm text-gray-600',
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
      }
    });

    if (result.isConfirmed) {
      try {
        await this.authService.logout();
        this.router.navigate(['/sign-in']);
      } catch (error) {
        console.error('Logout error:', error);
        await Swal.fire({
          title: 'Error',
          text: 'Failed to logout. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3b82f6',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-lg font-semibold text-gray-900',
            htmlContainer: 'text-sm text-gray-600',
            confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
          }
        });
        this.router.navigate(['/sign-in']);
      }
    }
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  onNavLinkClick() {
    // Close sidebar on mobile when navigation link is clicked
    if (this.isMobile) {
      this.isSidebarHidden = true;
    }
  }

  closeMenusOnMobile() {
    // Close dropdown menus when navigating on mobile
    if (this.isMobile) {
      this.isProfileMenuOpen = false;
      this.isNotificationMenuOpen = false;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkIfMobile();
    
    // Handle sidebar visibility based on screen size
    if (this.isMobile) {
      // Hide sidebar on mobile (we use bottom nav instead)
      this.isSidebarHidden = true;
      // Close menus when switching to mobile
      this.isProfileMenuOpen = false;
      this.isNotificationMenuOpen = false;
    } else {
      // Always show sidebar on desktop
      this.isSidebarHidden = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileButton = document.querySelector('.profile-button');
    const profileMenu = document.querySelector('.profile-menu');
    const notificationButton = document.querySelector('.notification-button');
    const notificationMenu = document.querySelector('.notification-menu');
    
    // Close profile menu if clicked outside
    if (!profileButton?.contains(event.target as Node) && 
        !profileMenu?.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }

    // Close notification menu if clicked outside
    if (!notificationButton?.contains(event.target as Node) && 
        !notificationMenu?.contains(event.target as Node)) {
      this.isNotificationMenuOpen = false;
    }
  }
}
