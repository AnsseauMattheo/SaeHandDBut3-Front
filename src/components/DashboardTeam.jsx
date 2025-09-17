import React from "react";

function StatCard({ title, value, subtitle }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="grid grid-cols-4 gap-6">
            {/* Bloc large */}
            <div className="col-span-2">
                <StatCard title="Performance Globale" value="68%" subtitle="sur les 5 derniers matchs" />
            </div>

            <div className="col-span-4"></div> {/* saut de ligne */}

            {/* Deux petits blocs */}
            <StatCard title="Buts marqués" value="27" subtitle="Dernier match" />
            <StatCard title="Arrêts gardien" value="14" subtitle="Dernier match" />
        </div>

    );
}




