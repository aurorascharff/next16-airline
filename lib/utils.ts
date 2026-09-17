import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number, enabled: boolean) {
  return enabled ? new Promise<void>(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  weekday: 'short',
});

export function formatDate(date: string) {
  return date ? dateFormatter.format(new Date(`${date}T00:00:00Z`)) : 'Flexible date';
}

export function formatPrice(amount: number) {
  return `€${amount}`;
}
