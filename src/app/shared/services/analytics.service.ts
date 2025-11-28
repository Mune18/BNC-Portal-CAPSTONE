import { Injectable } from '@angular/core';
import { ID } from 'appwrite';
import { BaseAppwriteService } from './BaseAppwrite.service';

interface SiteStatistics {
  $id?: string;
  totalVisits: number;
  dailyVisits: string; // JSON string
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends BaseAppwriteService {
  private readonly DATABASE_ID = '67dd9c370012f6d6fdc0';
  private readonly TABLE_ID = 'site_statistics';
  private readonly ROW_ID = 'main_stats';

  async recordVisit(): Promise<SiteStatistics | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      let stats: SiteStatistics;
      
      // Try to get existing statistics row
      try {
        const response = await this.database.getDocument(
          this.DATABASE_ID,
          this.TABLE_ID,
          this.ROW_ID
        );
        stats = response as unknown as SiteStatistics;
        
        console.log('✅ Found existing stats row:', stats);
      } catch (error: any) {
        // If row doesn't exist, create it
        if (error.code === 404) {
          console.log('📝 Creating new stats row in site_statistics table...');
          
          const newStats = {
            totalVisits: 1,
            dailyVisits: JSON.stringify({ [today]: 1 }),
            lastUpdated: new Date().toISOString()
          };
          
          const created = await this.database.createDocument(
            this.DATABASE_ID,
            this.TABLE_ID,
            this.ROW_ID,
            newStats
          );
          
          console.log('✅ Created stats row:', created);
          return created as unknown as SiteStatistics;
        } else {
          console.error('❌ Error getting row:', error);
          throw error;
        }
      }

      // Parse and update daily visits
      const dailyVisits = JSON.parse(stats.dailyVisits || '{}');
      dailyVisits[today] = (dailyVisits[today] || 0) + 1;

      // Update the row
      const updatedStats = await this.database.updateDocument(
        this.DATABASE_ID,
        this.TABLE_ID,
        this.ROW_ID,
        {
          totalVisits: stats.totalVisits + 1,
          dailyVisits: JSON.stringify(dailyVisits),
          lastUpdated: new Date().toISOString()
        }
      );

      console.log('✅ Updated stats row:', updatedStats);
      return updatedStats as unknown as SiteStatistics;
    } catch (error) {
      console.error('❌ Error recording visit:', error);
      return null;
    }
  }

  async getStatistics(): Promise<SiteStatistics | null> {
    try {
      const response = await this.database.getDocument(
        this.DATABASE_ID,
        this.TABLE_ID,
        this.ROW_ID
      );
      
      return response as unknown as SiteStatistics;
    } catch (error: any) {
      if (error.code === 404) {
        console.log('ℹ️ Stats row not found yet in site_statistics table');
        return null;
      }
      console.error('Error fetching statistics:', error);
      return null;
    }
  }

  async getTodayVisits(): Promise<number> {
    try {
      const stats = await this.getStatistics();
      if (!stats) return 0;

      const today = new Date().toISOString().split('T')[0];
      const dailyVisits = JSON.parse(stats.dailyVisits || '{}');
      return dailyVisits[today] || 0;
    } catch (error) {
      console.error('Error fetching today visits:', error);
      return 0;
    }
  }

  async getActiveSessions(): Promise<number> {
    try {
      // Get total count of users from the users table
      const response = await this.database.listDocuments(
        this.DATABASE_ID,
        '67dd9d7f002618ca37b6' // users table ID
      );
      
      console.log('👥 Total users count:', response.total);
      return response.total;
    } catch (error) {
      console.error('Error fetching total users:', error);
      // Fallback to 0 if error
      return 0;
    }
  }
}
