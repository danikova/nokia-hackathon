import { atomWithStorage } from "jotai/utils";

const USER_TOKEN = "user/token";

export function getStoredToken() {
  return localStorage.getItem(USER_TOKEN);
}

export const tokenAtom = atomWithStorage<string | null>(USER_TOKEN, null);
