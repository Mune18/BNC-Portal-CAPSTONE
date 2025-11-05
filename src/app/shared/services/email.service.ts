import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environment/environment';

export interface EmailNotificationData {
  userEmail: string;
  userName: string;
  isApproved: boolean;
  reason?: string;
  additionalData?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly emailConfig = {
    serviceId: 'service_824r509', // Replace with your EmailJS service ID
    publicKey: 'Aizf_XK4QDzWIRFyI', // Replace with your EmailJS public key
    templates: {
      approval: 'template_approval_bnc', // Replace with your template ID
      rejection: 'template_rejection_bnc' // Replace with your template ID
    }
  };

  constructor() {
    // Initialize EmailJS with public key
    emailjs.init(this.emailConfig.publicKey);
  }

  /**
   * Send registration status notification email
   */
  async sendRegistrationStatusEmail(data: EmailNotificationData): Promise<boolean> {
    try {
      const templateParams = this.buildEmailTemplate(data);
      const templateId = data.isApproved 
        ? this.emailConfig.templates.approval 
        : this.emailConfig.templates.rejection;

      console.log('Sending email notification...', {
        to: data.userEmail,
        template: templateId,
        status: data.isApproved ? 'APPROVED' : 'REJECTED'
      });

      const response = await emailjs.send(
        this.emailConfig.serviceId,
        templateId,
        templateParams,
        this.emailConfig.publicKey
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      
      // Log specific error details for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      // Don't throw error - email failure shouldn't break the approval flow
      return false;
    }
  }

  /**
   * Build email template parameters
   */
  private buildEmailTemplate(data: EmailNotificationData): Record<string, any> {
    const baseParams = {
      to_email: data.userEmail,
      user_name: data.userName,
      app_name: 'BNC Portal',
      barangay_name: 'Barangay New Cabalan',
      contact_phone: '(047) 224-2176',
      contact_email: 'rodgeromerb.muni@gmail.com',
      office_address: 'Corner Mabini St., Purok 2, New Cabalan, Olongapo City',
      office_hours: 'Monday to Friday, 8:00 AM - 5:00 PM',
      login_url: this.getLoginUrl(),
      current_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      current_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    if (data.isApproved) {
      return {
        ...baseParams,
        status: 'APPROVED',
        status_emoji: '✅',
        status_message: 'Your registration has been approved by the Barangay Administrator.',
        action_message: 'You can now login to your account and access all barangay services including announcements, and complaint filing.',
        next_steps: 'Click the login button below to access your account.',
        button_text: 'Login to Your Account',
        button_color: '#10b981' // Green color
      };
    } else {
      return {
        ...baseParams,
        status: 'REJECTED',
        status_emoji: '❌',
        status_message: 'Your registration was not approved at this time.',
        action_message: data.reason || 'Please contact the barangay office for more information about your application.',
        next_steps: 'You may visit our office during business hours to discuss your application or submit a new registration with the required documents.',
        button_text: 'Contact Office',
        button_color: '#ef4444', // Red color
        rejection_reason: data.reason || '', // Make sure this is always a string
        has_reason: data.reason ? 'true' : 'false' // Add this for conditional display
      };
    }
  }

  /**
   * Get the appropriate login URL based on environment
   */
  private getLoginUrl(): string {
    if (environment.production) {
      return 'https://bnc-portal-capstone.vercel.app/sign-in'; // Replace with your production URL
    }
    return 'http://localhost:4200/auth/sign-in';
  }

  /**
   * Validate email configuration
   */
  isConfigured(): boolean {
    return (
      this.emailConfig.serviceId == 'service_824r509' &&
      this.emailConfig.publicKey == 'Aizf_XK4QDzWIRFyI' &&
      this.emailConfig.templates.approval == 'template_approval_bnc' &&
      this.emailConfig.templates.rejection == 'template_rejection_bnc'
    );
  }

  /**
   * Test email configuration (for development)
   */
  async testEmailConfiguration(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email service not configured. Please update email.service.ts with your EmailJS credentials.');
      return false;
    }

    try {
      const testData: EmailNotificationData = {
        userEmail: 'rodgeromerb.muni@gmail.com',
        userName: 'Rodge Romer B. Muni',
        isApproved: true
      };

      return await this.sendRegistrationStatusEmail(testData);
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return false;
    }
  }

  /**
   * Get setup instructions for EmailJS
   */
  getSetupInstructions(): string[] {
    return [
      '1. Go to https://www.emailjs.com and create a free account',
      '2. Add an email service (Gmail, Outlook, etc.)',
      '3. Create two email templates: one for approval, one for rejection',
      '4. Copy your Service ID, Public Key, and Template IDs',
      '5. Update the emailConfig in email.service.ts',
      '6. Test the configuration using testEmailConfiguration()'
    ];
  }
}