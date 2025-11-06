import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentUpdate } from '../../shared/types/resident-update';
import { ResidentInfo } from '../../shared/types/resident';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resident-update-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Resident Update Requests</h1>
            <p class="text-gray-600 mt-1">Review and manage resident information update requests</p>
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

        <!-- Update Requests Table -->
        <div *ngIf="!isLoading && !errorMessage && filteredRequests.length > 0" class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Tab Filter -->
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button
                (click)="setFilter('all')"
                [class]="'px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ' + (filterStatus === 'all' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
              >
                All Requests ({{ getTotalCount() }})
              </button>
              <button
                (click)="setFilter('pending')"
                [class]="'px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ' + (filterStatus === 'pending' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
              >
                Pending ({{ getPendingCount() }})
              </button>
            </nav>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Changes
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <ng-container *ngFor="let request of filteredRequests; let i = index">
                  <!-- Main Row -->
                  <tr class="hover:bg-gray-50">
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
                        class="px-2 py-1 text-xs rounded-full font-medium"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800': request.status === 'pending',
                          'bg-green-100 text-green-800': request.status === 'approved',
                          'bg-red-100 text-red-800': request.status === 'rejected'
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
                      <div *ngIf="request.status === 'pending'" class="flex justify-end gap-2">
                        <button
                          (click)="reviewRequest(request.$id!, 'approve')"
                          [disabled]="reviewLoading[request.$id!]"
                          class="text-green-600 hover:text-green-900 text-sm"
                        >
                          <span *ngIf="reviewLoading[request.$id!]" class="h-3 w-3 border border-green-600 border-t-transparent rounded-full animate-spin inline-block mr-1"></span>
                          Approve
                        </button>
                        <button
                          (click)="showDeclineModal(request)"
                          [disabled]="reviewLoading[request.$id!]"
                          class="text-red-600 hover:text-red-900 text-sm ml-3"
                        >
                          Decline
                        </button>
                      </div>
                      <div *ngIf="request.status !== 'pending'" class="text-gray-400 text-sm">
                        {{ request.status === 'approved' ? 'Approved' : 'Declined' }}
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Expanded Row for Changes Details -->
                  <tr *ngIf="expandedRows[i]" class="bg-gray-50">
                    <td colspan="6" class="px-6 py-4">
                      <div class="space-y-4">
                        <!-- Requested Changes -->
                        <div>
                          <h4 class="text-sm font-semibold text-gray-900 mb-3">Requested Changes:</h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div *ngFor="let change of parseChanges(request.changesJSON)" class="bg-white rounded-lg p-3 border border-gray-200">
                              <div class="font-medium text-gray-900 text-sm">{{ change.field }}</div>
                              <div class="text-gray-600 mt-1 text-sm">
                                <span class="block text-xs text-gray-500">New Value:</span>
                                <span class="text-gray-900">{{ change.newValue || '-' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Decline Reason (if declined) -->
                        <div *ngIf="request.status === 'rejected' && request.reason" class="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h4 class="text-sm font-semibold text-red-900 mb-2">Decline Reason:</h4>
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
