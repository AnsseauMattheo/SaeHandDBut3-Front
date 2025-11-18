import React, { useEffect, useState } from "react";
import { getLastMatch, getInsights } from "../axiosRequests.js";
import StatCard from "../components/StatCard/StatCard.jsx";
import LastMatchCard from "../components/StatCard/LastMatchCard.jsx";
import InsightCard from '../components/StatCard/InsightCard.jsx';

export default function DashboardTeam() {
    const [lastMatches, setLastMatches] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchResponse = await getLastMatch();
                setLastMatches(Array.isArray(matchResponse) ? matchResponse : [matchResponse]);

                const insightsResponse = await getInsights();
                setInsights(insightsResponse);

                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Chargement...</div>
            </div>
        );
    }

    // Données du graphique - Répartition possessions par phase de jeu (3 matchs)
    const chartData = {
        categories: ['AP', 'CA MB', 'Transition', 'ER', 'But vide'],
        matches: [
            { name: 'Match 1', values: [57, 11, 14, 16, 1], color: '#3b82f6' },
            { name: 'Match 2', values: [55, 12, 15, 17, 1], color: '#60a5fa' },
            { name: 'Match 3', values: [52, 13, 16, 18, 1], color: '#93c5fd' }
        ]
    };

    const chartWidth = 700;
    const chartHeight = 400;
    const marginLeft = 60;
    const marginRight = 50;
    const marginTop = 40;
    const marginBottom = 80;
    const plotWidth = chartWidth - marginLeft - marginRight;
    const plotHeight = chartHeight - marginTop - marginBottom;

    const categoryWidth = plotWidth / chartData.categories.length;
    const barWidth = (categoryWidth * 0.7) / chartData.matches.length;
    const barSpacing = 4;

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    {lastMatches.length > 0 && <LastMatchCard matches={lastMatches} />}
                </div>

                <div className="lg:col-span-2">
                    <StatCard className="h-full">
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">
                                Répartition des possessions par phase de jeu
                            </h3>

                            <div className="flex items-center justify-center">
                                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                                    {/* Axes */}
                                    <line
                                        x1={marginLeft}
                                        y1={marginTop}
                                        x2={marginLeft}
                                        y2={chartHeight - marginBottom}
                                        stroke="#9ca3af"
                                        strokeWidth="2"
                                    />
                                    <line
                                        x1={marginLeft}
                                        y1={chartHeight - marginBottom}
                                        x2={chartWidth - marginRight}
                                        y2={chartHeight - marginBottom}
                                        stroke="#9ca3af"
                                        strokeWidth="2"
                                    />

                                    {/* Lignes de grille horizontales et labels Y (pourcentages) */}
                                    {[0, 20, 40, 60, 80, 100].map((tick, i) => {
                                        const y = chartHeight - marginBottom - (tick / 100) * plotHeight;
                                        return (
                                            <g key={i}>
                                                <line
                                                    x1={marginLeft}
                                                    y1={y}
                                                    x2={chartWidth - marginRight}
                                                    y2={y}
                                                    stroke="#e5e7eb"
                                                    strokeWidth="1"
                                                    strokeDasharray="4"
                                                />
                                                <text
                                                    x={marginLeft - 10}
                                                    y={y}
                                                    textAnchor="end"
                                                    fontSize="11"
                                                    fill="#6b7280"
                                                    alignmentBaseline="middle"
                                                >
                                                    {tick}%
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Barres groupées verticales par catégorie */}
                                    {chartData.categories.map((category, catIndex) => {
                                        const xBase = marginLeft + catIndex * categoryWidth;
                                        const xCenterCategory = xBase + categoryWidth / 2;

                                        return (
                                            <g key={catIndex}>
                                                {/* Label de catégorie en bas */}
                                                <text
                                                    x={xCenterCategory}
                                                    y={chartHeight - marginBottom + 20}
                                                    textAnchor="middle"
                                                    fontSize="13"
                                                    fontWeight="600"
                                                    fill="#374151"
                                                >
                                                    {category}
                                                </text>

                                                {/* Barres pour chaque match */}
                                                {chartData.matches.map((match, matchIndex) => {
                                                    const value = match.values[catIndex];
                                                    const barHeight = (value / 100) * plotHeight;
                                                    const xBar = xCenterCategory - (categoryWidth * 0.35) + matchIndex * (barWidth + barSpacing);
                                                    const yBar = chartHeight - marginBottom - barHeight;

                                                    return (
                                                        <g key={matchIndex}>
                                                            <rect
                                                                x={xBar}
                                                                y={yBar}
                                                                width={barWidth}
                                                                height={barHeight}
                                                                fill={match.color}
                                                                rx="3"
                                                            />
                                                            {/* Pourcentage au-dessus de la barre si assez haute */}
                                                            {value > 5 && (
                                                                <text
                                                                    x={xBar + barWidth / 2}
                                                                    y={yBar - 5}
                                                                    textAnchor="middle"
                                                                    fontSize="11"
                                                                    fontWeight="bold"
                                                                    fill="#374151"
                                                                >
                                                                    {value}%
                                                                </text>
                                                            )}
                                                        </g>
                                                    );
                                                })}
                                            </g>
                                        );
                                    })}

                                    {/* Légende */}
                                    <g transform={`translate(${marginLeft}, ${chartHeight - 40})`}>
                                        {chartData.matches.map((match, i) => (
                                            <g key={i} transform={`translate(${i * 100}, 0)`}>
                                                <rect
                                                    x={0}
                                                    y={0}
                                                    width={15}
                                                    height={15}
                                                    fill={match.color}
                                                    rx="2"
                                                />
                                                <text
                                                    x={20}
                                                    y={12}
                                                    fontSize="11"
                                                    fill="#374151"
                                                >
                                                    {match.name}
                                                </text>
                                            </g>
                                        ))}
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </StatCard>
                </div>

                <div className="lg:col-span-1">
                    {insights.length > 0 && <InsightCard insights={insights} vertical={true} />}
                </div>
            </div>
        </div>
    );
}
