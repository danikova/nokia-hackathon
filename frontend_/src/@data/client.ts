import axios from "axios";
import { getStoredToken } from "../@atoms/user";
import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 48, // 48 hours
    },
  },
});

export const queryClientPersister = createSyncStoragePersister({
  storage: window.localStorage,
});

axios.interceptors.request.use(function (config) {
  const token = getStoredToken();
  if (token) config.headers.Authorization = token;
  return config;
});
