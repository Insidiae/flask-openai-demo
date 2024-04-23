import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import IndexRoute from "./routes/_index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexRoute />,
    action: IndexRoute.action,
  },
]);

<RouterProvider router={router} />;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
