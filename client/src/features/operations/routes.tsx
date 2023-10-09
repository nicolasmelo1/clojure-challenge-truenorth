import { Route } from "@tanstack/react-router";

import { CalculatorPage } from "./pages";
import { rootRoute } from "../../routes";

export const operationsRoute = new Route({
  path: "/operations/calculator",
  component: CalculatorPage,
  getParentRoute: () => rootRoute,
});
