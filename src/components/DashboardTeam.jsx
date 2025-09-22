import React, {useEffect, useState} from "react";
import {getLastMatch} from "../axiosRequests.jsx";

function StatCard({ title, value, subtitle, isWin }) {
    return (
        <div
            className={`bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6 border-2 ${
                isWin === true
                    ? "border-green-500"
                    : isWin === false
                        ? "border-red-500"
                        : "border-transparent"
            }`}
        >
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
    );
}

export default function DashboardTeam() {
    const [lastMatch, setLastMatch] = useState(null);

    useEffect(() => {
        const fetchLastMatch = async () => {
            try {
                const response = await getLastMatch();
                console.log(response);
                setLastMatch(response);
            }catch(error){
                console.log(error);
            }
        }
        fetchLastMatch();
    }, [])

    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Bloc large */}
            <div className="flex justify-start">
                <div className="max-w-md">
                    <StatCard
                        title="Dernier Match"
                        value={lastMatch ? lastMatch.adversaire : "Chargement..."}
                        subtitle= {
                            lastMatch
                                ? new Date(lastMatch.date).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : ""
                        }
                        isWin={lastMatch ? lastMatch.win : null}
                    />
                </div>
            </div>

            {/* Deux petits blocs */}
            <div className="flex gap-6 justify-start">
                <div className="max-w-md">
                    <StatCard title="Buts marqués" value="27" subtitle="Dernier match" />
                </div>
                <div className="max-w-md">
                    <StatCard title="Arrêts gardien" value="14" subtitle="Dernier match" />
                </div>
            </div>
        </div>

    );
}
