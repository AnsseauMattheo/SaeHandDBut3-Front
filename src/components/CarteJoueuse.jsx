import React, { useEffect, useState } from "react";
import axios from "axios";

const CarteJoueuse = ({ datasJ = null, joueuse = null, affectation = null }) => {
    const [datas, setDatas] = useState([]);
    const [totalReussis, setTotalReussis] = useState(0);
    const [totalTirs, setTotalTirs] = useState(0);
    const [passesD, setpassesD] = useState(0);
    const [perteBalle, setPerteBalle] = useState(0);
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        // Si aucune donnée n'est passée en props, on récupère depuis l'API
        if (datasJ === null) {
            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getTirs`, { withCredentials: true })
                .then((res) => {
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    console.log(joueuseData);
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



            console.log("passesD");
            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPassesD`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data);
                    console.log(joueuse);
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    console.log(joueuseData);
                    if (joueuseData) {
                        const passeD = joueuseData.passeDList.reduce((acc, t) => acc + (t.passeD || 0), 0);
                        setpassesD(passeD);
                    } else {
                        setpassesD(0);
                    }
                })
                .catch((err) => console.log(err));

            console.log("perteBalle");
            axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPerteB`, { withCredentials: true })
                .then((res) => {
                    console.log(res.data);
                    console.log(joueuse);
                    const joueuseData = res.data.find(j => j.joueuse === joueuse);
                    console.log(joueuseData);
                    if (joueuseData) {
                        const perteB = joueuseData.perteBList.reduce((acc, t) => acc + (t.perteBalle || 0), 0);
                        setPerteBalle(perteB);
                        console.log("perteB :", perteB);
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
                            setPhotoUrl(`data:image/png;base64,${res.data}`);
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
    return (
        <div className="relative bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-2xl shadow-xl flex flex-col items-center justify-start overflow-hidden fit-content p-2">


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
                    <span>Tirs :</span>
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
