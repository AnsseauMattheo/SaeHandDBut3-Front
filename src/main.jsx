import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Connexion from "./Pages/Connexion.jsx";
import App from "./App.jsx";
import AlertContainer from "./components/AlertContainer.jsx";
import { AlertProvider } from "./context/AlertProvider.jsx";
import Dashboard from "./components/DashboardTeam.jsx";
import CreationCompte from "@/AjoutUtilisateur.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <>
            <AlertProvider>
                <CreationCompte />
            </AlertProvider>
        </>
    </BrowserRouter>,
);