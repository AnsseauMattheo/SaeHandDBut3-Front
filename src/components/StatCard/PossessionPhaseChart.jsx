import React, { useEffect, useState } from "react";

export default function PossessionPhaseChart({ chartData }) {
    // État pour déclencher l'animation
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Attend 1400ms (fin de la transition noire) avant d'animer
        setTimeout(() => {
            setIsAnimating(true);
        }, 1400);
    }, []);

    if (!chartData || !chartData.categories || !chartData.matches) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
        );
    }

    const chartWidth = 520;
    const chartHeight = 260;
    const marginLeft = 40;
    const marginRight = 30;
    const marginTop = 20;
    const marginBottom = 55;
    const plotWidth = chartWidth - marginLeft - marginRight;
    const plotHeight = chartHeight - marginTop - marginBottom;

    const categoryWidth = plotWidth / chartData.categories.length;
    const barSpacing = 2;
    const barWidth = (categoryWidth * 0.8) / chartData.matches.length;

    return (
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
            {/* Définition de l'animation pour les barres */}
            <style>
                {`
                    @keyframes barGrow {
                        from {
                            transform: scaleY(0);
                            opacity: 0;
                        }
                        to {
                            transform: scaleY(1);
                            opacity: 1;
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    .bar-animated {
                        transform-origin: bottom;
                        animation: barGrow 0.8s ease-out forwards;
                    }
                    .label-animated {
                        animation: fadeIn 0.6s ease-out forwards;
                        animation-delay: 0.4s;
                        opacity: 0;
                    }
                `}
            </style>

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

            {/* Grille et labels Y */}
            {[0, 50, 100].map((tick, i) => {
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
                            strokeDasharray={tick === 0 ? "0" : "2"}
                        />
                        <text
                            x={marginLeft - 8}
                            y={y}
                            textAnchor="end"
                            fontSize="10"
                            fill="#6b7280"
                            alignmentBaseline="middle"
                            fontWeight={tick === 0 ? 600 : 400}
                        >
                            {tick}%
                        </text>
                    </g>
                );
            })}

            {/* Barres groupées avec animation */}
            {chartData.categories.map((category, catIndex) => {
                const xBase = marginLeft + catIndex * categoryWidth;
                const xCenterCategory = xBase + categoryWidth / 2;

                return (
                    <g key={catIndex}>
                        {/* Label de catégorie */}
                        <text
                            x={xCenterCategory}
                            y={chartHeight - marginBottom + 15}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#374151"
                            className={isAnimating ? "label-animated" : ""}
                            style={{
                                animationDelay: `${catIndex * 0.1 + 0.4}s`,
                                opacity: isAnimating ? undefined : 0
                            }}
                        >
                            {category}
                        </text>
                        {chartData.matches.map((match, matchIndex) => {
                            const value = match.values[catIndex];
                            const barHeight = (value / 100) * plotHeight;
                            const xBar = xCenterCategory - (categoryWidth * 0.32) + matchIndex * (barWidth + barSpacing);
                            const yBar = chartHeight - marginBottom - barHeight;

                            // Délai d'animation basé sur l'index
                            const animationDelay = (catIndex * 0.1 + matchIndex * 0.05);

                            return (
                                <g key={matchIndex}>
                                    <rect
                                        x={xBar}
                                        y={yBar}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={match.color}
                                        rx="2"
                                        className={isAnimating ? "bar-animated" : ""}
                                        style={{
                                            animationDelay: `${animationDelay}s`,
                                            transformOrigin: `${xBar + barWidth/2}px ${chartHeight - marginBottom}px`,
                                            opacity: isAnimating ? undefined : 0
                                        }}
                                    />
                                    {value > 5 && (
                                        <text
                                            x={xBar + barWidth / 2}
                                            y={yBar - 5}
                                            textAnchor="middle"
                                            fontSize="9"
                                            fontWeight="bold"
                                            fill="#374151"
                                            className={isAnimating ? "label-animated" : ""}
                                            style={{
                                                animationDelay: `${animationDelay + 0.6}s`,
                                                opacity: isAnimating ? undefined : 0
                                            }}
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

            {/* Légende avec animation */}
            <g transform={`translate(${marginLeft}, ${chartHeight - 32})`}>
                {chartData.matches.map((match, i) => (
                    <g
                        key={i}
                        transform={`translate(${i * 90}, 0)`}
                        className={isAnimating ? "label-animated" : ""}
                        style={{
                            animationDelay: `${i * 0.15 + 0.8}s`,
                            opacity: isAnimating ? undefined : 0
                        }}
                    >
                        <rect
                            x={0}
                            y={0}
                            width={12}
                            height={12}
                            fill={match.color}
                            rx="2"
                        />
                        <text
                            x={16}
                            y={10}
                            fontSize="9"
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
