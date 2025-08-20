export interface Announcement {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  content: string;
  authorId: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'archived';
}

export interface NewAnnouncement {
  title: string;
  content: string;
  image?: File;
}