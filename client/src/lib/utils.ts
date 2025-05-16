import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getDaysRemaining(deadline: Date | string): number {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  
  // Set both dates to midnight for accurate day calculation
  const deadlineMidnight = new Date(deadlineDate);
  deadlineMidnight.setHours(0, 0, 0, 0);
  
  const nowMidnight = new Date(now);
  nowMidnight.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineMidnight.getTime() - nowMidnight.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

export function formatDeadline(deadline: Date | string): string {
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline;
  const daysRemaining = getDaysRemaining(deadlineDate);
  
  if (daysRemaining === 0) {
    return `Today (${format(deadlineDate, 'MMM d, yyyy')})`;
  } else if (daysRemaining === 1) {
    return `Tomorrow (${format(deadlineDate, 'MMM d, yyyy')})`;
  } else {
    return `${format(deadlineDate, 'MMM d, yyyy')} (${daysRemaining} days left)`;
  }
}

export function calculateProgress(current: number, goal?: number): number {
  if (!goal || goal <= 0) return 100;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
