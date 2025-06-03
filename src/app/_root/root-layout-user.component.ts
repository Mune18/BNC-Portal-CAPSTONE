import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root-layout-user',
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex">
      <aside id="separator-sidebar" [class.hidden]="isSidebarHidden" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0" aria-label="Sidebar">
        <div class="h-full border-r-1 border-gray-200 drop-shadow-sm px-3 py-4 overflow-y-auto bg-gray-50">
          <div class="flex items-center justify-center mb-1">
            <img src="/assets/BNC_Portal_Logo.png" alt="Logo" class="h-28 w-28">
          </div>
          <h1 class="text-center text-xl font-bold">BNC Portal</h1>
          <p class="text-center text-xs text-gray-600">Barangay New Cabalan System</p>
          <ul class="pt-4 mt-4 space-y-3 font-medium">
            <li>
              <a [routerLink]="['/user/profile']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/profile-user.png" alt="Profile Icon" class="w-5 h-5">
                <span class="ms-3">Profile</span>
              </a>
            </li>
          </ul>
          <ul class="pt-4 mt-4 space-y-3 font-medium border-t border-gray-200 dark:border-gray-300">
            <li>
              <a [routerLink]="['/user/home']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/home.png" alt="Home Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Home</span>
              </a>
            </li>
            <!-- <li>
              <a [routerLink]="['/user/request']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/google-docs.png" alt="Document Requests Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Document Requests</span>
              </a>
            </li> -->
            <li>
              <a [routerLink]="['/user/complaints']" routerLinkActive="bg-blue-100" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-100">
                <img src="/assets/report.png" alt="Complaints Icon" class="w-5 h-5">
                <span class="flex-1 ms-3 whitespace-nowrap">Complaints & Reports</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div [class.ml-64]="!isSidebarHidden" [class.ml-0]="isSidebarHidden" class="flex-1 transition-all duration-300">
        <nav class="bg-gray-50 border-b border-gray-200">
          <div class="flex flex-wrap items-center justify-between mx-auto p-3">
            <button (click)="toggleSidebar()" class="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>

            <div class="flex items-center gap-4">
              <!-- Date and Time Display -->
              <div class="text-gray-600">
                <span class="text-sm">{{currentDateTime | date:'EEEE, MMM d, yyyy, h:mm a'}}</span>
              </div>

            <!-- Add profile dropdown -->
            <div class="relative">
              <button (click)="toggleProfileMenu()" class="profile-button flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <img src="/assets/profile-placeholder.png" alt="Profile" class="w-8 h-8 rounded-full">
              </button>

              <!-- Dropdown menu -->
              <div *ngIf="isProfileMenuOpen" class="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <a [routerLink]="['/user/settings']" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                <hr class="my-1 border-gray-200">
                <a (click)="logout()" class="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Logout</a>
              </div>
            </div>
           </div>
          </div>
        </nav>

        <div class="p-4">
          <!-- Main content goes here -->
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hidden {
      display: none;
    }
  `]
})
export class RootLayoutUserComponent {
  isSidebarHidden = false;
  isProfileMenuOpen = false;
  currentDateTime: Date = new Date();
  private dateTimeInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Update time every second
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval);
    }
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    // Implement logout logic here
    console.log('Logging out...');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileButton = document.querySelector('.profile-button');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (!profileButton?.contains(event.target as Node) && 
        !profileMenu?.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }
  }
}
