import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Artificial latency to simulate a slow provider, gated by the demo's Delays toggle.
export function delay(ms: number, enabled: boolean) {
  return enabled ? new Promise<void>(resolve => setTimeout(resolve, ms)) : Promise.resolve();
}
