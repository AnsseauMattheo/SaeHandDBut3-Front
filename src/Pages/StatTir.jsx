import React, { useEffect, useState } from "react";
import CarteTirs from "../components/CarteTirs.jsx";
import DonneeTir from "../components/DonneeTir.jsx";
import axios from "axios";
import ListComponent from "../components/ListComponent.jsx";
import { Label } from "../components/ui/label.jsx";
import { Switch } from "../components/ui/switch.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";

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
        <div className="flex justify-center" >
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-6 h-[600px]">
                        {/* Liste des joueuses - hauteur fixe */}
                        <div className="w-50 flex-shrink-0">
                            <ListComponent liste={joueuses} />
                        </div>

                        {/* Carte des tirs - élément principal qui prend tout l'espace restant */}
                        <div className="flex-1 relative max-w-[900px] max-h-[500px]">
                            <CarteTirs />
                        </div>

                        {/* Switch - hauteur fixe, aligné verticalement */}
                        <div className="w-48 flex-shrink-0 flex flex-col justify-center items-center space-y-4">
                            <div className="flex flex-col items-center space-y-3">
                                <Switch
                                    id="switcher"
                                    checked={appuit}
                                    onCheckedChange={setAppuit}
                                />
                                <Label htmlFor="switcher" className="text-center text-sm">
                                    Appui / Suspension
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}