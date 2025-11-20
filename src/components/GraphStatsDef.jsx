import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function GraphStatsDef({
    defStats = [],
    titre = "Taux de réussite par match",
}) {
    // 🔹 1. Transformation des données en un seul tableau plat
    const allEntries = defStats.flat();

    // 🔹 2. Extraire la liste unique des matchs
    const matches = [...new Set(allEntries.map((item) => item.match))];

    // 🔹 3. Construire les données pour Recharts : une ligne par match
    const data = matches.map((match) => {
        const row = { match };
        allEntries
            .filter((entry) => entry.match === match)
            .forEach((entry) => {
                row[entry.type] = entry.valeur;
            });
        return row;
    });

    // 🔹 4. Extraire dynamiquement la liste des types de stats
    const statTypes = [...new Set(allEntries.map((item) => item.type))];

    // 🔹 5. Générer des couleurs dynamiques pour chaque ligne
    const colors = [
        "#2563eb", "#dc2626", "#16a34a", "#9333ea",
        "#eab308", "#0ea5e9", "#f97316", "#f43f5e"
    ];

    const colorForType = (index) => colors[index % colors.length];

    // 🔹 6. Config pour ChartContainer (nécessaire pour ChartStyle)
    const chartConfig = Object.fromEntries(
        statTypes.map((type, index) => [
            type,
            { label: type, color: colorForType(index) },
        ])
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{titre}</CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer className="h-80 w-full" config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                className="stroke-muted"
                            />
                            <XAxis
                                dataKey="match"
                                angle={-20}
                                textAnchor="end"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                height={60}
                                className="text-xs"
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    value
                                }
                            
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ marginTop: 12 }}
                                iconType="circle"
                                formatter={(value) => chartConfig[value]?.label ?? value}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name) =>
                                                [value, name]
                                        }
                                        labelFormatter={(label) => `Match : ${label}`}
                                    />
                                }
                            />
                        
                            {statTypes.map((type, index) => (
                                <Line
                                    key={type}
                                    type="monotone"
                                    dataKey={type}
                                    stroke={colorForType(index)}
                                    strokeWidth={2}
                                    activeDot={{ r: 6 }}
                                    name={type}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}