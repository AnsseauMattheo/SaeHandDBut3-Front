import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Connexion from "./components/Connexion.jsx";
import App from "./App.jsx";
import Base_Main from "@/Pages/Base_Main.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Base_Main>{App}</Base_Main>
    </BrowserRouter>,
);