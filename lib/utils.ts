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

export function boardingTime(departureTime: string) {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const total = (hours * 60 + minutes - 40 + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
