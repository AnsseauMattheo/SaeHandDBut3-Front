// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import ImportFile from './Pages/ImportFile'
import Base_Main from './Pages/Base_Main.jsx';
import {useState} from "react";

function App() {
    const [count, setCount] = useState(0)
    return (
        <div>
            <p>Tu as cliqué {count} fois</p>
            <button onClick={() => setCount(count + 1)}>Clique ici</button>
        </div>
    );
}

export default App
