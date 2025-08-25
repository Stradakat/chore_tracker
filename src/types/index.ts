export interface Chore {
  id: string;
  name: string;
  description: string;
  category: ChoreCategory;
  frequency: Frequency;
  completionsPerDay?: number; // Number of times per day this chore needs to be done
  estimatedTime: number; // in minutes
  assignee?: string;
  isActive: boolean;
  createdAt: Date;
  lastCompleted?: Date;
  nextDueDate: Date;
  completedToday?: number; // Track how many times completed today
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  completedBy: string;
  completedAt: Date;
  rating?: number; // 1-5 stars
  notes?: string;
  timeSpent?: number; // actual time spent in minutes
}

export interface HouseholdMember {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ChoreCategory = 
  | 'Pet Care'
  | 'Kitchen'
  | 'Bathroom'
  | 'Bedroom'
  | 'Living Room'
  | 'Laundry'
  | 'Outdoor'
  | 'General Cleaning'
  | 'Maintenance';

export type Frequency = 
  | 'Daily'
  | 'Multiple Daily'
  | 'Weekly'
  | 'Bi-weekly'
  | 'Monthly'
  | 'Quarterly'
  | 'As Needed';

export interface FilterOptions {
  search: string;
  category: ChoreCategory | 'All';
  frequency: Frequency | 'All';
  assignee: string | 'All';
  status: 'All' | 'Overdue' | 'Due Soon' | 'Completed';
}

export interface Statistics {
  totalChores: number;
  completedToday: number;
  completedThisWeek: number;
  overdueChores: number;
  dueSoonChores: number;
  categoryBreakdown: Record<ChoreCategory, number>;
  memberPerformance: Record<string, { completed: number; total: number }>;
}
