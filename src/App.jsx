import { useEffect, useState } from 'react'
import './App.css'
import ImportFile from './components/ImportFile.jsx'
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import Connexion from "./Pages/Connexion.jsx";
import DashBoard from "./Pages/Base_Main.jsx";
import Cookies from "js-cookie";
import { useAlerts } from './context/AlertProvider.jsx';
import StatTir from "./Pages/StatTir.jsx";
import DashboardTeam from "./components/DashboardTeam.jsx";

function App() {
  const [user, setUser] = useState({})

  const navigate = useNavigate();

  const { addSuccess, addError } = useAlerts();

  const handleReload = () => {
    axios
      .get("http://localhost:8080/auth/me", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.response?.status);
        if (err.response?.status === 400) {
          if (location.pathname !== "/Connexion") {
            navigate("/Connexion");
            addError("Vous devez être connecté");
          }
        }
      });
  };

  useEffect(() => {
    handleReload();
  }, [])

  const handleLogOut = () => {
    axios
      .delete("http://localhost:8080/auth/logout", { withCredentials: true })
      .then(() => {
        console.log("logout");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setUser(null);

        if (location.pathname !== "/Connexion") {
          addSuccess("Deconnexion ! ")
          navigate("/Connexion");
        }
      })
      .catch((err) => {
        console.error("Erreur logout:", err);
      });
  };

 return (
    <Routes>
      <Route path="/Connexion" element={<Connexion reload={handleReload} />} />
      <Route path="/DashBoard" element={<DashBoard user={user} logout={handleLogOut} />}>
        <Route index element={<DashboardTeam />} />
        <Route path="StatTir" element={<StatTir />} />
      </Route>
    
      <Route path="/" element={<Connexion reload={handleReload} />} />
    </Routes>
  )
}

export default App
