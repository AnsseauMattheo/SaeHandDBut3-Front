import {useEffect, useState} from 'react'
import './App.css'
import ImportFile from './components/ImportFile.jsx'
import axios from "axios";
import {Route, Routes} from "react-router";
import Connexion from "./Pages/Connexion.jsx";
import DashBoard from "./Pages/Base_Main.jsx";

function App() {
  const [user, setUser] = useState({})

    useEffect(() => {
        axios.get('http://localhost:8080/auth/me',
        {
            withCredentials: true
        })
        .then(res => {console.log(res); setUser(res.data)})
    }, [])

  return (
      <Routes>
          <Route path="/Connexion" element={< Connexion/>} />
          <Route path="/DashBoard" element={<DashBoard user={user} />} />
      </Routes>
  )
}

export default App
