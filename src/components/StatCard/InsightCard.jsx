import React, { useState } from "react";
import { getZonesRanking } from "../../axiosRequests.js";
import ZoneRanking from "./ZoneRanking.jsx";

export default function InsightCard({ insights, vertical = false }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedZones, setSelectedZones] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fonction pour gérer le clic sur la carte ZONE FORTE uniquement
    const handleZoneForteClic = async () => {
        setLoading(true);
        setIsModalOpen(true);

        const zones = await getZonesRanking();
        setSelectedZones(zones);
        setLoading(false);
    };

    return (
        <>
            <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-4`}>
                {insights.map((insight, index) => {
                    // Vérifie si c'est la carte "Zone Forte"
                    const isZoneFonte = insight.title && insight.title.toLowerCase().includes('zone forte');

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                // Clique actif UNIQUEMENT sur "Zone Forte"
                                if (isZoneFonte) {
                                    handleZoneForteClic();
                                }
                            }}
                            className={`
                                bg-gradient-to-br ${insight.type === 'success' ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'}
                                text-white rounded-2xl p-6 shadow-lg 
                                ${isZoneFonte ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : ''}
                                transition-all duration-300
                            `}
                        >
                            <div className="flex flex-col gap-2">
                                <p className="text-4xl font-bold">{insight.metric}</p>
                                <p className="text-sm font-semibold uppercase">{insight.title}</p>
                                <p className="text-xs opacity-90">{insight.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de classement */}
            <ZoneRanking
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                zoneData={selectedZones}
                loading={loading}
            />
        </>
    );
}
