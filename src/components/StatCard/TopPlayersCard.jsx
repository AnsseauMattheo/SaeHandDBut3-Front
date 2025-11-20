import React from 'react';

export default function TopPlayersCard({ players }) {
    if (!players || !players.buteuse || !players.efficace || !players.passeuse) {
        return (
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-3 shadow-lg flex-1">
                <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                    <span className="text-sm">🌟</span>
                    Top Joueuses
                </h3>
                <p className="text-gray-500 text-[10px]">Aucune donnée</p>
            </div>
        );
    }

    const categories = [
        {
            label: 'Buteuse',
            icon: '⚽',
            data: players.buteuse,
            color: 'from-yellow-400 to-yellow-500'
        },
        {
            label: 'Efficace',
            icon: '🎯',
            data: players.efficace,
            color: 'from-green-400 to-green-500'
        },
        {
            label: 'Passeuse',
            icon: '🤝',
            data: players.passeuse,
            color: 'from-blue-400 to-blue-500'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-3 shadow-lg flex-1 flex flex-col">
            {/* Header */}
            <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
                <span className="text-sm">🌟</span>
                Top Joueuses
            </h3>

            {/* Liste avec espacement vertical équilibré */}
            <div className="flex-1 flex flex-col justify-evenly">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-white/50 rounded-md p-2 flex items-center gap-2"
                    >
                        {/* Icône */}
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-sm shrink-0`}>
                            {category.icon}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-xs truncate leading-tight">
                                {category.data.nom}
                            </p>
                            <p className="text-[10px] text-gray-600 leading-tight">
                                {category.label}
                            </p>
                        </div>

                        {/* Stat */}
                        <div className="text-right shrink-0">
                            <p className="text-base font-bold text-gray-800 leading-tight">
                                {category.data.valeur}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
