import React, {useEffect, useState} from "react";
import CarteTirs from "../components/CarteTirs.jsx";
import DonneeTir from "../components/DonneeTir.jsx";
import axios from "axios";
import ListComponent from "../components/ListComponent.jsx";
import {Label} from "../components/ui/label.jsx";
import {Switch} from "../components/ui/switch.jsx";

export default function StatTir() {

    const [datas, setDatas] = useState([]);

    const [joueuses, setJoueuses] = useState([]);

    const [appuit, setAppuit] = useState(true);
    console.log(appuit);

    const handleAppuits = () => {
        if (appuit) {
            setAppuit(false);
        } else {
            setAppuit(true);
        }

    }

    useEffect(() => {
        axios.get("http://localhost:8080/data/getTirs", {withCredentials: true}).then((res) => {
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
        <>
            <div className="flex h-screen">

                <div className="flex-shrink-0">
                </div>

                <div className="flex-1 relative">
                    <CarteTirs/>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="switcher" onClick={handleAppuits}/>
                <Label htmlFor="switcher">Appui / Suspension</Label>
            </div>
        </>

    );
}