import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clientSafeObj<T>(obj: any) {
  try {
    return JSON.parse(JSON.stringify(obj)) as T;
  } catch {}
  return {} as T;
}
