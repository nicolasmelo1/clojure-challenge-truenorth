import { Route } from "@tanstack/react-router";

import { RecordsPage } from "./pages";
import { authenticatedRoute } from "../../routes";

export const recordsRoute = new Route({
  path: "/records",
  component: () => {
    console.log("records");
    return <RecordsPage />;
  },
  getParentRoute: () => authenticatedRoute,
});
