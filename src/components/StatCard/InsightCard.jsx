import React from "react";
import StatCard from "./StatCard.jsx";

export default function InsightCard({ insights, vertical = false }) {

    const getTypeStyle = (type) => {
        switch(type) {
            case 'success':
                return 'bg-gradient-to-br from-green-500 to-emerald-600 text-white';
            case 'warning':
                return 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white';
            case 'danger':
                return 'bg-gradient-to-br from-red-500 to-pink-600 text-white';
            case 'info':
                return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
            default:
                return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white';
        }
    };

    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📊</span>
                <span className="font-semibold">Analyse sur les 3 derniers matchs</span>
            </div>

            <div className={vertical
                ? "flex flex-col gap-4"
                : "grid grid-cols-1 md:grid-cols-3 gap-4"
            }>
                {insights.map((insight, idx) => (
                    <StatCard
                        key={idx}
                        className={`${getTypeStyle(insight.type)} relative overflow-hidden ${
                            vertical ? 'min-h-[120px]' : 'min-h-[140px]'
                        }`}
                    >
                        <div className="absolute top-2 left-2 text-2xl opacity-20">
                            {insight.icon}
                        </div>

                        <div className="relative z-10 pt-6 px-3 pb-3">
                            <div className={`font-bold mb-2 ${
                                vertical ? 'text-3xl' : 'text-4xl'
                            }`}>
                                {insight.metric}
                            </div>

                            {insight.title && (
                                <div className={`font-bold uppercase tracking-wide mb-1 ${
                                    vertical ? 'text-xs' : 'text-sm'
                                }`}>
                                    {insight.title}
                                </div>
                            )}

                            <div className="text-xs opacity-90">
                                {insight.message}
                            </div>
                        </div>

                        <div className={`absolute bottom-0 right-0 opacity-10 transform translate-x-4 translate-y-4 ${
                            vertical ? 'text-6xl' : 'text-7xl'
                        }`}>
                            {insight.icon}
                        </div>
                    </StatCard>
                ))}
            </div>
        </div>
    );
}
