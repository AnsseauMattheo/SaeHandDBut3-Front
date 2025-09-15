import {useEffect, useState} from 'react'
import './App.css'
import ImportFile from './components/ImportFile.jsx'
import axios from "axios";

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
    <>

      <div>
      </div>
      <h1>Salut {user? user.username : ""}</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ImportFile></ImportFile>
    </>
  )
}

export default App
