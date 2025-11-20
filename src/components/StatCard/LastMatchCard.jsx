import React from "react";
import StatCard from "./StatCard";

export default function LastMatchCard({matches}) {
    if (!matches || matches.length === 0) {
        return null;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Créer un tableau de 3 éléments (remplir avec des matchs vides si besoin)
    const displayMatches = [...matches];
    while (displayMatches.length < 3) {
        displayMatches.push(null);
    }

    return (
        <StatCard>
            <h3 className="text-gray-500 text-center text-sm font-medium mb-4">Derniers Matchs</h3>

            <div className="space-y-4">
                {displayMatches.slice(0, 3).map((match, index) => (
                    <div key={index}>
                        {match ? (
                            <div className={`border-l-4 pl-3 ${
                                match.win ? "border-l-green-500" : "border-l-red-500"
                            }`}>
                                <p className="text-gray-400 text-center text-xs mb-2">
                                    {formatDate(match.date)}
                                </p>

                                <div className="grid grid-cols-3 items-center gap-2 px-2">
                                    <div className="flex flex-col items-center text-sm font-bold">
                                        <span className="text-center">SAHB</span>
                                        <span className="mt-1 text-lg">{match.butsMis}</span>
                                    </div>

                                    <div className="flex justify-center text-xl font-bold text-gray-400">
                                        -
                                    </div>

                                    <div className="flex flex-col items-center text-sm font-bold">
                                        <span className="text-center">{match.adversaire}</span>
                                        <span className="mt-1 text-lg">{match.butsEncaisses}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-l-4 border-l-gray-300 pl-3">
                                <p className="text-gray-400 text-center text-sm py-6">
                                    Match pas encore joué
                                </p>
                            </div>
                        )}

                        {index < 2 && (
                            <div className="flex justify-center my-3">
                                <div className="w-3/4 border-t border-gray-300"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </StatCard>
    );
}
