export interface Complaint {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  userId: string;
  residentId?: string;
  subject: string;
  description: string;
  category: 'complaint' | 'report' | 'other';
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  barangayResponse?: string;
  attachments?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NewComplaint {
  subject: string;
  description: string;
  category: 'complaint' | 'report' | 'other';
  attachments?: File;
}

// Add this for convenience
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';