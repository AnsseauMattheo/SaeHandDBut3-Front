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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.jsx"

const RadarStats = ({ joueuse, evalueData, affectation }) => {
    const [totalReussis, setTotalReussis] = useState(0);
    const [totalTirs, setTotalTirs] = useState(0);
    const [passesD, setPassesD] = useState(0);
    const [loading, setLoading] = useState(true);
    const [perteBalle, setPerteBalle] = useState(0);


    useEffect(() => {
        if (!joueuse) return;

        const fetchData = async () => {
            try {
                // Requête tirs
                const resTirs = await axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getTirs`, { withCredentials: true });
                const joueuseTirs = resTirs.data.find(j => j.joueuse === joueuse);
                if (joueuseTirs) {
                    const tirs = joueuseTirs.tirs || [];
                    setTotalReussis(tirs.reduce((acc, t) => acc + (t.tirsReussi || 0), 0));
                    setTotalTirs(tirs.reduce((acc, t) => acc + (t.tirsTotal || 0), 0));
                }

                // Requête passes décisives
                const resPasses = await axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPassesD`, { withCredentials: true });
                const joueusePasses = resPasses.data.find(j => j.joueuse === joueuse);
                if (joueusePasses) {
                    const totalPasses = joueusePasses.passeDList.reduce((acc, p) => acc + (p.passeD || 0), 0);
                    setPassesD(totalPasses);
                }
                // Requête pertes de balle
                const resPerte = await axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getPerteB`, { withCredentials: true });
                const joueusePerte = resPerte.data.find(j => j.joueuse === joueuse);
                if (joueusePerte) {
                    const perteB = joueusePerte.perteBList.reduce((acc, t) => acc + (t.perteBalle || 0), 0);
                    setPerteBalle(perteB);
                } else {
                    setPerteBalle(0);
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
  {
    stat: "Tirs",
    value: Math.round((totalTirs / evalueData?.[affectation]?.maxNbTirs) * 100),
  },
  {
    stat: "Tirs réussis",
    value: Math.round((totalReussis / evalueData?.[affectation]?.maxNbTirsReussis) * 100),
  },
  {
    stat: "Taux (%)",
    value: Math.round((tauxReussite / evalueData?.[affectation]?.maxTauxReussis) * 100),
  },
  {
    stat: "Passes D",
    value: Math.round((passesD / evalueData?.[affectation]?.maxPasseD) * 100),
  },
  {
      stat: "Pertes de balle",
      value: Math.round((perteBalle / evalueData?.[affectation]?.maxPerteBalle) * 100),
  },

];

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Graphique Radar - {joueuse} - {affectation}
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full h-full">
                    <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px] w-full">
                        <RadarChart
                            data={radarData}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                            <PolarGrid />
                             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis
                                dataKey="stat"
                                tick={{ fontSize: 14, fill: "#92400e" }}
                                tickLine={false}
                            />
                            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                            <Radar
                                name={joueuse}
                                dataKey="value"
                                stroke="#92400e"
                                fill="#facc15"
                                fillOpacity={0.6}
                                dot={{
                                    r: 4,
                                    fillOpacity: 1,
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                

            </CardContent>

        </Card>
    );
};

export default RadarStats;
