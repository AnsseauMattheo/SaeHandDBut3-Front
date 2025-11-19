import React from "react";

export default function PossessionPhaseChart({ chartData }) {
    if (!chartData || !chartData.categories || !chartData.matches) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
        );
    }

    // Configuration des dimensions du graphique
    const chartWidth = 700;
    const chartHeight = 400;
    const marginLeft = 60;
    const marginRight = 50;
    const marginTop = 40;
    const marginBottom = 80;
    const plotWidth = chartWidth - marginLeft - marginRight;
    const plotHeight = chartHeight - marginTop - marginBottom;

    // Calcul des dimensions des barres
    const categoryWidth = plotWidth / chartData.categories.length;
    const barWidth = (categoryWidth * 0.7) / chartData.matches.length;
    const barSpacing = 4;

    return (
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">

            {/* Axe Y vertical */}
            <line
                x1={marginLeft}
                y1={marginTop}
                x2={marginLeft}
                y2={chartHeight - marginBottom}
                stroke="#9ca3af"
                strokeWidth="2"
            />

            {/* Axe X horizontal */}
            <line
                x1={marginLeft}
                y1={chartHeight - marginBottom}
                x2={chartWidth - marginRight}
                y2={chartHeight - marginBottom}
                stroke="#9ca3af"
                strokeWidth="2"
            />

            {/* Grille horizontale et labels des pourcentages */}
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

            {/* Barres du graphique groupées par catégorie */}
            {chartData.categories.map((category, catIndex) => {
                const xBase = marginLeft + catIndex * categoryWidth;
                const xCenterCategory = xBase + categoryWidth / 2;

                return (
                    <g key={catIndex}>
                        {/* Label de la catégorie */}
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

                                    {/* Affiche le pourcentage au-dessus si > 5% */}
                                    {value > 5 && (
                                        <text
                                            x={xBar + barWidth / 2}
                                            y={yBar - 5}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="bold"
                                            fill="#374151"
                                        >
                                            {value.toFixed(1)}%
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                );
            })}

            {/* Légende avec les noms des matchs */}
            <g transform={`translate(${marginLeft}, ${chartHeight - 40})`}>
                {chartData.matches.map((match, i) => (
                    <g key={i} transform={`translate(${i * 120}, 0)`}>
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
    );
}
