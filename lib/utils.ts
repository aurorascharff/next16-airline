import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(duration: number, enabled = true) {
  if (!enabled) return;
  await new Promise(resolve => setTimeout(resolve, duration));
}
