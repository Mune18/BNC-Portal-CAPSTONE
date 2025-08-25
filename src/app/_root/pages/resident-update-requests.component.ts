import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentUpdate } from '../../shared/types/resident-update';
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-update-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Resident Update Requests</h1>
              <p class="text-gray-600 mt-1">Review and manage resident information update requests</p>
            </div>
            <div class="flex gap-3">
              <button
                (click)="filterStatus = 'all'; loadUpdateRequests()"
                [class]="'px-4 py-2 rounded-lg text-sm font-medium transition ' + (filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
              >
                All ({{ getTotalCount() }})
              </button>
              <button
                (click)="filterStatus = 'pending'; loadUpdateRequests()"
                [class]="'px-4 py-2 rounded-lg text-sm font-medium transition ' + (filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
              >
                Pending ({{ getPendingCount() }})
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex justify-center">
          <div class="flex flex-col items-center">
            <div class="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">Loading update requests...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6 mb-8">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600">{{ errorMessage }}</p>
          </div>
          <button 
            (click)="loadUpdateRequests()" 
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition"
          >
            Try Again
          </button>
        </div>

        <!-- Update Requests List -->
        <div *ngIf="!isLoading && !errorMessage" class="space-y-6">
          <div *ngIf="filteredRequests.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div class="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No Update Requests</h3>
            <p class="text-gray-500">There are no {{ filterStatus === 'all' ? '' : filterStatus }} update requests at this time.</p>
          </div>

          <div *ngFor="let request of filteredRequests" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Request Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Request #{{ request.$id?.slice(-8) }}
                    </h3>
                    <span 
                      class="px-3 py-1 text-sm rounded-full font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': request.status === 'pending',
                        'bg-green-100 text-green-800': request.status === 'approved',
                        'bg-red-100 text-red-800': request.status === 'rejected'
                      }"
                    >
                      {{ request.status | titlecase }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div class="flex items-center gap-2">
                      <span><strong>Resident:</strong> {{ getResidentName(request.residentId) }}</span>
                      <button 
                        *ngIf="getResidentName(request.residentId) === 'Loading...' || getResidentName(request.residentId) === 'Error Loading Resident'"
                        (click)="retryLoadResident(request.residentId)"
                        class="text-xs text-blue-600 hover:text-blue-800 underline"
                        title="Retry loading resident"
                      >
                        Retry
                      </button>
                    </div>
                    <p><strong>Submitted:</strong> {{ formatDate(request.createdAt) }}</p>
                    <p *ngIf="request.reviewedAt"><strong>Reviewed:</strong> {{ formatDate(request.reviewedAt) }}</p>
                  </div>
                </div>
                <div class="flex gap-2" *ngIf="request.status === 'pending'">
                  <button
                    (click)="reviewRequest(request.$id!, 'approve')"
                    [disabled]="reviewLoading[request.$id!]"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition disabled:opacity-50"
                  >
                    <span *ngIf="reviewLoading[request.$id!]" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
                    Approve
                  </button>
                  <button
                    (click)="showRejectModal(request)"
                    [disabled]="reviewLoading[request.$id!]"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <!-- Changes Preview -->
            <div class="p-6">
              <h4 class="text-sm font-semibold text-gray-900 mb-3">Requested Changes:</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div *ngFor="let change of parseChanges(request.changesJSON)" class="border-l-4 border-blue-500 pl-3">
                    <div class="font-medium text-gray-900">{{ change.field }}</div>
                    <div class="text-gray-600 mt-1">
                      <span class="block text-xs text-gray-500">New Value:</span>
                      <span class="text-gray-900">{{ change.newValue || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rejection Reason (if rejected) -->
            <div *ngIf="request.status === 'rejected' && request.reason" class="px-6 pb-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="text-sm font-semibold text-red-900 mb-2">Rejection Reason:</h4>
                <p class="text-sm text-red-700">{{ request.reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div *ngIf="showRejectModalFlag" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 backdrop-blur-sm bg-black/30" (click)="showRejectModalFlag = false"></div>
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reject Update Request</h3>
        <p class="text-gray-600 mb-4">Please provide a reason for rejecting this update request:</p>
        
        <textarea
          [(ngModel)]="rejectReason"
          placeholder="Enter rejection reason..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="4"
        ></textarea>
        
        <div class="flex justify-end gap-3 mt-4">
          <button
            (click)="showRejectModalFlag = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition"
          >
            Cancel
          </button>
          <button
            (click)="confirmReject()"
            [disabled]="!rejectReason.trim() || rejectLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition disabled:opacity-50"
          >
            <span *ngIf="rejectLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
            Reject Request
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ResidentUpdateRequestsComponent implements OnInit {
  updateRequests: ResidentUpdate[] = [];
  filteredRequests: ResidentUpdate[] = [];
  residentCache: { [key: string]: ResidentInfo } = {};
  
  filterStatus: 'all' | 'pending' = 'pending';
  isLoading = true;
  errorMessage = '';
  reviewLoading: { [key: string]: boolean } = {};
  
  // Reject modal
  showRejectModalFlag = false;
  currentRequestToReject: ResidentUpdate | null = null;
  rejectReason = '';
  rejectLoading = false;

  constructor(
    private residentUpdateService: ResidentUpdateService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadUpdateRequests();
  }

  async loadUpdateRequests() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      if (this.filterStatus === 'pending') {
        this.updateRequests = await this.residentUpdateService.getPendingUpdateRequests();
      } else {
        this.updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      }
      
      this.filteredRequests = this.updateRequests;
      
      // Preload resident information for each request
      for (const request of this.updateRequests) {
        if (!this.residentCache[request.residentId]) {
          try {
            const resident = await this.residentUpdateService.getResidentById(request.residentId);
            if (resident) {
              this.residentCache[request.residentId] = resident;
            } else {
              console.warn('No resident data found for ID:', request.residentId);
              // Set a placeholder to avoid repeated attempts
              this.residentCache[request.residentId] = {
                personalInfo: { firstName: 'Unknown', lastName: 'Resident' }
              } as any;
            }
          } catch (error) {
            console.error('Error loading resident:', request.residentId, error);
            // Set a placeholder to avoid repeated attempts
            this.residentCache[request.residentId] = {
              personalInfo: { firstName: 'Error', lastName: 'Loading' }
            } as any;
          }
        }
      }
    } catch (error) {
      console.error('Error loading update requests:', error);
      this.errorMessage = 'Failed to load update requests. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async reviewRequest(requestId: string, action: 'approve' | 'reject', reason?: string) {
    this.reviewLoading[requestId] = true;
    
    try {
      const account = await this.authService.getAccount();
      if (!account) {
        this.router.navigate(['/sign-in']);
        return;
      }
      
      await this.residentUpdateService.reviewUpdateRequest({
        updateId: requestId,
        action: action,
        reason: reason,
        reviewedBy: account.$id
      });
      
      // Reload the requests
      await this.loadUpdateRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      this.errorMessage = 'Failed to review request. Please try again.';
    } finally {
      this.reviewLoading[requestId] = false;
    }
  }

  showRejectModal(request: ResidentUpdate) {
    this.currentRequestToReject = request;
    this.rejectReason = '';
    this.showRejectModalFlag = true;
  }

  async confirmReject() {
    if (!this.currentRequestToReject || !this.rejectReason.trim()) return;
    
    this.rejectLoading = true;
    
    try {
      await this.reviewRequest(this.currentRequestToReject.$id!, 'reject', this.rejectReason.trim());
      this.showRejectModalFlag = false;
      this.currentRequestToReject = null;
      this.rejectReason = '';
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      this.rejectLoading = false;
    }
  }

  async retryLoadResident(residentId: string) {
    try {
      // Remove from cache to force reload
      delete this.residentCache[residentId];
      
      const resident = await this.residentUpdateService.getResidentById(residentId);
      if (resident) {
        this.residentCache[residentId] = resident;
      } else {
        console.warn('Still no resident data found for ID:', residentId);
        // Set a different placeholder to indicate retry failed
        this.residentCache[residentId] = {
          personalInfo: { firstName: 'Not Found', lastName: 'Resident' }
        } as any;
      }
    } catch (error) {
      console.error('Error retrying to load resident:', residentId, error);
      this.residentCache[residentId] = {
        personalInfo: { firstName: 'Error', lastName: 'Loading' }
      } as any;
    }
  }

  getResidentName(residentId: string): string {
    const resident = this.residentCache[residentId];
    if (resident && resident.personalInfo && resident.personalInfo.firstName && resident.personalInfo.lastName) {
      // Handle special placeholder cases
      if (resident.personalInfo.firstName === 'Error') {
        return 'Error Loading Resident';
      }
      if (resident.personalInfo.firstName === 'Unknown') {
        return 'Unknown Resident';
      }
      if (resident.personalInfo.firstName === 'Not Found') {
        return 'Resident Not Found';
      }
      
      // Return actual name
      return `${resident.personalInfo.firstName} ${resident.personalInfo.lastName}`;
    }
    
    return 'Loading...';
  }

  parseChanges(changesJSON: string) {
    return this.residentUpdateService.parseChanges(changesJSON);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalCount(): number {
    return this.updateRequests.length;
  }

  getPendingCount(): number {
    return this.updateRequests.filter(req => req.status === 'pending').length;
  }
}
