import { Route } from "@tanstack/react-router";

import { CalculatorPage, RandomStringPage } from "./pages";
import { authenticatedRoute } from "../../routes";

export const operationsRoute = new Route({
  path: "/operations/calculator",
  component: CalculatorPage,
  getParentRoute: () => authenticatedRoute,
});

export const randomStringRoute = new Route({
  path: "/operations/random-string",
  component: RandomStringPage,
  getParentRoute: () => authenticatedRoute,
});
