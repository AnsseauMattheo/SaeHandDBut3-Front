import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

const RadarStats = ({ joueuse }) => {
    const [totalReussis, setTotalReussis] = useState(0);
    const [totalTirs, setTotalTirs] = useState(0);
    const [passesD, setPassesD] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!joueuse) return;

        const fetchData = async () => {
            try {
                // Requête tirs
                const resTirs = await axios.get("http://localhost:8080/data/getTirs", { withCredentials: true });
                const joueuseTirs = resTirs.data.find(j => j.joueuse === joueuse);
                if (joueuseTirs) {
                    const tirs = joueuseTirs.tirs || [];
                    setTotalReussis(tirs.reduce((acc, t) => acc + (t.tirsReussi || 0), 0));
                    setTotalTirs(tirs.reduce((acc, t) => acc + (t.tirsTotal || 0), 0));
                }

                // Requête passes décisives
                const resPasses = await axios.get("http://localhost:8080/data/getPassesD", { withCredentials: true });
                const joueusePasses = resPasses.data.find(j => j.joueuse === joueuse);
                if (joueusePasses) {
                    const totalPasses = joueusePasses.passeDList.reduce((acc, p) => acc + (p.passeD || 0), 0);
                    setPassesD(totalPasses);
                }

            } catch (err) {
                console.error("Erreur lors du chargement des stats radar :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [joueuse]);

    if (loading) return <p>Chargement des statistiques...</p>;
    if (!totalTirs && !totalReussis && !passesD) return <p>Aucune donnée disponible</p>;

    // Calcul du taux
    const tauxReussite = totalTirs > 0 ? ((totalReussis / totalTirs) * 100).toFixed(1) : "N/A";

    // Normalisation des valeurs
    const maxTirs = 60;
    const maxReussis = 40;
    const maxPassesD = 15;

    const radarData = [
        { stat: "Tirs", value: (totalTirs / maxTirs) * 100 },
        { stat: "Tirs réussis", value: (totalReussis / maxReussis) * 100 },
        { stat: "Taux (%)", value: tauxReussite === "N/A" ? 0 : parseFloat(tauxReussite) },
        { stat: "Passes D", value: (passesD / maxPassesD) * 100 },
    ];

    return (
        <div className="w-full md:w-1/2 h-80 p-4 flex flex-col items-center">
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        data={radarData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <PolarGrid />
                        <PolarAngleAxis
                            dataKey="stat"
                            tick={{ fontSize: 12, fill: "#92400e" }}
                            tickLine={false}
                        />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                            name={joueuse}
                            dataKey="value"
                            stroke="#92400e"
                            fill="#facc15"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RadarStats;
