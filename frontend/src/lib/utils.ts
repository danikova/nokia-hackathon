import { isNil } from 'lodash';
import { twMerge } from 'tailwind-merge';
import { enqueueSnackbar } from 'notistack';
import { type ClassValue, clsx } from 'clsx';
import { BaseRecord } from '@/@data/base.types';
import { ClientResponseError } from 'pocketbase';
import humanizeDuration from 'humanize-duration';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEditorUrl(repo_url: string, sha?: string) {
  const url = `https://vscode.dev/${repo_url.replace('https://github.com', 'github')}`;
  if (!sha) return url;
  return `${url}${url.endsWith('/') ? '' : '/'}commit/${sha}`;
}

// snack wrapper
export async function sw<T>(promise: T, successMessage?: string): Promise<T> {
  try {
    const result = await promise;
    successMessage && enqueueSnackbar(successMessage, { variant: 'success' });
    return result;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
      });
    } else {
      enqueueSnackbar('Some unexpected error occured, sorry :(', {
        variant: 'error',
        preventDuplicate: true,
      });
    }
    throw error;
  }
}

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms',
    },
  },
});

export function getHumaneRunDuration(execution_time: number) {
  return shortEnglishHumanizer((execution_time || 0) * 1000, {
    maxDecimalPoints: 3,
  });
}

export function updateList<T extends BaseRecord>(
  list: T[],
  item: T,
  key: keyof T = 'id'
) {
  const index = list.findIndex(i => i[key] === item[key]);
  if (index === -1) return list;
  const newList = [...list];
  newList[index] = item;
  return newList;
}

export function isDefined<T>(argument: T | undefined | null): argument is T {
  return !isNil(argument);
}
