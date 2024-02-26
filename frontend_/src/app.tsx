import { Provider } from "jotai";
import { StrictMode } from "react";
import { rootRouter } from "./router";
import { jotaiStore } from "./atoms/store";
import { RouterProvider } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient, queryClientPersister } from "./@data/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

export default function App() {
  return (
    <StrictMode>
      <Provider store={jotaiStore}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: queryClientPersister }}
        >
          <RouterProvider router={rootRouter} />
          <ReactQueryDevtools />
        </PersistQueryClientProvider>
      </Provider>
    </StrictMode>
  );
}
