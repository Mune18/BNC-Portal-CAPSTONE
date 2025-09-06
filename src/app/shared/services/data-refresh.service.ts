import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {
  private refreshSubjects = new Map<string, Subject<void>>();

  // Get or create a refresh subject for a specific data type
  getRefreshSubject(dataType: string): Subject<void> {
    if (!this.refreshSubjects.has(dataType)) {
      this.refreshSubjects.set(dataType, new Subject<void>());
    }
    return this.refreshSubjects.get(dataType)!;
  }

  // Trigger refresh for a specific data type
  triggerRefresh(dataType: string): void {
    const subject = this.getRefreshSubject(dataType);
    subject.next();
  }

  // Trigger refresh for multiple data types
  triggerMultipleRefresh(dataTypes: string[]): void {
    dataTypes.forEach(dataType => this.triggerRefresh(dataType));
  }

  // Get observable for a specific data type
  onRefresh(dataType: string) {
    return this.getRefreshSubject(dataType).asObservable();
  }
}
