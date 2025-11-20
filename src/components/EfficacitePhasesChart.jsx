// components/EfficacitePhases.jsx - VERSION CORRIGÉE
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip } from "recharts";

const COLOR_SAMBRE = "#c4f69d";
const COLOR_ADV = "#f4e78d";

const EfficaciteChart = ({ title, data, color }) => {

/* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
    /**
     * Formatter pour afficher les pourcentages.
     * @param {number} value Valeur à formatter.
     * @returns {string} Pourcentage formaté ou une chaîne vide si la valeur est nulle ou négative.
     */
/* <<<<<<<<<<  ab775173-356a-4f90-9065-44ed986821c1  >>>>>>>>>>> */
    const formatLabel = (value) => {
        return value > 0 ? `${(value * 100).toFixed(0)}%` : "";
    };

    console.log(data)


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-20}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            domain={[0, 0.8]}
                            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                        />
                        <Tooltip
                            formatter={(value) => `${(value * 100).toFixed(1)}%`}
                            cursor={false}
                        />
                        <Bar
                            dataKey="efficacite"
                            fill={color}
                            radius={[4, 4, 0, 0]}
                        >
                            <LabelList
                                dataKey="efficacite"
                                position="top"
                                formatter={formatLabel}
                                className="text-sm font-semibold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default function EfficacitePhases({ data }) {
    // Données pour SAMBRE - GRAND ESPACE (notre attaque)
    const sambreData = useMemo(() => {
        if (!data) return [];

        console.log("2", data)

        const totalAttaques = data.attaque?.find(x =>
            x.type?.toLowerCase().includes("total attaques")
        )?.efficacite ?? 0;

        const caMA = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "ca mb"
        )?.efficacite ?? 0;

        const transition = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "transition"
        )?.efficacite ?? 0;

        const er = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "er"
        )?.efficacite ?? 0;

        const butVide = data.grandEspace?.find(x =>
            x.type?.toLowerCase() === "but vide"
        )?.efficacite ?? 0;

        return [
            { name: "Attaques placées", efficacite: totalAttaques / 100 },
            { name: "CA MB", efficacite: caMA / 100 },
            { name: "Transition", efficacite: transition / 100 },
            { name: "ER", efficacite: er / 100 },
            { name: "But vide", efficacite: butVide / 100 }
        ];
    }, [data]);

    // Données pour ADVERSAIRE - GRAND ESPACE (leur attaque)
    const advData = useMemo(() => {
        if (!data) return [];

        const totalDefense = data.defense?.find(x =>
            x.type?.toLowerCase().includes("total defense")
        )?.efficacite ?? 0;

        const geCA = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli ca mb"
        )?.efficacite ?? 0;

        const geTransition = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli transition"
        )?.efficacite ?? 0;

        const geER = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli er"
        )?.efficacite ?? 0;


        const geButVide = data.repli?.find(x =>
            x.type?.toLowerCase() === "repli but vide"
        )?.efficacite ?? 0;

        return [
            { name: "Attaques placées", efficacite: 1 - totalDefense / 100 },
            { name: "CA MB", efficacite: 1 - geCA / 100 },
            { name: "Transition", efficacite: 1 - geTransition / 100 },
            { name: "ER", efficacite: 1 - geER / 100 },
            { name: "But vide", efficacite: 1 - geButVide / 100 }
        ];
    }, [data]);


    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EfficaciteChart
                    title="Efficacité phases de jeu SAHB"
                    data={sambreData}
                    color={COLOR_SAMBRE}
                />
                <EfficaciteChart
                    title="Efficacité phases de jeu adversaire"
                    data={advData}
                    color={COLOR_ADV}
                />
            </div>
        </div>
    );
}
