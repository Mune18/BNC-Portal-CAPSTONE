import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="relative w-full h-screen overflow-hidden">
      <!--Start Background Animation Body-->
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <!--End Background Animation Body-->

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
      <div class="absolute right-20 top-0 w-1/2 h-screen z-10">
        <router-outlet/>
      </div>
    </div>
  `,
  styles: [`
    /*Start Animations*/
    @-webkit-keyframes animatetop {
      from { top: -300px; opacity: 0; }
      to { top: 0; opacity: 1; }
    }
    @keyframes animatetop {
      from { top: -300px; opacity: 0; }
      to { top: 0; opacity: 1; }
    }
    @-webkit-keyframes zoomIn {
      0% { opacity: 0; -webkit-transform: scale3d(0.3, 0.3, 0.3); transform: scale3d(0.3, 0.3, 0.3);}
      50% { opacity: 1; }
    }
    @keyframes zoomIn {
      0% { opacity: 0; -webkit-transform: scale3d(0.3, 0.3, 0.3); transform: scale3d(0.3, 0.3, 0.3);}
      50% { opacity: 1; }
    }
    /*End Animations*/

    /*-- Start BackGround Animation --*/
    .area {
      background: #f1f5f9; /* Updated background color */
      width: 100%;
      height: 110vh;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
    }
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 96%;
      overflow: hidden;
      z-index: 1;
    }
    .circles li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: rgba(59, 130, 246, 0.18); /* Light blue, Tailwind blue-500 with opacity */
      animation: animate 25s linear infinite;
      bottom: -150px;
      filter: blur(8px); /* More blur for a modern look */
    }
    .circles li:nth-child(1) {
      left: 25%;
      width: 80px;
      height: 80px;
      animation-delay: 0s;
    }
    .circles li:nth-child(2) {
      left: 10%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 12s;
    }
    .circles li:nth-child(3) {
      left: 70%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
    }
    .circles li:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-delay: 0s;
      animation-duration: 18s;
    }
    .circles li:nth-child(5) {
      left: 65%;
      width: 20px;
      height: 20px;
      animation-delay: 0s;
    }
    .circles li:nth-child(6) {
      left: 75%;
      width: 110px;
      height: 110px;
      animation-delay: 3s;
    }
    .circles li:nth-child(7) {
      left: 35%;
      width: 150px;
      height: 150px;
      animation-delay: 7s;
    }
    .circles li:nth-child(8) {
      left: 50%;
      width: 25px;
      height: 25px;
      animation-delay: 15s;
      animation-duration: 45s;
    }
    .circles li:nth-child(9) {
      left: 20%;
      width: 15px;
      height: 15px;
      animation-delay: 2s;
      animation-duration: 35s;
    }
    .circles li:nth-child(10) {
      left: 85%;
      width: 150px;
      height: 150px;
      animation-delay: 0s;
      animation-duration: 11s;
    }
    @keyframes animate {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
      }
      100% {
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
      }
    }
    /*-- End BackGround Animation --*/
  `]
})
export class AuthLayoutComponent {}
