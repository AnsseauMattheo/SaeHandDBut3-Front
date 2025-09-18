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

export default function DashboardTeam() {
    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Bloc large */}
            <div className="flex justify-start">
                <div className="max-w-md">
                    <StatCard
                        title="Performance Globale"
                        value="68%"
                        subtitle="Sur les 5 derniers matchs"
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
