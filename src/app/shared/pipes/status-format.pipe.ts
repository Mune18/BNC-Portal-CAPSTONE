import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    switch (value) {
      case 'pending':
        return 'Pending';
      case 'in_review':
        return 'In Review';
      case 'resolved':
        return 'Resolved';
      case 'rejected':
        return 'Declined';
      default:
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}