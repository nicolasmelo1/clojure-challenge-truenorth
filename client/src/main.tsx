import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import { router } from "./routes";
import { GlobalProvider } from "./features/utils/";
import { api } from "./features/utils";

const client = new QueryClient();

console.log(import.meta.env.VITE_SEVER_HOST);
api.setApiPath(import.meta.env.VITE_SEVER_HOST || "http://localhost:8080");
api.setPrefix("v1");
api.setSecureStorage(localStorage);
api.setStorage(localStorage);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <GlobalProvider.Provider>
      <RouterProvider router={router} />
    </GlobalProvider.Provider>
  </QueryClientProvider>
);
