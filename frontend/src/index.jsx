import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./pages/practitioner/Dashboard.jsx";
import "./index.css";

// TEMP for testing; later mount via your router at /practitioner
const root = document.getElementById("root");
createRoot(root).render(<Dashboard />);
