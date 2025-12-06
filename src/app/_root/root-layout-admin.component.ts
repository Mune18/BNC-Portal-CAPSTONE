import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService, Notification } from '../shared/services/notification.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-root-layout-admin',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden">
      <aside id="separator-sidebar" [class.hidden]="isSidebarHidden" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0" aria-label="Sidebar">
        <div class="h-full border-r-1 border-gray-200 drop-shadow-sm px-3 py-4 overflow-y-auto bg-gray-50">
          <div class="flex items-center justify-center mb-1">
            <img src="/assets/BNC_Portal_Logo.png" alt="Logo" class="h-28 w-28">
          </div>
          <h1 class="text-center text-xl font-bold">BNC Portal</h1>
          <p class="text-center text-xs text-gray-600">Barangay New Cabalan System</p>
          <ul class="pt-4 mt-6 space-y-3 font-medium border-t border-gray-200 dark:border-gray-300">
            <li>
              <a [routerLink]="['/admin/dashboard']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/dashboard.png" alt="Dashboard Icon" class="w-5 h-5">
                <span class="ms-3">Barangay Dashboard</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/admin/residents']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/teamwork.png" alt="Residents Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Residents</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/admin/update-requests']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/request.png" alt="Update Requests Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Information Requests</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/admin/household-requests']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Household Requests</span>
              </a>
            </li>
            <!-- <li>
              <a [routerLink]="['/admin/documents']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/google-docs.png" alt="Document Requests Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Document Requests</span>
              </a>
            </li> -->
            <li>
              <a [routerLink]="['/admin/announcements']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/marketing.png" alt="Announcements Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Announcements</span>
              </a>
            </li>
            <li>
              <a [routerLink]="['/admin/reports']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/report.png" alt="Complaints Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Complaints & Reports</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div [class.ml-64]="!isSidebarHidden" [class.ml-0]="isSidebarHidden" class="flex-1 flex flex-col h-full transition-all duration-300">
        <nav class="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
          <div class="flex flex-wrap items-center justify-between mx-auto p-3">
            <button (click)="toggleSidebar()" class="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>

            <div class="flex items-center gap-4">
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
                <div *ngIf="isNotificationMenuOpen" class="notification-menu absolute right-0 mt-2 w-96 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500" *ngIf="unreadNotificationsCount > 0">
                          {{ unreadNotificationsCount }} unread
                        </span>
                        <button *ngIf="notifications.length > 0" 
                                (click)="markAllAsRead()" 
                                class="text-xs text-blue-600 hover:text-blue-800 font-medium">
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

                    <div *ngIf="!notificationsLoading && notifications.length === 0" class="p-6 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m0 0V4a1 1 0 011-1h10a1 1 0 011 1v1M6 20v1a1 1 0 001 1h10a1 1 0 001-1v-1"></path>
                      </svg>
                      <p class="text-sm text-gray-600 mt-2">No notifications</p>
                      <p class="text-xs text-gray-500">You're all caught up!</p>
                    </div>

                    <div *ngIf="!notificationsLoading && notifications.length > 0" class="divide-y divide-gray-100">
                      <div *ngFor="let notification of notifications; let i = index" 
                           class="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                           [class.bg-blue-50]="!notification.isRead"
                           (click)="handleNotificationClick(notification)">
                        <div class="flex items-start space-x-3">
                          <!-- Notification Icon -->
                          <div class="flex-shrink-0 mt-1">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                                 [ngClass]="notificationService.getNotificationColor(notification.type)">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      [attr.d]="notificationService.getNotificationIcon(notification.type)"></path>
                              </svg>
                            </div>
                          </div>

                          <!-- Notification Content -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between">
                              <p class="text-sm font-medium text-gray-900 truncate">{{ notification.title }}</p>
                              <div class="flex items-center ml-2">
                                <span *ngIf="notification.priority === 'high'" 
                                      class="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" 
                                      title="High Priority"></span>
                                <span *ngIf="!notification.isRead" 
                                      class="inline-block w-2 h-2 bg-blue-500 rounded-full"
                                      title="Unread"></span>
                              </div>
                            </div>
                            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ notification.message }}</p>
                            <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(notification.timestamp) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="notifications.length > 5" class="border-t border-gray-200 bg-gray-50 px-4 py-2">
                    <button class="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>

              <!-- Date and Time Display -->
              <div class="text-gray-600">
                <span class="text-sm">{{currentDateTime | date:'EEEE, MMM d, yyyy, h:mm a'}}</span>
              </div>

              <!-- Add profile dropdown -->
              <div class="relative">
                <button (click)="toggleProfileMenu()" class="profile-button flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                  <img src="/assets/BNC_Portal_Logo.png" alt="Profile" class="w-8 h-8 rounded-full">
                </button>

                <!-- Dropdown menu -->
                <div *ngIf="isProfileMenuOpen" class="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <a [routerLink]="['/admin/settings']" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                  <hr class="my-1 border-gray-200">
                  <a (click)="logout()" class="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Logout</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div class="flex-1 overflow-y-auto">
          <!-- Main content goes here -->
          <router-outlet/>
        </div>
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
  `]
})
export class RootLayoutAdminComponent implements OnInit, OnDestroy {
  isSidebarHidden = false;
  isProfileMenuOpen = false;
  isNotificationMenuOpen = false;
  currentDateTime: Date = new Date();
  notifications: Notification[] = [];
  unreadNotificationsCount = 0;
  notificationsLoading = false;
  private dateTimeInterval: any;
  private notificationCheckInterval: any;

  constructor(
    private router: Router, 
    private authService: AuthService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Update time every second
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    // Load initial notifications
    this.loadNotifications();

    // Check for new notifications every 10 seconds (smart refresh)
    this.notificationCheckInterval = setInterval(async () => {
      const hasNew = await this.notificationService.hasNewNotifications();
      if (hasNew) {
        this.loadNotifications();
      }
    }, 10000);
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
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleNotificationMenu() {
    this.isNotificationMenuOpen = !this.isNotificationMenuOpen;
    if (this.isNotificationMenuOpen) {
      // Always refresh when notification menu is opened
      this.loadNotifications();
    }
  }

  async loadNotifications() {
    try {
      this.notificationsLoading = true;
      this.notifications = await this.notificationService.getAllNotifications();
      this.unreadNotificationsCount = await this.notificationService.getUnreadCount();
      
      // Update the last check timestamp
      this.notificationService.updateLastNotificationCheck();
    } catch (error) {
      console.error('Error loading notifications:', error);
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
