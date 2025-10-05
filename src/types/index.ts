export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'admin';
  created_at: string;
}

export interface Issue {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'sanitation' | 'safety' | 'environment' | 'utilities' | 'transportation' | 'other';
  location: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  photo_urls: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  user_name: string;
  content: string;
  is_official: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  issue_id: string;
  type: 'status_change' | 'new_comment' | 'resolved' | 'assigned';
  message: string;
  read: boolean;
  created_at: string;
}

export interface Analytics {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  closedIssues: number;
  issuesByCategory: Record<string, number>;
  issuesByLocation: Record<string, number>;
  recentActivity: Issue[];
}
