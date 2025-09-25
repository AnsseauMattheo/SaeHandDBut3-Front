import React from "react";

export default function StatCard({children, className = ""}) {
    return (
        <div
            className={`bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6 ${className}`}
        >
            {children}
        </div>
    );
}