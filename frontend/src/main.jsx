import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App"; // Import the main App component
import "./index.css"; // Import global styles (optional)

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* Wrap everything inside BrowserRouter */}
    <App />
    
  </BrowserRouter>
);
