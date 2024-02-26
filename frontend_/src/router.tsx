import { routeTree } from "./routeTree.gen";
import { createRouter } from "@tanstack/react-router";

export const rootRouter = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof rootRouter;
  }
}
