import { StrictMode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { routeTree } from "./routeTree.gen";
import { queryClient, queryClientPersister } from "./@data/client";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: queryClientPersister }}
      >
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </PersistQueryClientProvider>
    </StrictMode>
  );
}
