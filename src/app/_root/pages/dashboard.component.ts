import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { ComplaintService } from '../../shared/services/complaint.service';
import { ResidentUpdateService } from '../../shared/services/resident-update.service';
import { ResidentInfo } from '../../shared/types/resident';
import { Announcement } from '../../shared/types/announcement';
import { Complaint } from '../../shared/types/complaint';
import Chart from 'chart.js/auto';
import { StatusFormatPipe } from '../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusFormatPipe],
  template: `
    <div class="container mx-auto px-4 py-6">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Overview of the barangay's analytics and management tools</p>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="loading" class="flex justify-center items-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div *ngIf="!loading">
        <!-- Analytics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Residents -->
          <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer" [routerLink]="['/admin/residents']">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">Total Residents</h2>
                <p class="text-gray-600 text-2xl font-bold">{{ totalResidents }}</p>
              </div>
            </div>
          </div>

          <!-- Active Announcements -->
          <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer" [routerLink]="['/admin/announcements']">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">Active Announcements</h2>
                <p class="text-gray-600 text-2xl font-bold">{{ activeAnnouncements }}</p>
              </div>
            </div>
          </div>

          <!-- Pending Update Requests -->
          <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer" [routerLink]="['/admin/update-requests']">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">Pending Update Requests</h2>
                <p class="text-gray-600 text-2xl font-bold">{{ pendingUpdateRequests }}</p>
              </div>
            </div>
          </div>

          <!-- Pending Complaints -->
          <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer" [routerLink]="['/admin/reports']">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">Pending Complaints</h2>
                <p class="text-gray-600 text-2xl font-bold">{{ pendingComplaints }}</p>
              </div>
            </div>
          </div>

          <!-- Last 30 Days Registrations -->
          <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer" [routerLink]="['/admin/residents']">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">New Residents (30d)</h2>
                <p class="text-gray-600 text-2xl font-bold">{{ newResidentsLastMonth }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Recent Activity Column -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Recent Complaints -->
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">Recent Complaints</h2>
                <a [routerLink]="['/admin/reports']" class="text-sm text-blue-600 hover:underline">View All</a>
              </div>
              <div *ngIf="recentComplaints.length === 0" class="text-gray-500 text-center py-4">
                No complaints found
              </div>
              <ul *ngIf="recentComplaints.length > 0" class="divide-y divide-gray-200">
                <li *ngFor="let complaint of recentComplaints" class="py-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-800 truncate w-48">{{ complaint.subject }}</p>
                      <p class="text-xs text-gray-500">{{ complaint.createdAt | date:'MMM d, y' }}</p>
                    </div>
                    <!-- Recent Complaints badge -->
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full" 
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': complaint.status === 'pending',
                        'bg-blue-100 text-blue-800': complaint.status === 'in_review',
                        'bg-green-100 text-green-800': complaint.status === 'resolved',
                        'bg-red-100 text-red-800': complaint.status === 'rejected'
                      }"
                    >
                      {{ complaint.status | statusFormat }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Recent Announcements -->
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">Recent Announcements</h2>
                <a [routerLink]="['/admin/announcements']" class="text-sm text-blue-600 hover:underline">View All</a>
              </div>
              <div *ngIf="recentAnnouncements.length === 0" class="text-gray-500 text-center py-4">
                No announcements found
              </div>
              <ul *ngIf="recentAnnouncements.length > 0" class="divide-y divide-gray-200">
                <li *ngFor="let announcement of recentAnnouncements" class="py-3">
                  <p class="text-sm font-medium text-gray-800">{{ announcement.title }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ announcement.createdAt | date:'MMM d, y' }}</p>
                  <!-- Recent Announcements badge -->
                  <span 
                    class="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800': announcement.status === 'active',
                      'bg-gray-100 text-gray-800': announcement.status === 'archived'
                    }"
                  >
                    {{ announcement.status | statusFormat }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Charts Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Residents by Gender -->
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Residents by Gender</h2>
              <div class="flex items-center">
                <div class="w-1/2 h-48">
                  <canvas id="genderChart"></canvas>
                </div>
                <div class="w-1/2 px-4">
                  <div class="flex items-center mb-3">
                    <div class="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Male</span>
                      <span class="font-semibold">{{ genderStats.male }}</span>
                    </div>
                  </div>
                  <div class="flex items-center mb-3">
                    <div class="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Female</span>
                      <span class="font-semibold">{{ genderStats.female }}</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-sm text-gray-700">Other/Undisclosed</span>
                      <span class="font-semibold">{{ genderStats.other }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Residents by Age Group -->
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Residents by Age Group</h2>
              <div class="h-48">
                <canvas id="ageGroupChart"></canvas>
              </div>
            </div>

            <!-- Newest Residents -->
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">Newest Residents</h2>
                <a [routerLink]="['/admin/residents']" class="text-sm text-blue-600 hover:underline">View All</a>
              </div>
              <div *ngIf="newestResidents.length === 0" class="text-gray-500 text-center py-4">
                No residents found
              </div>
              <div *ngIf="newestResidents.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date Registered</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let resident of newestResidents" class="hover:bg-gray-50">
                      <td class="px-3 py-2 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                            <img *ngIf="resident.profileImage" [src]="resident.profileImage" alt="Profile" class="w-full h-full object-cover">
                            <span *ngIf="!resident.profileImage" class="text-gray-600 font-medium">{{ resident.personalInfo.firstName.charAt(0) }}</span>
                          </div>
                          <span class="text-sm font-medium text-gray-900">
                            {{ resident.personalInfo.firstName }} {{ resident.personalInfo.lastName }}
                          </span>
                        </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {{ resident.personalInfo.contactNo }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(resident.otherDetails.dateOfRegistration || resident.$createdAt) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      min-height: 200px;
      height: 200px;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Statistics
  loading = true;
  totalResidents = 0;
  activeAnnouncements = 0;
  pendingComplaints = 0;
  pendingUpdateRequests = 0;
  newResidentsLastMonth = 0;

  // Recent data
  newestResidents: ResidentInfo[] = [];
  recentComplaints: Complaint[] = [];
  recentAnnouncements: Announcement[] = [];

  // Stats for charts
  genderStats = {
    male: 0,
    female: 0,
    other: 0
  };

  ageGroups = {
    labels: ['0-12', '13-19', '20-35', '36-59', '60+'],
    data: [0, 0, 0, 0, 0]
  };

  private genderChart: Chart | null = null;
  private ageGroupChart: Chart | null = null;
  private chartsRendered = false;

  constructor(
    private adminService: AdminService,
    private announcementService: AnnouncementService,
    private complaintService: ComplaintService,
    private residentUpdateService: ResidentUpdateService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadResidents(),
        this.loadAnnouncements(),
        this.loadComplaints(),
        this.loadUpdateRequests()
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      this.loading = false;
    }
  }

  ngAfterViewInit() {
    // Wait for Angular to finish rendering and data to be loaded
    setTimeout(() => {
      this.renderCharts();
    }, 400); // Increased delay for DOM/data readiness
  }

  ngAfterViewChecked() {
    if (!this.loading && !this.chartsRendered) {
      const genderCanvas = document.getElementById('genderChart');
      const ageCanvas = document.getElementById('ageGroupChart');
      if (genderCanvas && ageCanvas) {
        this.renderCharts();
        this.chartsRendered = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.genderChart) this.genderChart.destroy();
    if (this.ageGroupChart) this.ageGroupChart.destroy();
  }

  private async loadResidents() {
    try {
      const residents = await this.adminService.getAllResidents();
      this.totalResidents = residents.length;
      
      // Calculate gender stats
      residents.forEach(resident => {
        if (resident.personalInfo.gender?.toLowerCase() === 'male') {
          this.genderStats.male++;
        } else if (resident.personalInfo.gender?.toLowerCase() === 'female') {
          this.genderStats.female++;
        } else {
          this.genderStats.other++;
        }
        
        // Calculate age groups
        const age = this.calculateAge(resident.personalInfo.birthDate);
        if (age <= 12) {
          this.ageGroups.data[0]++;
        } else if (age <= 19) {
          this.ageGroups.data[1]++;
        } else if (age <= 35) {
          this.ageGroups.data[2]++;
        } else if (age <= 59) {
          this.ageGroups.data[3]++;
        } else {
          this.ageGroups.data[4]++;
        }
      });
      
      // Get newest residents
      this.newestResidents = [...residents]
        .sort((a, b) => {
          const dateA = new Date(a.otherDetails.dateOfRegistration || a.$createdAt || 0);
          const dateB = new Date(b.otherDetails.dateOfRegistration || b.$createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
      
      // Calculate new registrations in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      this.newResidentsLastMonth = residents.filter(resident => {
        const registrationDate = new Date(resident.otherDetails.dateOfRegistration || resident.$createdAt || 0);
        return registrationDate >= thirtyDaysAgo;
      }).length;
      
    } catch (error) {
      console.error('Error loading residents:', error);
    }
  }

  private async loadAnnouncements() {
    try {
      const announcements = await this.announcementService.getAllAnnouncements();
      this.activeAnnouncements = announcements.filter(a => a.status === 'active').length;
      
      // Get recent announcements
      this.recentAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  private async loadComplaints() {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      this.pendingComplaints = complaints.filter(c => 
        c.status === 'pending' || c.status === 'in_review'
      ).length;
      
      // Get recent complaints
      this.recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  }

  private async loadUpdateRequests() {
    try {
      const updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      this.pendingUpdateRequests = updateRequests.filter(request => 
        request.status === 'pending'
      ).length;
    } catch (error) {
      console.error('Error loading update requests:', error);
    }
  }

  private renderCharts() {
    this.renderGenderChart();
    this.renderAgeGroupChart();
  }

  private renderGenderChart() {
    const canvas = document.getElementById('genderChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Gender chart canvas not found');
      return;
    }
    if (this.genderChart) this.genderChart.destroy();

    // If all values are zero, Chart.js won't render. Add a dummy value for display.
    const data = [this.genderStats.male, this.genderStats.female, this.genderStats.other];
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0];

    this.genderChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: [{
          data: chartData,
          backgroundColor: ['#3B82F6', '#EC4899', '#9CA3AF'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '70%'
      }
    });
  }

  private renderAgeGroupChart() {
    const canvas = document.getElementById('ageGroupChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Age group chart canvas not found');
      return;
    }
    if (this.ageGroupChart) this.ageGroupChart.destroy();

    // If all values are zero, Chart.js won't render. Add a dummy value for display.
    const data = this.ageGroups.data;
    const hasData = data.some(v => v > 0);
    const chartData = hasData ? data : [1, 0, 0, 0, 0];

    this.ageGroupChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.ageGroups.labels,
        datasets: [{
          label: 'Residents',
          data: chartData,
          backgroundColor: [
            '#3B82F6', // blue
            '#10B981', // green
            '#6366F1', // indigo
            '#8B5CF6', // purple
            '#F59E0B'  // amber
          ],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  calculateAge(birthDate: string | undefined): number {
    if (!birthDate) return 0;
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  }
}
