import { atomWithStorage } from "jotai/utils";

const USER_TOKEN = "user/token";

export function getStoredToken() {
  const token = localStorage.getItem(USER_TOKEN);
  if (token) return JSON.parse(token);
  return null;
}

export const tokenAtom = atomWithStorage<string | null>(USER_TOKEN, null);
