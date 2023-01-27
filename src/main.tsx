import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import "./index.css";
import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destoryAction } from "./routes/destroy";

import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import Index from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "/contacts/:contactId",
            loader: contactLoader,
            element: <Contact />,
            action: contactAction,
          },
          {
            path: "/contacts/:contactId/edit",
            loader: contactLoader,
            element: <EditContact />,
            action: editAction,
          },
          {
            path: "/contacts/:contactId/destroy",
            errorElement: <div>有error</div>,
            action: destoryAction,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
