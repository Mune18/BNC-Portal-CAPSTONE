export interface ResidentUpdate {
  // Appwrite document properties
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  
  // Required fields
  residentId: string;     // ID of the resident document being updated
  userId: string;         // Appwrite auth user ID who made the request
  changesJSON: string;    // JSON string of the changes/new values
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;      // ISO date string
  
  // Optional fields
  reason?: string;        // Reason for rejection (if status is rejected)
  reviewedAt?: string;    // ISO date string when admin reviewed
  reviewedBy?: string;    // Admin user ID who reviewed
  attachments?: string;   // Additional attachments if needed
}

export interface ResidentUpdateRequest {
  residentId: string;
  userId: string;
  changes: Partial<ResidentInfo>;  // The changed fields only
}

export interface ResidentUpdateReview {
  updateId: string;
  action: 'approve' | 'reject';
  reason?: string;  // Required for rejection
  reviewedBy: string;
}
