/* eslint-disable react-hooks/rules-of-hooks */
import { RootRoute, Route, Router } from "@tanstack/react-router";

import { operationsRoute } from "./features/operations/routes";
import Root from "./App";
import { recordsRoute } from "./features/records/routes";
import { loginRoutes } from "./features/login/routes";
import { useAppReady } from "./features/utils";

export const authenticatedRoute = new Route({
  id: "authenticated",
  path: "/app",
  beforeLoad: () => {},
  component: () => {
    const { isAppReady, isAuthenticated } = useAppReady();

    if (!isAppReady) return null;
    if (!isAuthenticated) {
      // Let the app load before redirecting to login so append the redirect to the end of the event loop.
      setTimeout(() => router.navigate({ to: "/login" }), 1);
      return null;
    }
    return <Root />;
  },
  getParentRoute: () => rootRoute,
});

export const unauthenticatedRoute = new Route({
  id: "unauthenticated",
  path: "/",
  component: () => {
    return <Root />;
  },
  getParentRoute: () => rootRoute,
});

export const rootRoute = new RootRoute();

const routeTree = rootRoute.addChildren([
  unauthenticatedRoute.addChildren([loginRoutes]),
  authenticatedRoute.addChildren([operationsRoute, recordsRoute]),
]);

export const router = new Router({ routeTree });
