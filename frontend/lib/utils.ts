import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clientSafeObj(obj: any) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {}
  return {};
}
