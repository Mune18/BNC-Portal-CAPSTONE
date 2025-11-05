import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../shared/services/email.service';

@Component({
  selector: 'app-email-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Email Configuration</h1>
        <p class="text-gray-600">Configure email notifications for registration approvals and rejections</p>
      </div>

      <!-- Configuration Status -->
      <div class="mb-6">
        <div class="flex items-center p-4 rounded-lg" 
             [class]="isConfigured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" 
                 [class]="isConfigured ? 'text-green-500' : 'text-yellow-500'" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    [attr.d]="isConfigured ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" [class]="isConfigured ? 'text-green-800' : 'text-yellow-800'">
              {{ isConfigured ? 'Email Service Configured' : 'Email Service Not Configured' }}
            </h3>
            <p class="text-sm" [class]="isConfigured ? 'text-green-700' : 'text-yellow-700'">
              {{ isConfigured ? 'Email notifications are ready to send.' : 'Please configure EmailJS to enable email notifications.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Setup Instructions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Setup Instructions</h2>
        
        <div class="space-y-4">
          <div *ngFor="let instruction of setupInstructions; let i = index" class="flex">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              {{ i + 1 }}
            </div>
            <p class="text-gray-700 text-sm">{{ instruction }}</p>
          </div>
        </div>
      </div>

      <!-- Email Templates -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Email Templates</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Approval Template -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-800 mb-2 flex items-center">
              <span class="text-green-500 mr-2">✅</span>
              Approval Template
            </h3>
            <div class="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">
              <div class="mb-2"><strong>Subject:</strong> ✅ Registration Approved - BNC Portal</div>
              <div class="space-y-1">
                <div>Hello [user_name],</div>
                <div>Your registration has been [status]!</div>
                <div>[status_message]</div>
                <div>Login: [login_url]</div>
                <div>Contact: [contact_phone]</div>
              </div>
            </div>
          </div>

          <!-- Rejection Template -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-800 mb-2 flex items-center">
              <span class="text-red-500 mr-2">❌</span>
              Rejection Template
            </h3>
            <div class="bg-gray-50 rounded p-3 text-xs font-mono text-gray-600">
              <div class="mb-2"><strong>Subject:</strong> ❌ Registration Update - BNC Portal</div>
              <div class="space-y-1">
                <div>Hello [user_name],</div>
                <div>Registration status: [status]</div>
                <div>[status_message]</div>
                <div>Reason: [rejection_reason]</div>
                <div>Contact: [contact_phone]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration File Location -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-blue-800 mb-2">Configuration File</h3>
        <p class="text-blue-700 text-sm mb-2">
          Update your EmailJS credentials in:
        </p>
        <code class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
          src/app/shared/services/email.service.ts
        </code>
        <p class="text-blue-600 text-xs mt-2">
          Replace the placeholder values in the emailConfig object with your actual EmailJS credentials.
        </p>
      </div>

      <!-- Test Configuration -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Test Configuration</h2>
        
        <div *ngIf="!isConfigured" class="text-yellow-600 text-sm mb-4">
          ⚠️ Please configure EmailJS credentials before testing.
        </div>
        
        <button 
          (click)="testEmailConfiguration()" 
          [disabled]="!isConfigured || isTesting"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg *ngIf="isTesting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isTesting ? 'Testing...' : 'Test Email Configuration' }}
        </button>

        <div *ngIf="testResult" class="mt-4 p-3 rounded-lg" 
             [class]="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <p class="text-sm" [class]="testResult.success ? 'text-green-700' : 'text-red-700'">
            {{ testResult.message }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EmailConfigComponent implements OnInit {
  isConfigured = false;
  setupInstructions: string[] = [];
  isTesting = false;
  testResult: { success: boolean; message: string } | null = null;

  constructor(private emailService: EmailService) {}

  ngOnInit() {
    this.isConfigured = this.emailService.isConfigured();
    this.setupInstructions = this.emailService.getSetupInstructions();
  }

  async testEmailConfiguration() {
    this.isTesting = true;
    this.testResult = null;

    try {
      const success = await this.emailService.testEmailConfiguration();
      
      this.testResult = {
        success,
        message: success 
          ? '✅ Email configuration test successful! Check your test email inbox.'
          : '❌ Email configuration test failed. Please check your EmailJS credentials and try again.'
      };
    } catch (error) {
      this.testResult = {
        success: false,
        message: '❌ Error testing email configuration. Check console for details.'
      };
      console.error('Email test error:', error);
    } finally {
      this.isTesting = false;
    }
  }
}