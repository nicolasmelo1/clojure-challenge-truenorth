/* eslint-disable react-hooks/rules-of-hooks */
import { RootRoute, Route, Router } from "@tanstack/react-router";

import {
  operationsRoute,
  randomStringRoute,
} from "./features/operations/routes";
import Root from "./App";
import { recordsRoute } from "./features/records/routes";
import { loginRoutes, registerRoutes } from "./features/login/routes";
import { useAppReady } from "./features/core";
import { Fragment } from "react";

export const authenticatedRoute = new Route({
  id: "authenticated",
  path: "/app",
  component: () => {
    const { isAppReady, isAuthenticated } = useAppReady();

    if (!isAppReady) return null;
    if (!isAuthenticated) {
      // Let the app load before redirecting to login so append the redirect to the end of the event loop.
      setTimeout(() => router.navigate({ to: "/login" }), 1);
      return null;
    }
    return (
      <Fragment>
        <Root />
      </Fragment>
    );
  },
  getParentRoute: () => rootRoute,
});

export const indexRoute = new Route({
  id: "index",
  path: "/",
  component: () => {
    const { isAppReady, isAuthenticated } = useAppReady();
    if (!isAppReady) return null;
    if (!isAuthenticated)
      setTimeout(() => router.navigate({ to: "/login" }), 1);
    else
      setTimeout(
        () => router.navigate({ to: "/app/operations/calculator" }),
        1
      );

    return null;
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
  unauthenticatedRoute.addChildren([indexRoute, loginRoutes, registerRoutes]),
  authenticatedRoute.addChildren([
    operationsRoute,
    randomStringRoute,
    recordsRoute,
  ]),
]);

export const router = new Router({ routeTree });
