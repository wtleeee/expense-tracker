import React from 'react';
import './App.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/ReactToastify.css';
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </StrictMode>
);


