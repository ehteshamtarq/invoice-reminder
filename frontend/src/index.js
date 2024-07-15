import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-4b1egf65vrzjxqaf.us.auth0.com"
      clientId="klAxPQB8GLsWCH7INr6vOUfsK4za1sbw"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        preventDuplicate
      >
        <App />
      </SnackbarProvider>
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
