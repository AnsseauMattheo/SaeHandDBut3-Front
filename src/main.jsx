import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { AlertProvider } from "./context/AlertProvider.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <AlertProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </AlertProvider>
    </BrowserRouter>,
);
