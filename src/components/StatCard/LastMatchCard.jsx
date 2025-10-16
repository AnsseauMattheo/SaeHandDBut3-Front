import React from "react";
import StatCard from "./StatCard";

export default function LastMatchCard({match}) {
    const date = new Date(match.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <StatCard
            className={`max-w-1/5 border-2 ${
                match.win ? "border-green-500" : "border-red-500"
            }`}
        >
            <h3 className="text-gray-500 text-center text-sm font-medium">Dernier Match</h3>
            <p className="text-gray-400 text-center text-xs mb-3">{date}</p>

            <div className="grid grid-cols-3 items-start gap-4 p-2">
                <div className="flex flex-col items-center text-base font-bold">
                    <span className="text-center">SAHB</span>
                    <span className="mt-2">{match.butsMis}</span>
                </div>

                <div className="flex justify-center text-2xl font-bold text-gray-400">
                    -
                </div>

                <div className="flex flex-col items-center text-base font-bold">
                    <span className="text-center">{match.adversaire}</span>
                    <span className="mt-2">{match.butsEncaisses}</span>
                </div>
            </div>
        </StatCard>
    )
}
