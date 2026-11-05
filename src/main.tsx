import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/react";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    'Root element not found. Check that index.html contains <div id="root"></div>',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
