import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseholdService } from '../../shared/services/household.service';
import { UserService } from '../../shared/services/user.service';
import { 
  HouseholdMemberWithResident, 
  Household 
} from '../../shared/types/household';
import Swal from 'sweetalert2';

interface HouseholdRequestWithDetails extends HouseholdMemberWithResident {
  household?: Household;
  householdHeadName?: string;
}

@Component({
  selector: 'app-household-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Household Member Requests
          </h1>
          <p class="text-gray-600 text-lg">Review and approve household member additions</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Pending Requests</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {{ pendingCount }}
                </p>
              </div>
              <div class="h-12 w-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Households</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ stats.totalHouseholds }}
                </p>
              </div>
              <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Avg. Members/Household</p>
                <p class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {{ stats.avgHouseholdSize }}
                </p>
              </div>
              <div class="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mb-6">
          <div class="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
            <button 
              (click)="filterStatus = 'all'; filterRequests()"
              [class.bg-gradient-to-r]="filterStatus === 'all'"
              [class.from-blue-600]="filterStatus === 'all'"
              [class.to-indigo-600]="filterStatus === 'all'"
              [class.text-white]="filterStatus === 'all'"
              [class.text-gray-600]="filterStatus !== 'all'"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
              All ({{ requests.length }})
            </button>
            <button 
              (click)="filterStatus = 'pending_verification'; filterRequests()"
              [class.bg-gradient-to-r]="filterStatus === 'pending_verification'"
              [class.from-amber-500]="filterStatus === 'pending_verification'"
              [class.to-orange-500]="filterStatus === 'pending_verification'"
              [class.text-white]="filterStatus === 'pending_verification'"
              [class.text-gray-600]="filterStatus !== 'pending_verification'"
              class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Pending ({{ pendingCount }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading requests...</p>
        </div>

        <!-- Requests List -->
        <div *ngIf="!loading" class="space-y-4">
          <div *ngFor="let request of filteredRequests" 
               class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start gap-4 flex-1">
                  <!-- Profile Avatar -->
                  <div class="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span class="text-white font-bold text-lg">
                      {{ getInitials(request) }}
                    </span>
                  </div>

                  <!-- Member Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-xl font-bold text-gray-900">
                        {{ getMemberName(request) }}
                      </h3>
                      <span class="px-3 py-1 text-xs font-bold rounded-full" 
                            [class]="getRelationshipBadgeClass(request.relationship)">
                        {{ request.relationship }}
                      </span>
                      <span class="px-3 py-1 text-xs font-bold rounded-full" 
                            [class]="getStatusBadgeClass(request.status)">
                        {{ formatStatus(request.status) }}
                      </span>
                    </div>

                    <!-- Member Details Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span><strong>Type:</strong> {{ getMemberType(request.memberType) }}</span>
                      </div>

                      <div *ngIf="request.residentInfo?.age" class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Age:</strong> {{ request.residentInfo?.age }} years old</span>
                      </div>

                      <div *ngIf="request.residentInfo?.gender" class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Gender:</strong> {{ request.residentInfo?.gender }}</span>
                      </div>

                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Requested:</strong> {{ formatDate(request.createdAt) }}</span>
                      </div>
                    </div>

                    <!-- Household Information -->
                    <div class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div class="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div class="flex-1">
                          <p class="text-sm font-semibold text-gray-900 mb-1">Household Information</p>
                          <p class="text-sm text-gray-700">
                            <strong>Head:</strong> {{ request.householdHeadName || 'Loading...' }}
                          </p>
                          <p class="text-sm text-gray-700" *ngIf="request.household">
                            <strong>Code:</strong> <span class="font-mono">{{ request.household.householdCode }}</span> • 
                            <strong>Purok:</strong> {{ request.household.purokNo }} • 
                            <strong>Address:</strong> {{ request.household.houseNo }}, {{ request.household.street }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Warning for Pending Registration -->
                    <div *ngIf="request.memberType === 'pending_registration'" 
                         class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div class="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-xs text-amber-800">
                          <strong>Not Yet Registered:</strong> This person is not registered in the system. 
                          They can create an account later and claim this household member record.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div *ngIf="request.status === 'pending_verification'" class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  (click)="rejectRequest(request)"
                  [disabled]="processing"
                  class="px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button 
                  (click)="approveRequest(request)"
                  [disabled]="processing"
                  class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredRequests.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Requests Found</h3>
            <p class="text-gray-600">
              {{ filterStatus === 'pending_verification' ? 'No pending requests at this time.' : 'No household member requests found.' }}
            </p>
          </div>
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
export class HouseholdRequestsComponent implements OnInit {
  loading = true;
  processing = false;
  requests: HouseholdRequestWithDetails[] = [];
  filteredRequests: HouseholdRequestWithDetails[] = [];
  filterStatus: 'all' | 'pending_verification' = 'pending_verification';
  
  stats = {
    totalHouseholds: 0,
    avgHouseholdSize: 0
  };

  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'pending_verification').length;
  }

  constructor(
    private householdService: HouseholdService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.loadRequests();
    await this.loadStats();
  }

  async loadRequests() {
    this.loading = true;
    try {
      const pendingMembers = await this.householdService.getPendingHouseholdMembers();
      
      // Enrich with household and head information
      this.requests = await Promise.all(
        pendingMembers.map(async (member) => {
          const enriched: HouseholdRequestWithDetails = { ...member };
          
          // Get household info
          if (member.householdId) {
            try {
              const household = await this.householdService.getHouseholdById(member.householdId);
              if (household) {
                enriched.household = household;
                
                // Get head of household name using resident ID
                try {
                  const headResident = await this.userService.getResidentById(household.headOfHouseholdId);
                  if (headResident) {
                    enriched.householdHeadName = `${headResident.firstName} ${headResident.middleName || ''} ${headResident.lastName}`.replace(/\s+/g, ' ').trim();
                  }
                } catch (error) {
                  console.warn('Could not fetch household head info:', error);
                }
              }
            } catch (error) {
              console.warn('Could not fetch household info:', error);
            }
          }
          
          return enriched;
        })
      );

      this.filterRequests();
    } catch (error) {
      console.error('Error loading requests:', error);
      Swal.fire('Error', 'Failed to load household requests', 'error');
    } finally {
      this.loading = false;
    }
  }

  async loadStats() {
    try {
      const stats = await this.householdService.getHouseholdStats();
      this.stats = {
        totalHouseholds: stats.totalHouseholds,
        avgHouseholdSize: stats.avgHouseholdSize
      };
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  filterRequests() {
    if (this.filterStatus === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(r => r.status === this.filterStatus);
    }
  }

  async approveRequest(request: HouseholdRequestWithDetails) {
    const result = await Swal.fire({
      title: 'Approve Household Member?',
      html: `
        <div class="text-left">
          <p class="mb-2">You are about to approve:</p>
          <p class="font-semibold">${this.getMemberName(request)}</p>
          <p class="text-sm text-gray-600">Relationship: ${request.relationship}</p>
          <p class="text-sm text-gray-600">Household Head: ${request.householdHeadName}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      this.processing = true;
      try {
        await this.householdService.updateHouseholdMemberStatus(request.$id!, 'active');
        await Swal.fire('Approved!', 'Household member has been approved', 'success');
        await this.loadRequests();
        await this.loadStats();
      } catch (error) {
        console.error('Error approving request:', error);
        Swal.fire('Error', 'Failed to approve household member', 'error');
      } finally {
        this.processing = false;
      }
    }
  }

  async rejectRequest(request: HouseholdRequestWithDetails) {
    const result = await Swal.fire({
      title: 'Reject Household Member?',
      html: `
        <div class="text-left mb-4">
          <p class="mb-2">You are about to reject:</p>
          <p class="font-semibold">${this.getMemberName(request)}</p>
          <p class="text-sm text-gray-600">This will remove them from the household.</p>
        </div>
      `,
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Rejection Reason (Optional)',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      this.processing = true;
      try {
        await this.householdService.removeHouseholdMember(request.$id!);
        await Swal.fire('Rejected', 'Household member request has been rejected', 'success');
        await this.loadRequests();
        await this.loadStats();
      } catch (error) {
        console.error('Error rejecting request:', error);
        Swal.fire('Error', 'Failed to reject household member', 'error');
      } finally {
        this.processing = false;
      }
    }
  }

  getMemberName(member: HouseholdRequestWithDetails): string {
    if (member.residentInfo) {
      return `${member.residentInfo.firstName} ${member.residentInfo.middleName || ''} ${member.residentInfo.lastName}`.trim();
    }
    return 'Unknown';
  }

  getInitials(member: HouseholdRequestWithDetails): string {
    if (member.residentInfo) {
      return `${member.residentInfo.firstName?.charAt(0) || ''}${member.residentInfo.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    return '?';
  }

  getMemberType(type: string): string {
    return type === 'linked' ? 'Registered Resident' : 'Pending Registration';
  }

  getRelationshipBadgeClass(relationship: string): string {
    const classes: Record<string, string> = {
      'Head': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      'Spouse': 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
      'Child': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      'Parent': 'bg-gradient-to-r from-purple-400 to-violet-500 text-white',
      'Sibling': 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
      'Relative': 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white',
      'Other': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    };
    return classes[relationship] || classes['Other'];
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'active': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      'pending_verification': 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
      'claimed': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
    };
    return classes[status] || 'bg-gray-200 text-gray-600';
  }

  formatStatus(status: string): string {
    const formats: Record<string, string> = {
      'active': 'Active',
      'pending_verification': 'Pending Review',
      'claimed': 'Claimed'
    };
    return formats[status] || status;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
