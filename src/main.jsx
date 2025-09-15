import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Connexion from "./components/Connexion.jsx";
import App from "./App.jsx";
import AlertContainer from "./components/AlertContainer.jsx";
import { AlertProvider } from "./context/AlertProvider.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <>
            <AlertProvider>
                <App />
            </AlertProvider>
        </>
    </BrowserRouter>,
);