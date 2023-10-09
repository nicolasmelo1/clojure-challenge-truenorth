import { RootRoute, Router } from "@tanstack/react-router";

import { operationsRoute } from "./features/operations/routes";
import Root from "./App";
import { recordsRoute } from "./features/records/routes";

export const rootRoute = new RootRoute({
  component: Root,
});
const routeTree = rootRoute.addChildren([operationsRoute, recordsRoute]);

const router = new Router({ routeTree });
export default router;
