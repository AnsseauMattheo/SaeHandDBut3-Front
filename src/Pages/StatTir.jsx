import React, { useEffect, useState } from "react";
import CarteTirs from "../components/CarteTirs.jsx";
import DonneeTir from "../components/DonneeTir.jsx";
import axios from "axios";
import ListComponent from "../components/ListComponent.jsx";

export default function StatTir() {

        const [datas, setDatas] = useState([]);

        const [joueuses, setJoueuses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/data/getTirs", { withCredentials: true }).then((res) => {
            console.log(res.data);
            setDatas(res.data)
            joueusesListe(res.data);
        })
    }, [])

    const joueusesListe = (list = datas) => {
        
        let liste = []

        for (let i = 0; i < list.length; i++) {
            console.log(list[i].joueuse)
            liste.push(list[i].joueuse)
             
        }

        setJoueuses(liste)
    }

return (
    <div className="flex h-screen">

        <div className="flex-shrink-0">
        </div>
        
        <div className="flex-1 relative">
            <CarteTirs />
        </div>
    </div>
);
}