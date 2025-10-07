import React, { useEffect, useState } from "react";
import axios from "axios";

const CarteJoueuse = ({ datasJ = null, joueuse = null }) => {
    const [datas, setDatas] = useState([]);
    const [totalReussis, setTotalReussis] = useState(0);
    const [totalTirs, setTotalTirs] = useState(0);

    useEffect(() => {
        // Si aucune donnée n'est passée en props, on récupère depuis l'API
        if (datasJ === null) {
            axios.get("http://localhost:8080/data/getTirs", { withCredentials: true })
                .then((res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data?.[i].joueuse === joueuse) {
                            const tirs = res.data?.[i].tirs || [];

                            // Calcul des totaux
                            const totalReussisTemp = tirs.reduce((acc, t) => acc + (t.tirsReussi || 0), 0);
                            const totalTirsTemp = tirs.reduce((acc, t) => acc + (t.tirsTotal || 0), 0);

                            setDatas(tirs);
                            setTotalReussis(totalReussisTemp);
                            setTotalTirs(totalTirsTemp);
                        }
                    }
                })
                .catch((err) => console.error("Erreur lors du chargement :", err));
        } else {
            // Sinon, on utilise les données passées en props
            setDatas(datasJ);

            // Calcul local si les données sont déjà fournies
            const totalReussisTemp = datasJ.reduce((acc, t) => acc + (t.tirsReussi || 0), 0);
            const totalTirsTemp = datasJ.reduce((acc, t) => acc + (t.tirsTotal || 0), 0);

            setTotalReussis(totalReussisTemp);
            setTotalTirs(totalTirsTemp);
        }
    }, [datasJ, joueuse]);

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
                Joueuse : {joueuse || datas[0]?.joueuse || "Inconnue"}
            </h1>
            <p>Nombre de tirs : {totalTirs}</p>
            <p>Tirs réussis : {totalReussis}</p>
            <p>Taux de réussite : {totalTirs > 0 ? ((totalReussis / totalTirs) * 100).toFixed(1) + "%" : "N/A"}</p>
        </div>
    );
};

export default CarteJoueuse;
