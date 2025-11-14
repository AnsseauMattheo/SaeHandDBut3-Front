import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LabelList } from "recharts";

const COLORS = {
    sambre: "#9366fc",
    adv: "#ec9db2"
};

export default function PhaseRepartitionChart({ data }) {
    const chartData = useMemo(() => {
        if (!data) return [];

        // SAMBRE - Récupération des données
        const sambreAP = data.attaque?.find(x =>
            x.type?.toLowerCase().includes("total attaques")
        )?.nbBallonsResultat ?? 0;

        const sambreCA = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "ca mb"
        )?.nbBallonsResultat ?? 0;

        const sambreTransition = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "transition"
        )?.nbBallonsResultat ?? 0;

        const sambreER = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "er"
        )?.nbBallonsResultat ?? 0;

        const sambreButVide = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "but vide"
        )?.nbBallonsResultat ?? 0;

        // ADV - Récupération des données
        const advAP = data.defense?.find(x =>
            x.type?.toLowerCase().includes("total defense")
        )?.nbBallonsResultat ?? 0;

        const advCA = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli ca mb"
        )?.nbBallonsResultat ?? 0;

        const advTransition = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli transition"
        )?.nbBallonsResultat ?? 0;

        const advER = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli er"
        )?.nbBallonsResultat ?? 0;

        const advButVide = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli but vide"
        )?.nbBallonsResultat ?? 0;

        // Calcul des totaux
        const totalSambre = sambreAP + sambreCA + sambreTransition + sambreER + sambreButVide;
        const totalAdv = advAP + advCA + advTransition + advER + advButVide;

        // Fonction pour calculer le pourcentage
        const calcPct = (val, total) => total > 0 ? (val / total) : 0;

        // Construction des données pour le graphique (inversé pour avoir But vide en haut)
        return [
            {
                name: "But vide",
                sambre: calcPct(sambreButVide, totalSambre),
                adv: calcPct(advButVide, totalAdv),
                sambreVal: sambreButVide,
                advVal: advButVide
            },
            {
                name: "ER",
                sambre: calcPct(sambreER, totalSambre),
                adv: calcPct(advER, totalAdv),
                sambreVal: sambreER,
                advVal: advER
            },
            {
                name: "Transition",
                sambre: calcPct(sambreTransition, totalSambre),
                adv: calcPct(advTransition, totalAdv),
                sambreVal: sambreTransition,
                advVal: advTransition
            },
            {
                name: "CA MB",
                sambre: calcPct(sambreCA, totalSambre),
                adv: calcPct(advCA, totalAdv),
                sambreVal: sambreCA,
                advVal: advCA
            },
            {
                name: "AP",
                sambre: calcPct(sambreAP, totalSambre),
                adv: calcPct(advAP, totalAdv),
                sambreVal: sambreAP,
                advVal: advAP
            }
        ];
    }, [data]);

    // Formatter pour afficher les pourcentages
    const formatLabel = (value) => {
        return value > 0 ? `${(value * 100).toFixed(0)}%` : "";
    };

    // Tooltip personnalisé pour afficher valeur + pourcentage
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        const isAdv = payload[0].dataKey === "adv";

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="font-semibold text-sm">{data.name}</p>
                <p className="text-sm text-blue-600">
                    SAMBRE: {data.sambreVal} ({(data.sambre * 100).toFixed(1)}%)
                </p>
                <p className="text-sm text-orange-600">
                    ADV: {data.advVal} ({(data.adv * 100).toFixed(1)}%)
                </p>
            </div>
        );
    };

    if (!data) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-xl font-bold">
                    Répartition possessions par phase de jeu
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis
                            type="number"
                            domain={[0, 0.8]}
                            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                        />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Legend />

                        <Bar
                            dataKey="sambre"
                            name="SAMBRE"
                            fill={COLORS.sambre}
                            radius={[0, 4, 4, 0]}
                        >
                            <LabelList
                                dataKey="sambre"
                                position="right"
                                formatter={formatLabel}
                                className="text-xs font-semibold"
                            />
                        </Bar>

                        <Bar
                            dataKey="adv"
                            name="ADV"
                            fill={COLORS.adv}
                            radius={[0, 4, 4, 0]}
                        >
                            <LabelList
                                dataKey="adv"
                                position="right"
                                formatter={formatLabel}
                                className="text-xs font-semibold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
