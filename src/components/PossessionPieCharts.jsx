import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
    ap: "#4A90E2",
    ge: "#F5A623",
};

const renderLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(1)}%`;
};

// Composant Camembert individuel
const PieChartCard = ({ title, data, colors }) => {
    const total = useMemo(() =>
            data.reduce((sum, item) => sum + item.value, 0),
        [data]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center ">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
};

export default function PossessionPieCharts({ data }) {
    const sambreData = useMemo(() => {
        if (!data) return [];

        const totalAttaques = data.attaque?.find(x =>
            x.type?.toLowerCase().includes("total attaques")
        )?.nbBallonsResultat ?? 0;

        const totalGE = data.grandEspace?.find(x =>
            x.type?.toLowerCase().includes("total grandespace")
        )?.nbBallonsResultat ?? 0;

        return [
            { name: "Possessions en AP", value: totalAttaques },
            { name: "Possessions sur GE", value: totalGE }
        ];
    }, [data]);

    const advData = useMemo(() => {
        if (!data) return [];

        const totalDefense = data.defense?.find(x =>
            x.type?.toLowerCase().includes("total defense")
        )?.nbBallonsResultat ?? 0;

        const totalRepli = data.repli?.find(x =>
            x.type?.toLowerCase().includes("total repli")
        )?.nbBallonsResultat ?? 0;

        return [
            { name: "Possessions en AP", value: totalDefense },
            { name: "Possessions sur GE", value: totalRepli }
        ];
    }, [data]);

    if (!data) {
        return (
            <div className="text-sm text-gray-500 p-4">
                Aucune donnée disponible.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartCard
                    title="Utilisation du ballon"
                    data={sambreData}
                    colors={[COLORS.ap, COLORS.ge]}
                />
                <PieChartCard
                    title="Utilisation du ballon de l'adversaire"
                    data={advData}
                    colors={[COLORS.ap, COLORS.ge]}
                />
            </div>
        </div>
    );
}
