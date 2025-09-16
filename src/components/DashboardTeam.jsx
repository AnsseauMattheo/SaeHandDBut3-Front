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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <StatCard title="Buts marqués" value="28" subtitle="Dernier match" />
            <StatCard title="Buts encaissés" value="24" subtitle="Dernier match" />
            <StatCard title="Taux de réussite" value="75%" subtitle="Saison en cours" />
        </div>
    );
}
