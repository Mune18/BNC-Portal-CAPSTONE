import { Injectable } from '@angular/core';
import { BaseAppwriteService } from './BaseAppwrite.service';
import { Router } from '@angular/router';
import { Query } from 'appwrite';
import { environment } from '../../environment/environment';
import { AdminService } from './admin.service';
import { ComplaintService } from './complaint.service';
import { ResidentUpdateService } from './resident-update.service';
import { AnnouncementService } from './announcement.service';

export interface Notification {
  id: string;
  type: 'new_registration' | 'complaint' | 'update_request' | 'announcement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  relatedId?: string;
  userId?: string; // Add userId for user-specific notifications
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseAppwriteService {
  private readNotifications: Set<string> = new Set();
  private lastNotificationCheck: Date = new Date();

  constructor(
    router: Router,
    private adminService: AdminService,
    private complaintService: ComplaintService,
    private residentUpdateService: ResidentUpdateService,
    private announcementService: AnnouncementService
  ) {
    super(router);
    this.loadReadNotifications();
  }

  async getAllNotifications(): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];

      // Get all notification types in parallel
      const [
        pendingRegistrations,
        pendingComplaints,
        pendingUpdateRequests,
        recentAnnouncements
      ] = await Promise.all([
        this.getNewRegistrationNotifications(),
        this.getComplaintNotifications(),
        this.getUpdateRequestNotifications(),
        this.getAnnouncementNotifications()
      ]);

      notifications.push(
        ...pendingRegistrations,
        ...pendingComplaints,
        ...pendingUpdateRequests,
        ...recentAnnouncements
      );

      // Sort by timestamp (newest first) and priority
        return notifications.sort((a, b) => {
          // First sort by priority (high, medium, low)
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          // Then by timestamp (newest first)
          return b.timestamp.getTime() - a.timestamp.getTime();
        }).map(notification => {
          // Apply read status from localStorage
          notification.isRead = this.readNotifications.has(notification.id);
          return notification;
        });

      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    }

    async hasNewNotifications(): Promise<boolean> {
      try {
        const notifications = await this.getAllNotifications();
        return notifications.some(n => n.timestamp > this.lastNotificationCheck && !n.isRead);
      } catch (error) {
        console.error('Error checking for new notifications:', error);
        return false;
      }
    }

    updateLastNotificationCheck(): void {
      this.lastNotificationCheck = new Date();
    }  private async getNewRegistrationNotifications(): Promise<Notification[]> {
    try {
      const pendingResidents = await this.adminService.getPendingResidents();
      
      return pendingResidents.map(resident => {
        const createdAt = new Date(resident.$createdAt || '');
        const hoursAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
        
        // Determine priority based on how long it's been pending
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (hoursAgo > 72) priority = 'high'; // More than 3 days
        else if (hoursAgo > 24) priority = 'medium'; // More than 1 day
        else priority = 'low'; // Less than 1 day

        return {
          id: `registration_${resident.$id}`,
          type: 'new_registration' as const,
          title: 'New Resident Registration',
          message: `${resident.personalInfo.firstName} ${resident.personalInfo.lastName} registered ${this.getTimeAgo(createdAt)}`,
          timestamp: createdAt,
          isRead: false,
          actionUrl: `/admin/residents?filter=pending&highlight=${resident.$id}`,
          priority,
          relatedId: resident.$id
        };
      });
    } catch (error) {
      console.error('Error fetching registration notifications:', error);
      return [];
    }
  }

  private async getComplaintNotifications(): Promise<Notification[]> {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      const pendingComplaints = complaints.filter(c => 
        c.status === 'pending' || c.status === 'in_review'
      );

      return pendingComplaints.map(complaint => {
        const createdAt = new Date(complaint.createdAt);
        const hoursAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
        
        // Determine priority based on how long it's been pending
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (hoursAgo > 48) priority = 'high'; // More than 2 days
        else if (hoursAgo > 12) priority = 'medium'; // More than 12 hours
        else priority = 'low'; // Less than 12 hours

        return {
          id: `complaint_${complaint.$id}`,
          type: 'complaint' as const,
          title: complaint.status === 'pending' ? 'New Complaint Filed' : 'Complaint Under Review',
          message: `"${complaint.subject}" filed ${this.getTimeAgo(createdAt)}`,
          timestamp: createdAt,
          isRead: false,
          actionUrl: `/admin/reports?highlight=${complaint.$id}`,
          priority,
          relatedId: complaint.$id
        };
      });
    } catch (error) {
      console.error('Error fetching complaint notifications:', error);
      return [];
    }
  }

  private async getUpdateRequestNotifications(): Promise<Notification[]> {
    try {
      const updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      const pendingRequests = updateRequests.filter(request => 
        request.status === 'pending'
      );

      return pendingRequests.map(request => {
        const createdAt = new Date(request.createdAt);
        const hoursAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
        
        // Determine priority based on how long it's been pending
        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (hoursAgo > 36) priority = 'high'; // More than 1.5 days
        else if (hoursAgo > 12) priority = 'medium'; // More than 12 hours
        else priority = 'low'; // Less than 12 hours

        return {
          id: `update_${request.$id}`,
          type: 'update_request' as const,
          title: 'Information Update Request',
          message: `Update request submitted ${this.getTimeAgo(createdAt)}`,
          timestamp: createdAt,
          isRead: false,
          actionUrl: `/admin/update-requests?highlight=${request.$id}`,
          priority,
          relatedId: request.$id
        };
      });
    } catch (error) {
      console.error('Error fetching update request notifications:', error);
      return [];
    }
  }

  private async getAnnouncementNotifications(): Promise<Notification[]> {
    try {
      const announcements = await this.announcementService.getAllAnnouncements();
      const recentAnnouncements = announcements
        .filter(announcement => {
          const createdAt = new Date(announcement.createdAt);
          const hoursAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60));
          return hoursAgo <= 24 && announcement.status === 'active'; // Only last 24 hours
        })
        .slice(0, 3); // Limit to 3 most recent

      return recentAnnouncements.map(announcement => {
        const createdAt = new Date(announcement.createdAt);

        return {
          id: `announcement_${announcement.$id}`,
          type: 'announcement' as const,
          title: 'New Announcement Published',
          message: `"${announcement.title}" was published ${this.getTimeAgo(createdAt)}`,
          timestamp: createdAt,
          isRead: false,
          actionUrl: `/admin/announcements?highlight=${announcement.$id}`,
          priority: 'low' as const,
          relatedId: announcement.$id
        };
      });
    } catch (error) {
      console.error('Error fetching announcement notifications:', error);
      return [];
    }
  }

  async getUnreadCount(): Promise<number> {
    const notifications = await this.getAllNotifications();
    return notifications.filter(n => !n.isRead).length;
  }

  async getHighPriorityCount(): Promise<number> {
    const notifications = await this.getAllNotifications();
    return notifications.filter(n => n.priority === 'high' && !n.isRead).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    this.readNotifications.add(notificationId);
    this.saveReadNotifications();
  }

  async markAllAsRead(): Promise<void> {
    const notifications = await this.getAllNotifications();
    notifications.forEach(n => this.readNotifications.add(n.id));
    this.saveReadNotifications();
  }

  private loadReadNotifications(): void {
    try {
      const stored = localStorage.getItem('bnc_read_notifications');
      if (stored) {
        this.readNotifications = new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading read notifications:', error);
      this.readNotifications = new Set();
    }
  }

  private saveReadNotifications(): void {
    try {
      localStorage.setItem('bnc_read_notifications', JSON.stringify([...this.readNotifications]));
    } catch (error) {
      console.error('Error saving read notifications:', error);
    }
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'new_registration':
        return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z';
      case 'complaint':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'update_request':
        return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
      case 'announcement':
        return 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z';
      default:
        return 'M15 17h5l-5 5v-5zM4 7h16M4 12h16M4 17h11';
    }
  }

  getNotificationColor(type: Notification['type']): string {
    switch (type) {
      case 'new_registration':
        return 'text-blue-600 bg-blue-100';
      case 'complaint':
        return 'text-red-600 bg-red-100';
      case 'update_request':
        return 'text-yellow-600 bg-yellow-100';
      case 'announcement':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];

      // Get user-specific notifications in parallel
      const [
        userComplaints,
        userUpdateRequests,
        recentAnnouncements
      ] = await Promise.all([
        this.getUserComplaintNotifications(userId),
        this.getUserUpdateRequestNotifications(userId),
        this.getAnnouncementNotifications()
      ]);

      notifications.push(
        ...userComplaints,
        ...userUpdateRequests,
        ...recentAnnouncements
      );

      // Sort by timestamp (newest first) and priority
      return notifications.sort((a, b) => {
        // First sort by priority (high, medium, low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        // Then by timestamp (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime();
      }).map(notification => {
        // Apply read status from localStorage
        notification.isRead = this.readNotifications.has(notification.id);
        return notification;
      });

    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  private async getUserComplaintNotifications(userId: string): Promise<Notification[]> {
    try {
      const complaints = await this.complaintService.getAllComplaints();
      const userComplaints = complaints.filter(c => c.userId === userId);

      return userComplaints.map(complaint => {
        const createdAt = new Date(complaint.createdAt);
        const updatedAt = new Date(complaint.updatedAt || complaint.createdAt);
        const isNewUpdate = updatedAt.getTime() > createdAt.getTime();
        
        let priority: 'low' | 'medium' | 'high' = 'low';
        let title = 'Complaint Status Update';
        let message = '';

        switch (complaint.status) {
          case 'pending':
            title = 'Complaint Submitted';
            message = `Your complaint "${complaint.subject}" has been submitted and is pending review`;
            priority = 'medium';
            break;
          case 'in_review':
            title = 'Complaint Under Review';
            message = `Your complaint "${complaint.subject}" is now under review by admin`;
            priority = 'medium';
            break;
          case 'resolved':
            title = 'Complaint Resolved';
            message = `Your complaint "${complaint.subject}" has been resolved`;
            priority = 'high';
            break;
          case 'rejected':
            title = 'Complaint Declined';
            message = `Your complaint "${complaint.subject}" has been declined`;
            priority = 'high';
            break;
        }

        return {
          id: `user_complaint_${complaint.$id}`,
          type: 'complaint' as const,
          title,
          message,
          timestamp: isNewUpdate ? updatedAt : createdAt,
          isRead: false,
          actionUrl: `/user/complaints?highlight=${complaint.$id}`,
          priority,
          relatedId: complaint.$id
        };
      });
    } catch (error) {
      console.error('Error fetching user complaint notifications:', error);
      return [];
    }
  }

  private async getUserUpdateRequestNotifications(userId: string): Promise<Notification[]> {
    try {
      const updateRequests = await this.residentUpdateService.getAllUpdateRequests();
      const userRequests = updateRequests.filter(request => request.userId === userId);

      return userRequests.map(request => {
        const createdAt = new Date(request.createdAt);
        const reviewedAt = new Date(request.reviewedAt || request.createdAt);
        const isNewUpdate = request.reviewedAt && reviewedAt.getTime() > createdAt.getTime();
        
        let priority: 'low' | 'medium' | 'high' = 'low';
        let title = 'Information Update Request';
        let message = '';

        switch (request.status) {
          case 'pending':
            title = 'Update Request Submitted';
            message = `Your information update request is pending review`;
            priority = 'medium';
            break;
          case 'approved':
            title = 'Update Request Approved';
            message = `Your information update request has been approved`;
            priority = 'high';
            break;
          case 'rejected':
            title = 'Update Request Declined';
            message = `Your information update request has been declined`;
            priority = 'high';
            break;
        }

        return {
          id: `user_update_${request.$id}`,
          type: 'update_request' as const,
          title,
          message,
          timestamp: isNewUpdate ? reviewedAt : createdAt,
          isRead: false,
          actionUrl: `/user/profile?highlight=update-request`,
          priority,
          relatedId: request.$id
        };
      });
    } catch (error) {
      console.error('Error fetching user update request notifications:', error);
      return [];
    }
  }

  async getUserUnreadCount(userId: string): Promise<number> {
    try {
      const userNotifications = await this.getUserNotifications(userId);
      return userNotifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error getting user unread count:', error);
      return 0;
    }
  }
}