import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clientSafeObj<T>(obj: any) {
  try {
    return JSON.parse(JSON.stringify(obj)) as T;
  } catch {}
  return {} as T;
}

export function getEditorUrl(repo_url: string, sha?: string) {
  const url = `https://vscode.dev/${repo_url.replace('https://github.com', 'github')}`;
  if (!sha) return url;
  return `${url}${url.endsWith('/') ? '' : '/'}commit/${sha}`;
}
