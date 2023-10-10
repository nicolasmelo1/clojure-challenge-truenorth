import { Route } from "@tanstack/react-router";

import { LoginPage, RegisterPage } from "./pages";
import { unauthenticatedRoute } from "../../routes";

export const loginRoutes = new Route({
  path: "/login",
  component: LoginPage,
  getParentRoute: () => unauthenticatedRoute,
});

export const registerRoutes = new Route({
  path: "/register",
  component: RegisterPage,
  getParentRoute: () => unauthenticatedRoute,
});
