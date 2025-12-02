import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentUpdate } from '../../shared/types/resident-update';
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-resident-update-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Resident Update Requests</h1>
              <p class="text-gray-600 text-lg mt-2">Review and manage resident information update requests</p>
            </div>
          </div>

        <!-- Unified Loading State -->
        <div *ngIf="isLoading" class="w-full mb-8">
          <app-loading type="spinner" [fullScreen]="true" message="Loading update requests..."></app-loading>
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

        <!-- Update Requests Table -->
        <div *ngIf="!isLoading && !errorMessage && filteredRequests.length > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <!-- Tab Filter -->
          <div class="px-8 py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <nav class="flex gap-2">
              <button
                (click)="setFilter('all')"
                [class]="'px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ' + (filterStatus === 'all' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow-sm')"
              >
                All Requests <span class="ml-1 px-2 py-0.5 rounded-full text-xs" [class]="filterStatus === 'all' ? 'bg-white/20' : 'bg-gray-200'">{{ getTotalCount() }}</span>
              </button>
              <button
                (click)="setFilter('pending')"
                [class]="'px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ' + (filterStatus === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow-sm')"
              >
                Pending <span class="ml-1 px-2 py-0.5 rounded-full text-xs" [class]="filterStatus === 'pending' ? 'bg-white/20' : 'bg-gray-200'">{{ getPendingCount() }}</span>
              </button>
            </nav>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Resident
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Changes
                  </th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <ng-container *ngFor="let request of filteredRequests; let i = index">
                  <!-- Main Row -->
                  <tr class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        #{{ request.$id?.slice(-8) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ getResidentName(request.residentId) }}
                            <button 
                              *ngIf="getResidentName(request.residentId) === 'Loading...' || getResidentName(request.residentId) === 'Error Loading Resident'"
                              (click)="retryLoadResident(request.residentId)"
                              class="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                              title="Retry loading resident"
                            >
                              Retry
                            </button>
                          </div>
                          <div class="text-sm text-gray-500" *ngIf="request.reviewedAt">
                            Reviewed: {{ formatDate(request.reviewedAt) }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-3 py-1.5 text-xs font-bold rounded-full shadow-sm"
                        [ngClass]="{
                          'bg-gradient-to-r from-yellow-400 to-amber-500 text-white': request.status === 'pending',
                          'bg-gradient-to-r from-green-400 to-emerald-600 text-white': request.status === 'approved',
                          'bg-gradient-to-r from-red-400 to-rose-600 text-white': request.status === 'rejected'
                        }"
                      >
                        {{ getStatusDisplay(request.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(request.createdAt) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-900">{{ parseChanges(request.changesJSON).length }} field(s)</span>
                        <button
                          (click)="toggleExpandedRow(i)"
                          class="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            class="h-4 w-4 transition-transform"
                            [class.rotate-180]="expandedRows[i]"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div *ngIf="request.status === 'pending'" class="flex justify-end gap-3">
                        <button
                          (click)="reviewRequest(request.$id!, 'approve')"
                          [disabled]="reviewLoading[request.$id!]"
                          class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span *ngIf="reviewLoading[request.$id!]" class="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
                          Approve
                        </button>
                        <button
                          (click)="showDeclineModal(request)"
                          [disabled]="reviewLoading[request.$id!]"
                          class="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Decline
                        </button>
                      </div>
                      <div *ngIf="request.status !== 'pending'" class="text-gray-500 text-sm font-medium">
                        <span class="px-3 py-1 bg-gray-100 rounded-lg">
                          {{ request.status === 'approved' ? '✓ Approved' : '✗ Declined' }}
                        </span>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Expanded Row for Changes Details -->
                  <tr *ngIf="expandedRows[i]" class="bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <td colspan="6" class="px-6 py-4">
                      <div class="space-y-4">
                        <!-- Requested Changes -->
                        <div>
                          <h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                            Requested Changes:
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div *ngFor="let change of parseChanges(request.changesJSON)" class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                              <div class="font-medium text-gray-900 text-sm">{{ change.field }}</div>
                              <div class="text-gray-600 mt-1 text-sm">
                                <span class="block text-xs text-gray-500">New Value:</span>
                                <span class="text-gray-900">{{ change.newValue || '-' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Decline Reason (if declined) -->
                        <div *ngIf="request.status === 'rejected' && request.reason" class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
                          <h4 class="text-sm font-bold text-red-900 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            Decline Reason:
                          </h4>
                          <p class="text-sm text-red-700">{{ request.reason }}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
        </div>

        <!-- No Results State -->
        <div *ngIf="!isLoading && !errorMessage && filteredRequests.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-600 text-lg">No Update Requests</p>
          <p class="text-gray-500 text-sm mt-1">There are no {{ filterStatus === 'all' ? '' : filterStatus }} update requests at this time.</p>
        </div>
      </div>
    </div>

    <!-- Decline Modal -->
    <div *ngIf="showDeclineModalFlag" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 backdrop-blur-sm bg-black/30" (click)="showDeclineModalFlag = false"></div>
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Decline Update Request</h3>
        <p class="text-gray-600 mb-4">Please provide a reason for declining this update request:</p>
        
        <textarea
          [(ngModel)]="declineReason"
          placeholder="Enter decline reason..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows="4"
        ></textarea>
        
        <div class="flex justify-end gap-3 mt-4">
          <button
            (click)="showDeclineModalFlag = false"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition"
          >
            Cancel
          </button>
          <button
            (click)="confirmDecline()"
            [disabled]="!declineReason.trim() || declineLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition disabled:opacity-50"
          >
            <span *ngIf="declineLoading" class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
            Decline Request
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .rotate-180 {
      transform: rotate(180deg);
    }
    
    svg {
      transition: transform 0.2s ease-in-out;
    }
    
    /* Ensure table is responsive */
    @media (max-width: 768px) {
      .min-w-full {
        font-size: 0.875rem;
      }
      
      .px-6 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .py-4 {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }
    }
  `]
})
export class ResidentUpdateRequestsComponent implements OnInit {
  updateRequests: ResidentUpdate[] = [];
  allRequests: ResidentUpdate[] = []; // Store all requests for accurate counts
  filteredRequests: ResidentUpdate[] = [];
  residentCache: { [key: string]: ResidentInfo } = {};
  
  filterStatus: 'all' | 'pending' = 'pending';
  isLoading = true;
  errorMessage = '';
  reviewLoading: { [key: string]: boolean } = {};
  
  // Decline modal
  showDeclineModalFlag = false;
  currentRequestToDecline: ResidentUpdate | null = null;
  declineReason = '';
  declineLoading = false;

  // Expandable rows for table
  expandedRows: { [key: number]: boolean } = {};

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
      // Always load all requests to maintain accurate counts
      this.allRequests = await this.residentUpdateService.getAllUpdateRequests();
      
      // Filter based on current filter status
      if (this.filterStatus === 'pending') {
        this.updateRequests = this.allRequests.filter(req => req.status === 'pending');
      } else {
        this.updateRequests = this.allRequests;
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
    // Find the request details for confirmation
    const request = this.updateRequests.find(req => req.$id === requestId);
    if (!request) return;

    // Show confirmation dialog for approve action (reject already has a modal)
    if (action === 'approve') {
      const submittedDate = request.$createdAt ? new Date(request.$createdAt).toLocaleDateString() : 'Unknown date';
      
      const confirmResult = await Swal.fire({
        icon: 'question',
        title: 'Approve Update Request',
        html: `
          <div class="text-left">
            <p class="text-gray-700 mb-3">Are you sure you want to approve this update request?</p>
            <div class="bg-green-50 p-3 rounded-lg text-sm border border-green-200">
              <strong class="text-green-800">Request Details:</strong><br>
              <span class="text-gray-700">Request ID: ${request.$id || 'N/A'}</span><br>
              <span class="text-gray-700">Request Type: Information Update</span><br>
              <span class="text-gray-700">Submitted: ${submittedDate}</span><br>
              <span class="text-gray-700">Status: ${request.status}</span>
            </div>
            <p class="text-xs text-gray-500 mt-3">This will update the resident's information with the requested changes.</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Yes, Approve',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        customClass: {
          popup: 'rounded-xl shadow-2xl border-0 swal2-popup-blur-bg',
          title: 'text-xl font-bold text-gray-800 mb-2',
          htmlContainer: 'text-gray-600',
          confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg mr-3',
          cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 border-0 shadow-md hover:shadow-lg'
        },
        backdrop: `
          rgba(0, 0, 0, 0.4)
          left top
          no-repeat
        `,
        allowOutsideClick: false,
        allowEscapeKey: true
      });

      // If user cancelled, return early
      if (!confirmResult.isConfirmed) {
        return;
      }
    }

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
      
      // Show success message with SweetAlert2
      const actionText = action === 'approve' ? 'approved' : 'declined';
      await this.showCustomAlert(`Request ${actionText} successfully`, 'success');
      
      // Reload the requests
      await this.loadUpdateRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      await this.showCustomAlert('Failed to review request. Please try again.', 'error');
    } finally {
      this.reviewLoading[requestId] = false;
    }
  }

  showDeclineModal(request: ResidentUpdate) {
    this.currentRequestToDecline = request;
    this.declineReason = '';
    this.showDeclineModalFlag = true;
  }

  async confirmDecline() {
    if (!this.currentRequestToDecline || !this.declineReason.trim()) return;
    
    this.declineLoading = true;
    
    try {
      await this.reviewRequest(this.currentRequestToDecline.$id!, 'reject', this.declineReason.trim());
      this.showDeclineModalFlag = false;
      this.currentRequestToDecline = null;
      this.declineReason = '';
    } catch (error) {
      console.error('Error declining request:', error);
      await this.showCustomAlert('Failed to decline request. Please try again.', 'error');
    } finally {
      this.declineLoading = false;
    }
  }

  toggleExpandedRow(index: number) {
    this.expandedRows[index] = !this.expandedRows[index];
  }

  async showCustomAlert(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const config: any = {
      text: message,
      confirmButtonText: 'OK',
      background: '#ffffff',
      color: '#374151',
      timer: 3000,
      timerProgressBar: true,
      width: '350px',
      padding: '1.5rem',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0 backdrop-blur-sm',
        title: 'text-lg font-bold mb-2 leading-tight',
        htmlContainer: 'text-gray-600 text-sm leading-relaxed mb-4',
        confirmButton: 'font-semibold py-2 px-5 rounded-lg transition-all duration-200 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm',
        timerProgressBar: 'rounded-full h-1'
      },
      backdrop: 'rgba(15, 23, 42, 0.3)',
      allowOutsideClick: true,
      allowEscapeKey: true,
      buttonsStyling: false
    };

    if (type === 'success') {
      config.icon = 'success';
      config.title = 'Success!';
      config.iconColor = '#10B981';
      config.customClass.title += ' text-emerald-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-emerald-400 to-emerald-500';
    } else if (type === 'error') {
      config.icon = 'error';
      config.title = 'Error';
      config.iconColor = '#EF4444';
      config.customClass.title += ' text-red-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-red-400 to-red-500';
    } else if (type === 'warning') {
      config.icon = 'warning';
      config.title = 'Warning';
      config.iconColor = '#F59E0B';
      config.customClass.title += ' text-amber-700';
      config.customClass.confirmButton += ' bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white';
      config.customClass.timerProgressBar += ' bg-gradient-to-r from-amber-400 to-amber-500';
    }

    await Swal.fire(config);
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

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      default:
        return status;
    }
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

  setFilter(status: 'all' | 'pending') {
    this.filterStatus = status;
    
    // Filter the requests based on the selected status
    if (this.filterStatus === 'pending') {
      this.updateRequests = this.allRequests.filter(req => req.status === 'pending');
    } else {
      this.updateRequests = this.allRequests;
    }
    
    this.filteredRequests = this.updateRequests;
  }

  getTotalCount(): number {
    return this.allRequests.length;
  }

  getPendingCount(): number {
    return this.allRequests.filter(req => req.status === 'pending').length;
  }
}
