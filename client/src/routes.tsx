import { RootRoute, Router } from "@tanstack/react-router";

import Root from "./App";

export const rootRoute = new RootRoute({
  component: Root,
});
const routeTree = rootRoute.addChildren([]);

const router = new Router({ routeTree });
export default router;
