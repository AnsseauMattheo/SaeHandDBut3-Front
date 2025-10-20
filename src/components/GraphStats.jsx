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
} from "recharts";

const chartConfig = {
    valeur: {
        label: "Taux de réussite",
        color: "var(--chart-1)",
    },
};

export default function GraphStats({ stats = [], titre = "Taux de réussite par match", isPercentage = false }) {
    console.log("GraphStats data:", stats);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    {titre}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={stats}
                            margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
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
                                tickFormatter={(value) => isPercentage ? `${value}%` : value}

                                domain={isPercentage ? [0, 100] : undefined}
                                tickLine={false}
                                axisLine={false}
                                className="text-xs"
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value) => isPercentage ? `${value.toFixed(1)}%` : value}
                                        labelFormatter={(label) => `Match : ${label}`}
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="valeur"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}