import React, { useEffect, useState } from "react";
import { getLastMatch } from "../axiosRequests.jsx";
import StatCard from "../components/StatCard/StatCard.jsx";
import LastMatchCard from "../components/StatCard/LastMatchCard.jsx";

export default function DashboardTeam() {
    const [lastMatch, setLastMatch] = useState(null);

    useEffect(() => {
        const fetchLastMatch = async () => {
            try {
                const response = await getLastMatch();
                setLastMatch(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLastMatch();
    }, []);

    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Carte dernier match */}
            {lastMatch && <LastMatchCard match={lastMatch} />}

            {/* Autres stats */}
            <div className="flex gap-6">
                <StatCard>
                    <h3 className="text-gray-500 text-sm font-medium">Buts marqués</h3>
                    <p className="text-3xl font-bold text-gray-900">27</p>
                </StatCard>

                <StatCard>
                    <h3 className="text-gray-500 text-sm font-medium">Arrêts gardien</h3>
                    <p className="text-3xl font-bold text-gray-900">14</p>
                </StatCard>
            </div>
        </div>
    );
}
