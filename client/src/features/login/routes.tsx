import { Route } from "@tanstack/react-router";

import { LoginPage } from "./pages";
import { unauthenticatedRoute } from "../../routes";

export const loginRoutes = new Route({
  path: "/login",
  component: LoginPage,
  getParentRoute: () => unauthenticatedRoute,
});
