import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingType = 'cards' | 'table' | 'chart' | 'list' | 'spinner' | 'custom';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Spinner Loading -->
    <div *ngIf="type === 'spinner'"
         [ngClass]="fullScreen ? 'min-h-[60vh] flex items-center justify-center' : 'py-8 sm:py-12'"
         class="w-full" role="status" aria-live="polite"
         [attr.aria-label]="message || 'Loading content'">
      <div class="flex flex-col items-center justify-center">
        <div class="relative" [attr.aria-hidden]="true">
          <!-- Subtle blurred backdrop for modern feel -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 blur-[1px]"></div>
          <!-- Outer ring -->
          <div class="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-[3px] border-gray-200 dark:border-gray-300"></div>
          <!-- Accent arc -->
          <div class="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-[3px] border-transparent border-t-blue-600 border-r-blue-500 absolute top-0 left-0" style="animation-duration: 0.85s;"></div>
          <!-- Glow ring -->
          <div class="absolute inset-0 rounded-full shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"></div>
          <!-- Center pulse -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-ping"></div>
        </div>
        <div *ngIf="message" class="mt-5 text-gray-600 text-sm font-medium tracking-wide flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          {{ message }}
        </div>
        <span class="sr-only">Loading, please wait...</span>
      </div>
    </div>

    <!-- Cards Loading (Dashboard style) -->
    <div *ngIf="type === 'cards'" 
         [ngClass]="containerClass" 
         role="status" 
         aria-live="polite" 
         aria-label="Loading dashboard cards">
      <div *ngFor="let i of getArray(count); trackBy: trackByIndex" 
           class="bg-white shadow-sm border border-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-pulse hover:shadow-md transition-all duration-300 will-change-transform" 
           [ngClass]="cardClass"
           [attr.aria-hidden]="true">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Icon placeholder with gradient -->
          <div class="relative p-2 sm:p-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <div class="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
          <div class="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <!-- Title placeholder -->
            <div class="space-y-1.5 sm:space-y-2">
              <div class="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(65, i, 5)"></div>
              <div class="h-2.5 sm:h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(45, i, 3)"></div>
            </div>
            <!-- Value placeholder -->
            <div class="h-6 sm:h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-md animate-shimmer" 
                 [style.width.%]="getVariableWidth(35, i, 4)"></div>
          </div>
        </div>
      </div>
      <span class="sr-only">Loading {{ count }} dashboard cards</span>
    </div>

    <!-- Table Loading -->
    <div *ngIf="type === 'table'" 
         class="bg-white shadow-sm border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6" 
         role="status" 
         aria-live="polite" 
         aria-label="Loading table data">
      <!-- Header -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50/50" [attr.aria-hidden]="true">
        <div class="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer w-1/4 max-w-32"></div>
      </div>
      <!-- Rows -->
      <div class="divide-y divide-gray-100">
        <div *ngFor="let i of getArray(count); trackBy: trackByIndex" 
             class="px-4 sm:px-6 py-3 sm:py-4 animate-pulse" 
             [attr.aria-hidden]="true">
          <div class="flex items-center space-x-3 sm:space-x-4">
            <!-- Avatar -->
            <div class="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
              <div class="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            <!-- Content -->
            <div class="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
              <div class="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(60, i, 7)"></div>
              <div class="h-2.5 sm:h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(40, i, 5)"></div>
            </div>
            <!-- Badge -->
            <div class="h-5 sm:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer w-16 sm:w-20 flex-shrink-0"></div>
          </div>
        </div>
      </div>
      <span class="sr-only">Loading {{ count }} table rows</span>
    </div>

    <!-- Chart Loading -->
    <div *ngIf="type === 'chart'" 
         class="bg-white shadow-sm border border-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6" 
         role="status" 
         aria-live="polite" 
         aria-label="Loading chart data">
      <!-- Chart title -->
      <div class="mb-4 sm:mb-6" [attr.aria-hidden]="true">
        <div class="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer w-1/3 max-w-48"></div>
      </div>
      <!-- Chart area with modern design -->
      <div class="relative bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-lg sm:rounded-xl animate-pulse" 
           [ngClass]="getResponsiveChartHeight()" 
           [attr.aria-hidden]="true">
        <!-- Chart elements simulation -->
        <div class="absolute inset-2 sm:inset-4 flex items-end justify-around space-x-1 sm:space-x-2">
          <div class="bg-white/40 rounded-t-md animate-pulse transition-all duration-300" 
               [style.height.%]="60" 
               [style.width.%]="getChartBarWidth()"></div>
          <div class="bg-white/40 rounded-t-md animate-pulse transition-all duration-300" 
               [style.height.%]="80" 
               [style.width.%]="getChartBarWidth()"></div>
          <div class="bg-white/40 rounded-t-md animate-pulse transition-all duration-300" 
               [style.height.%]="45" 
               [style.width.%]="getChartBarWidth()"></div>
          <div class="bg-white/40 rounded-t-md animate-pulse transition-all duration-300" 
               [style.height.%]="70" 
               [style.width.%]="getChartBarWidth()"></div>
          <div class="bg-white/40 rounded-t-md animate-pulse transition-all duration-300" 
               [style.height.%]="55" 
               [style.width.%]="getChartBarWidth()"></div>
        </div>
        <!-- Shimmer overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-lg sm:rounded-xl"></div>
      </div>
      <span class="sr-only">Loading chart visualization</span>
    </div>

    <!-- List Loading -->
    <div *ngIf="type === 'list'" 
         class="bg-white shadow-sm border border-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6" 
         role="status" 
         aria-live="polite" 
         aria-label="Loading list items">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 sm:mb-6" [attr.aria-hidden]="true">
        <div class="h-4 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer w-1/3 max-w-32"></div>
        <div class="h-3 sm:h-4 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-md animate-shimmer w-12 sm:w-16"></div>
      </div>
      <!-- List items -->
      <div class="space-y-3 sm:space-y-4">
        <div *ngFor="let i of getArray(count); trackBy: trackByIndex" 
             class="animate-pulse" 
             [attr.aria-hidden]="true">
          <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-md sm:rounded-lg bg-gray-50/50 border border-gray-100 transition-all duration-200">
            <div class="flex-1 space-y-1.5 sm:space-y-2 min-w-0 pr-3">
              <div class="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(65, i, 6)"></div>
              <div class="h-2.5 sm:h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md animate-shimmer" 
                   [style.width.%]="getVariableWidth(45, i, 4)"></div>
            </div>
            <!-- Status badge -->
            <div class="h-5 sm:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer w-16 sm:w-20 flex-shrink-0"></div>
          </div>
        </div>
      </div>
      <span class="sr-only">Loading {{ count }} list items</span>
    </div>

    <!-- Custom Loading -->
    <div *ngIf="type === 'custom'" [ngClass]="containerClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    /* Performance optimizations */
    .will-change-transform {
      will-change: transform;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-shimmer {
      background-size: 200% 100%;
      animation: shimmer 1.8s ease-in-out infinite;
    }

    /* Optimized animations for better performance */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.65;
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

    /* Modern gradient colors with better contrast */
    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }

    .bg-gradient-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-stops));
    }

    /* Custom gray colors for better depth and accessibility */
    .from-gray-150 {
      --tw-gradient-from: #f8f9fa;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(248, 249, 250, 0));
    }

    .via-gray-150 {
      --tw-gradient-via: #f8f9fa;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to, rgba(248, 249, 250, 0));
    }

    /* Smooth transitions with reduced motion support */
    .transition-all {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-shadow {
      transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Enhanced shadow depths with better contrast */
    .shadow-sm {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .hover\\:shadow-md:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Responsive design improvements */
    @media (max-width: 640px) {
      .animate-shimmer {
        animation-duration: 2s; /* Slightly slower on mobile for better visibility */
      }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .animate-pulse,
      .animate-shimmer {
        animation: none;
      }
      
      .animate-pulse {
        opacity: 0.7;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .bg-gray-200,
      .from-gray-200,
      .via-gray-200 {
        background-color: #6b7280 !important;
      }
      
      .bg-gray-300,
      .from-gray-300,
      .via-gray-300 {
        background-color: #4b5563 !important;
      }
    }

    /* Screen reader only content */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Focus management for accessibility */
    [role="status"] {
      position: relative;
    }

    /* Improved visual hierarchy */
    .max-w-32 {
      max-width: 8rem;
    }

    .max-w-48 {
      max-width: 12rem;
    }
  `]
})
export class LoadingComponent {
  @Input() type: LoadingType = 'spinner';
  @Input() count: number = 5;
  @Input() message?: string;
  @Input() containerClass: string = '';
  @Input() cardClass: string = '';
  @Input() chartHeight: string = 'h-48';
  @Input() fullScreen: boolean = false;

  // Performance optimization: Use trackBy for better rendering
  trackByIndex(index: number): number {
    return index;
  }

  // Utility method to create arrays efficiently
  getArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  // Calculate variable widths for more realistic skeleton loading
  getVariableWidth(base: number, index: number, variation: number): number {
    const calculatedWidth = base + (index * variation);
    return Math.min(Math.max(calculatedWidth, 25), 90); // Ensure reasonable bounds
  }

  // Responsive chart height based on screen size
  getResponsiveChartHeight(): string {
    // Default responsive heights if no custom height provided
    if (this.chartHeight === 'h-48') {
      return 'h-32 sm:h-40 lg:h-48';
    }
    return this.chartHeight;
  }

  // Calculate chart bar width based on available space
  getChartBarWidth(): number {
    // Responsive bar width: narrower on mobile, wider on desktop
    return 14; // This will be overridden by CSS for responsiveness
  }

  // Performance: Reduce unnecessary re-renders
  shouldRender(): boolean {
    return this.count > 0;
  }

  // Accessibility: Get appropriate ARIA labels
  getAriaLabel(): string {
    const typeLabels = {
      'cards': `Loading ${this.count} dashboard cards`,
      'table': `Loading table with ${this.count} rows`,
      'chart': 'Loading chart visualization',
      'list': `Loading list with ${this.count} items`,
      'spinner': this.message || 'Loading content',
      'custom': 'Loading content'
    };
    return typeLabels[this.type];
  }
}