import React, { useEffect, useState } from "react";
import axios from "axios";

const CarteJoueuse = ({ datasJ = null, joueuse = null, affectation = null }) => {
    const [datas, setDatas] = useState([]);
    const [totalReussis, setTotalReussis] = useState(0);
    const [totalTirs, setTotalTirs] = useState(0);
    const [passesD, setpassesD] = useState(0);
    const [perteBalle, setPerteBalle] = useState(0);
    const [photoUrl, setPhotoUrl] = useState(null);

    const getEvaluationColor = () => {
        let score = 0;

        //forme : (élément qu'on calcul, limite de points)
        if (totalTirs > 0) {
            score += Math.min((totalReussis / totalTirs) * 100 / 2, 50);
        }
        //1 passeD = 2
        score += Math.min(passesD * 2, 20);
        //forme : (>0, commence à 20 et perte 1 points par perte de balle)
        score += Math.max(0, 20 - perteBalle);
        //5 tirs = 1 point
        score += Math.min(totalTirs / 5, 10);

        if (score >= 80) {
            return "blue";
        }
        if (score >= 60) {
            return "gold";
        }
        if (score >= 40) {
            return "silver";
        }
        return "bronze";                  // bronze
    };


    useEffect(() => {
        if (datasJ === null) {
            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getTirs`, { withCredentials: true })
                .then((res) => {
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    if (joueuseData) {
                        const tirs = joueuseData.tirs || [];
                        const totalReussisTemp = tirs.reduce((acc, t) => acc + (t.tirsReussi || 0), 0);
                        const totalTirsTemp = tirs.reduce((acc, t) => acc + (t.tirsTotal || 0), 0);
                        setDatas(tirs);
                        setTotalReussis(totalReussisTemp);
                        setTotalTirs(totalTirsTemp);
                    } else {
                        setDatas([]);
                        setTotalReussis(0);
                        setTotalTirs(0);
                    }
                })
                .catch((err) => console.error("Erreur lors du chargement :", err));


            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPassesD`, { withCredentials: true })
                .then((res) => {
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    if (joueuseData) {
                        const passeD = joueuseData.passeDList.reduce((acc, t) => acc + (t.passeD || 0), 0);
                        setpassesD(passeD);
                    } else {
                        setpassesD(0);
                    }
                })
                .catch((err) => console.log(err));

            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPerteB`, { withCredentials: true })
                .then((res) => {
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    if (joueuseData) {
                        const perteB = joueuseData.perteBList.reduce((acc, t) => acc + (t.perteBalle || 0), 0);
                        setPerteBalle(perteB);
                    } else {
                        setPerteBalle(0);
                    }
                })
                .catch((err) => console.log(err));

            if (joueuse) {
                axios.get(`${import.meta.env.VITE_SERVER_URL}/ajout/utilisateur/photo`, {
                    params: { nomJoueuse: joueuse },
                    withCredentials: true
                })
                    .then(res => {
                        if (res.data) {
                            setPhotoUrl(`${import.meta.env.VITE_SERVER_URL}/ajout/utilisateur/photo?nomJoueuse=${encodeURIComponent(joueuse)}`);
                        } else {
                            setPhotoUrl(null);
                        }
                    })
                    .catch(() => setPhotoUrl(null));
            } else {
                setPhotoUrl(null);
            }

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
    const tauxReussite = totalTirs > 0 ? ((totalReussis / totalTirs) * 100).toFixed(1) : "N/A";

    const colorRank = getEvaluationColor();
    return (
        <div className={`relative rounded-2xl shadow-xl flex flex-col items-center justify-start overflow-hidden fit-content p-2
        ${colorRank === "bronze" ? "from-yellow-700 to-yellow-900 bg-gradient-to-b" : ""}
        ${colorRank === "silver" ? "from-gray-300 to-gray-500 bg-gradient-to-b" : ""}
        ${colorRank === "gold" ? "from-yellow-300 to-yellow-500 bg-gradient-to-b" : ""}
        ${colorRank === "blue" ? "from-blue-400 to-blue-700 bg-gradient-to-b" : ""}`}>



        {/* Photo */}
            <div className="mt-8 w-28 h-28 rounded-full border-2 border-yellow-800 overflow-hidden shadow-md bg-gray-200">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={joueuse}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        Aucune photo
                    </div>
                )}
            </div>


            {/* Nom de la joueuse */}
            <h2 className="mt-3 text-xl font-bold text-center text-yellow-900 drop-shadow-md uppercase">
                {joueuse || "Inconnue"}
            </h2>
            <h3>{affectation || "Inconnue"}</h3>

            {/* Bloc stats */}
            <div className="mt-4 w-5/6 bg-yellow-100 rounded-xl p-3 shadow-inner">
                <div className="flex justify-between text-sm font-semibold text-yellow-900">
                    <span>{affectation === "Gardienne" ? "Arrets" : "Tirs" } :</span>
                    <span>{totalTirs}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-yellow-900">
                    <span>Réussis :</span>
                    <span>{totalReussis}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-yellow-900">
                    <span>Taux :</span>
                    <span>{tauxReussite}%</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-yellow-900">
                    <span>Passes D :</span>
                    <span>{passesD}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-yellow-900">
                    <span>Perte Balle :</span>
                    <span>{perteBalle}</span>
                </div>
            </div>

            {/* Barre de réussite */}
            <div className="mt-5 w-5/6 h-4 bg-yellow-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${tauxReussite === "N/A" ? 0 : tauxReussite}%` }}
                ></div>
            </div>

            <p className="mt-2 text-xs text-yellow-900 font-medium">Taux de réussite</p>
        </div>
    );
};

export default CarteJoueuse;
