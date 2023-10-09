import { Route } from "@tanstack/react-router";

import { RecordsPage } from "./pages";
import { rootRoute } from "../../routes";

export const recordsRoute = new Route({
  path: "/records",
  component: RecordsPage,
  getParentRoute: () => rootRoute,
});
