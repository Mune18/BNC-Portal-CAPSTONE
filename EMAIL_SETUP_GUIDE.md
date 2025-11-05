# Email Notification System - Setup Guide

## Overview
This system sends automatic email notifications to users when their registration is approved or rejected by the admin.

## 🚀 Quick Setup with EmailJS

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (Recommended for testing)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - **Custom SMTP**
4. Follow the setup instructions for your provider
5. Note your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Templates

#### Approval Template
1. Go to "Email Templates" → "Create New Template"
2. Template ID: `template_approval_bnc`
3. Subject: `✅ Registration Approved - BNC Portal`
4. Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
    <h1>{{status_emoji}} Registration {{status}}</h1>
  </div>
  
  <div style="padding: 20px; background: #f9f9f9;">
    <h2>Hello {{user_name}},</h2>
    
    <p style="font-size: 16px; line-height: 1.5;">
      Great news! {{status_message}}
    </p>
    
    <p style="font-size: 16px; line-height: 1.5;">
      {{action_message}}
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{login_url}}" 
         style="background: {{button_color}}; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        {{button_text}}
      </a>
    </div>
    
    <hr style="margin: 30px 0; border: 1px solid #ddd;">
    
    <div style="font-size: 14px; color: #666;">
      <h3>{{barangay_name}} Contact Information</h3>
      <p><strong>Office Hours:</strong> {{office_hours}}</p>
      <p><strong>Phone:</strong> {{contact_phone}}</p>
      <p><strong>Email:</strong> {{contact_email}}</p>
      <p><strong>Address:</strong> {{office_address}}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
      <p>This email was sent on {{current_date}} at {{current_time}}</p>
      <p>{{app_name}} - {{barangay_name}}</p>
    </div>
  </div>
</div>
```

#### Rejection Template
1. Create another template with ID: `template_rejection_bnc`
2. Subject: `❌ Registration Update - BNC Portal`
3. Content: (Similar to approval but with rejection styling)
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
    <h1>{{status_emoji}} Registration {{status}}</h1>
  </div>
  
  <div style="padding: 20px; background: #f9f9f9;">
    <h2>Hello {{user_name}},</h2>
    
    <p style="font-size: 16px; line-height: 1.5;">
      {{status_message}}
    </p>
    
    <p style="font-size: 16px; line-height: 1.5;">
      {{action_message}}
    </p>
    
    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
      <strong>Reason:</strong> {{rejection_reason}}
    </div>
    
    <hr style="margin: 30px 0; border: 1px solid #ddd;">
    
    <div style="font-size: 14px; color: #666;">
      <h3>{{barangay_name}} Contact Information</h3>
      <p><strong>Office Hours:</strong> {{office_hours}}</p>
      <p><strong>Phone:</strong> {{contact_phone}}</p>
      <p><strong>Email:</strong> {{contact_email}}</p>
      <p><strong>Address:</strong> {{office_address}}</p>
    </div>
  </div>
</div>
```

### Step 4: Get API Keys
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `user_abc123xyz`)

### Step 5: Configure the Application
1. Open `src/app/shared/services/email.service.ts`
2. Update the `emailConfig` object:

```typescript
private readonly emailConfig = {
  serviceId: 'service_abc123',        // Your Service ID
  publicKey: 'user_abc123xyz',        // Your Public Key
  templates: {
    approval: 'template_approval_bnc',   // Your approval template ID
    rejection: 'template_rejection_bnc'  // Your rejection template ID
  }
};
```

### Step 6: Test the Configuration
1. Run your application
2. Go to the Email Configuration page in admin panel
3. Click "Test Email Configuration"
4. Check if test email is received

## 🔧 Configuration Options

### Environment-specific URLs
Update the production URL in `email.service.ts`:
```typescript
private getLoginUrl(): string {
  if (environment.production) {
    return 'https://your-domain.com/auth/sign-in'; // Replace with your domain
  }
  return 'http://localhost:4200/auth/sign-in';
}
```

### Customizing Email Content
All email content is configured in the `buildEmailTemplate()` method in `email.service.ts`. You can modify:
- Contact information
- Office hours
- Messages
- Styling
- Additional fields

## 🚨 Troubleshooting

### Common Issues

1. **"Service not found" error**
   - Check your Service ID is correct
   - Ensure the email service is active in EmailJS

2. **"Template not found" error**
   - Verify template IDs match exactly
   - Check templates are published in EmailJS

3. **"Authentication failed" error**
   - Confirm your Public Key is correct
   - Check if you're using the right account

4. **Emails not sending**
   - Check your email service limits (EmailJS free tier: 200 emails/month)
   - Verify your email service credentials
   - Check spam folder

5. **Template variables not working**
   - Ensure variable names match between service and template
   - Check for typos in variable names

### Email Service Limits
- **EmailJS Free**: 200 emails/month, 50 emails/day
- **EmailJS Personal**: 1,000 emails/month
- **EmailJS Team**: 10,000 emails/month

## 🎯 Production Recommendations

### For Production Use:
1. **Use a dedicated email service** (SendGrid, Mailgun, etc.)
2. **Set up proper SPF/DKIM records** for your domain
3. **Use a professional email address** (noreply@your-domain.com)
4. **Monitor email delivery rates**
5. **Implement email queuing** for high volume

### Security Best Practices:
1. **Never expose private keys** in client-side code
2. **Use environment variables** for sensitive configuration
3. **Implement rate limiting** to prevent abuse
4. **Validate email addresses** before sending
5. **Log email activities** for auditing

## 📧 Migration to Appwrite Functions (Advanced)

For production environments, consider migrating to Appwrite Functions for better security and control:

1. Create Appwrite Function with Node.js runtime
2. Install nodemailer or similar server-side email library
3. Move email logic to the function
4. Call function from admin service instead of client-side EmailJS

This approach provides:
- Better security (server-side email sending)
- More reliable delivery
- Better error handling
- Professional email infrastructure

## 📝 Maintenance

### Regular Tasks:
1. **Monitor email delivery rates**
2. **Update contact information** as needed
3. **Review and update email templates** periodically
4. **Check EmailJS usage limits**
5. **Test email functionality** monthly

### Log Monitoring:
Check browser console for email-related logs:
- Successful sends: "Email sent successfully"
- Failures: "Failed to send email notification"
- Configuration issues: "Email service not configured"