import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import CreationCompte from "@/AjoutUtilisateur.jsx";
import { AlertProvider } from "@/context/AlertProvider.jsx"; // ← ton provider

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <AlertProvider>
            <CreationCompte />
        </AlertProvider>
    </BrowserRouter>,
);
