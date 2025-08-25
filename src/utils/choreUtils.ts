import { Chore, ChoreCompletion, FilterOptions, Statistics, ChoreCategory } from '../types';

export const calculateNextDueDate = (chore: Chore, lastCompleted?: Date): Date => {
  const baseDate = lastCompleted || chore.createdAt;
  
  // Ensure baseDate is a valid Date object
  if (!baseDate || !(baseDate instanceof Date) || isNaN(baseDate.getTime())) {
    // If no valid base date, use current time
    return new Date();
  }
  
  const now = new Date();
  
  switch (chore.frequency) {
    case 'Daily':
      return new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
    case 'Multiple Daily':
      // For multiple daily, calculate next due time based on completions per day
      if (chore.completionsPerDay) {
        const hoursBetweenCompletions = 24 / chore.completionsPerDay;
        const nextDueTime = baseDate.getTime() + (hoursBetweenCompletions * 60 * 60 * 1000);
        return new Date(nextDueTime);
      }
      return new Date(baseDate.getTime() + 24 * 60 * 60 * 1000);
    case 'Weekly':
      return new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'Bi-weekly':
      return new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    case 'Monthly':
      return new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    case 'Quarterly':
      return new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    case 'As Needed':
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // Set to far future
    default:
      return new Date();
  }
};

export const isOverdue = (chore: Chore): boolean => {
  if (chore.frequency === 'Multiple Daily' && chore.completionsPerDay) {
    // For multiple daily chores, check if we've completed enough times today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    // If it's a new day, check if we need to start the first completion
    if (chore.lastCompleted && chore.lastCompleted instanceof Date && !isNaN(chore.lastCompleted.getTime()) && chore.lastCompleted < startOfDay) {
      return true; // Overdue for today's first completion
    }
    
    // If we've completed some today, check if we're overdue for the next one
    if (chore.completedToday && chore.completedToday < chore.completionsPerDay) {
      // Ensure lastCompleted is a valid Date before calling getTime()
      if (chore.lastCompleted && chore.lastCompleted instanceof Date && !isNaN(chore.lastCompleted.getTime())) {
        const hoursSinceLastCompletion = (today.getTime() - chore.lastCompleted.getTime()) / (60 * 60 * 1000);
        const expectedHoursBetweenCompletions = 24 / chore.completionsPerDay;
        
        if (hoursSinceLastCompletion > expectedHoursBetweenCompletions) {
          return true; // Overdue for next completion
        }
      } else {
        // If lastCompleted is invalid, consider it overdue
        return true;
      }
    }
    
    return false;
  }
  
  // For regular chores, check if nextDueDate is valid before comparison
  if (!chore.nextDueDate || !(chore.nextDueDate instanceof Date) || isNaN(chore.nextDueDate.getTime())) {
    return false; // Can't determine if overdue with invalid date
  }
  
  return new Date() > chore.nextDueDate;
};

export const isDueSoon = (chore: Chore): boolean => {
  if (chore.frequency === 'Multiple Daily' && chore.completionsPerDay) {
    // For multiple daily chores, check if we're approaching the next due time
    const now = new Date();
    const lastCompletion = chore.lastCompleted || chore.createdAt;
    
    // Ensure lastCompletion is a valid Date object
    if (!lastCompletion || !(lastCompletion instanceof Date) || isNaN(lastCompletion.getTime())) {
      // If no valid completion date, consider it due soon
      return true;
    }
    
    const hoursSinceLastCompletion = (now.getTime() - lastCompletion.getTime()) / (60 * 60 * 1000);
    const expectedHoursBetweenCompletions = 24 / chore.completionsPerDay;
    
    // Due soon if we're within 1 hour of the next expected completion
    return hoursSinceLastCompletion >= (expectedHoursBetweenCompletions - 1) && 
           hoursSinceLastCompletion < expectedHoursBetweenCompletions;
  }
  
  const now = new Date();
  const dueDate = new Date(chore.nextDueDate);
  
  // Ensure dueDate is valid
  if (isNaN(dueDate.getTime())) {
    return false;
  }
  
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 2 && diffDays >= 0;
};

export const getChoreStatus = (chore: Chore): 'overdue' | 'due-soon' | 'on-time' => {
  if (isOverdue(chore)) return 'overdue';
  if (isDueSoon(chore)) return 'due-soon';
  return 'on-time';
};

export const getCompletionProgress = (chore: Chore): { completed: number; total: number; percentage: number } => {
  if (chore.frequency === 'Multiple Daily' && chore.completionsPerDay) {
    const completed = chore.completedToday || 0;
    const total = chore.completionsPerDay;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }
  
  // For non-multiple daily chores, return simple completion status
  return { completed: chore.lastCompleted ? 1 : 0, total: 1, percentage: chore.lastCompleted ? 100 : 0 };
};

export const filterChores = (chores: Chore[], filters: FilterOptions): Chore[] => {
  return chores.filter(chore => {
    // Search filter
    if (filters.search && !chore.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'All' && chore.category !== filters.category) {
      return false;
    }
    
    // Frequency filter
    if (filters.frequency !== 'All' && chore.frequency !== filters.frequency) {
      return false;
    }
    
    // Assignee filter
    if (filters.assignee !== 'All' && chore.assignee !== filters.assignee) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'All') {
      const status = getChoreStatus(chore);
      if (filters.status === 'Overdue' && status !== 'overdue') return false;
      if (filters.status === 'Due Soon' && status !== 'due-soon') return false;
      if (filters.status === 'Completed' && !chore.lastCompleted) return false;
    }
    
    return true;
  });
};

export const generateStatistics = (
  chores: Chore[], 
  completions: ChoreCompletion[], 
  members: { id: string; name: string }[]
): Statistics => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const completedToday = completions.filter(c => 
    new Date(c.completedAt) >= today
  ).length;
  
  const completedThisWeek = completions.filter(c => 
    new Date(c.completedAt) >= weekAgo
  ).length;
  
  const overdueChores = chores.filter(isOverdue).length;
  const dueSoonChores = chores.filter(isDueSoon).length;
  
  const categoryBreakdown = chores.reduce((acc, chore) => {
    acc[chore.category] = (acc[chore.category] || 0) + 1;
    return acc;
  }, {} as Record<ChoreCategory, number>);
  
  const memberPerformance = members.reduce((acc, member) => {
    const memberCompletions = completions.filter(c => c.completedBy === member.id);
    const memberChores = chores.filter(c => c.assignee === member.id);
    
    acc[member.name] = {
      completed: memberCompletions.length,
      total: memberChores.length
    };
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);
  
  return {
    totalChores: chores.length,
    completedToday,
    completedThisWeek,
    overdueChores,
    dueSoonChores,
    categoryBreakdown,
    memberPerformance
  };
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

export const formatDate = (date: Date | string | null | undefined): string => {
  // Handle invalid or missing dates
  if (!date) {
    return 'Never';
  }
  
  // Convert string to Date if needed
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return 'Invalid Date';
  }
  
  // Validate the Date object
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const getStatusColor = (status: 'overdue' | 'due-soon' | 'on-time'): string => {
  switch (status) {
    case 'overdue':
      return 'border-gentleRed bg-gentleRed/10';
    case 'due-soon':
      return 'border-amberYellow bg-amberYellow/10';
    case 'on-time':
      return 'border-freshGreen bg-freshGreen/10';
    default:
      return 'border-lightGray bg-lightGray/10';
  }
};

export const getStatusText = (status: 'overdue' | 'due-soon' | 'on-time'): string => {
  switch (status) {
    case 'overdue':
      return 'Overdue';
    case 'due-soon':
      return 'Due Soon';
    case 'on-time':
      return 'On Time';
    default:
      return 'Unknown';
  }
};
