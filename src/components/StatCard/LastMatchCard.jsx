import React from "react";
import StatCard from "./StatCard";

export default function LastMatchCard({match}){
    const date = new Date(match.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return (
        <StatCard
        className={`max-w-1/5  border-2 ${
            match.win ? "border-green-500" : "border-red-500"
        }`}
        >
            <h3 className="text-gray-500 text-center font-medium">Dernier Match</h3>
            <p className="text-gray-400 text-center">{date}</p>
            <p className="text-2xl text-center font-bold text-gray-900">{match.adversaire}</p>
            <p className="mt-2 text-lg text-center font-semibold">
                Score : {match.butsMis} - {match.butsEncaisses}
            </p>

        </StatCard>
    )
}