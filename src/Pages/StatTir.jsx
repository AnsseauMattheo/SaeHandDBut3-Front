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

    const [appui, setAppui] = useState(true);

    const [dataJoueuse, setDataJoueuse] = useState(null);

    const handleAppui = () => {
        if (appui) {
            setAppui(false);
        } else {
            setAppui(true);
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
            liste.push(list[i].joueuse)

        }

        setJoueuses(liste)
    }

    const handleClickJoueuse = (tag) => {
        datas.forEach((data) => {
            if(data.joueuse === tag){
                setDataJoueuse(data.tirs)
                console.log(data.tirs)
            }
        })
    }

    return (
        <div className="flex justify-center" >
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-6 h-[600px]">
                        {/* Liste des joueuses - hauteur fixe */}
                        <div className="w-50 flex-shrink-0">
                            <ListComponent liste={joueuses} onClick={handleClickJoueuse} />
                        </div>

                        {/* Carte des tirs - élément principal qui prend tout l'espace restant */}
                        <div className="flex-1 relative max-w-[900px] max-h-[500px]">
                            <h1 className="text-center">
                                Joueuse : {dataJoueuse?.[0].joueuse}
                            </h1>
                            <CarteTirs datas={dataJoueuse} appui={appui} />
                        </div>

                        {/* Switch - hauteur fixe, aligné verticalement */}
                        <div className="w-48 flex-shrink-0 flex flex-col justify-center items-center space-y-4">
                            <div className="flex flex-col items-center space-y-3">
                                <Switch
                                    id="switcher"
                                    checked={appui}
                                    onCheckedChange={handleAppui}
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