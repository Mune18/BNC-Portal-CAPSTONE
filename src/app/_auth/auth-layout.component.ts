import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="relative w-full h-screen overflow-hidden">
      <!-- Blue circular design with logo on left -->
      <div class="absolute left-0 top-0 w-1/2 h-screen">
        <div class="absolute left-0 top-0 transform w-full">
          <div class="relative w-full pt-full rounded-r-full bg-blue-800">
            <!-- Barangay Logo -->
            <div class="absolute inset-1 flex items-center justify-center">
              <div class="w-3/4 h-3/4">
                <img src="/assets/BNC_Portal_Logo.png" alt="Barangay New Cabalan Logo" class="w-full h-full">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Light blue circle in top left corner -->
      <div class="absolute left-[-15vh] top-[-15vh] w-230 h-230">
        <div class="relative left-[-2vh] top-[-2vh] w-full h-full rounded-full bg-blue-300 opacity-25"></div>
        <div class="absolute left-1 top-1 w-215 h-215 transform -translate-x-1 -translate-y-1 bg-blue-800 rounded-full z-10"></div>
        <div class="absolute left-1/2 top-1/2 w-115 h-115 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-100"><img src="/assets/BNC_Portal_Logo.png" alt="Olongapo City Seal" class="w-full h-full"></div>
      </div>
      
      <!-- City seal in top right corner -->
      <div class="absolute top-2 right-2">
        <div class="w-25 h-25">
          <img src="/assets/Olongapo_City_Logo.png" alt="Olongapo City Seal" class="w-full h-full">
        </div>
      </div>
      
      <!-- Content area -->
      <div class="absolute right-20 top-0 w-1/2 h-screen p-8">
        <router-outlet/>
      </div>
    </div>
  `,
  styles: ``
})
export class AuthLayoutComponent {

}
