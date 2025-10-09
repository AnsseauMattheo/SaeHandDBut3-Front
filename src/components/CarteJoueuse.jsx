import React, { useEffect, useState } from "react";
import axios from "axios";

const CarteJoueuse = ({ datasJ = null }) => {
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        // Si aucune donnée n'est passée en props, on récupère depuis l'API
        if (!datasJ) {
            axios
                .get("http://localhost:8080/data/getTirs", { withCredentials: true })
                .then((res) => {
                    console.log("Données reçues de l’API :", res.data);
                    setDatas(res.data);
                })
                .catch((err) => console.error("Erreur lors du chargement :", err));
        } else {
            // Sinon, on utilise les données passées en props
            setDatas(datasJ);
        }
    }, [datasJ]);

    // Si aucune donnée n'est dispo
    if (!datas || datas.length === 0) {
        return (
            <div>
                <h1 className="text-center">Aucune joueuse sélectionnée</h1>
            </div>
        );
    }

    // Sinon on affiche les infos
    return (
        <div>
            <h1 className="text-center">
                Joueuse : {datas[0]?.joueuse || "Inconnue"}
            </h1>
            <p>Nombre de tirs : {datas.length}</p>
        </div>
    );
};

export default CarteJoueuse;