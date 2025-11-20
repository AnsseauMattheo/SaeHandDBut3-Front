import React from 'react';
import { createPortal } from 'react-dom';

export default function ZoneRanking({ isOpen, onClose, zoneData, loading }) {
    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
                style={{ zIndex: 9999 }}
                onClick={onClose}
            >
                {/* Card */}
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 pb-3 border-b border-gray-200 shrink-0">
                        <h2 className="text-lg font-bold text-gray-800">
                            🎯 Classement des Zones
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                            ✕
                        </button>
                    </div>

                    {/* Liste scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                        {loading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">Chargement...</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {zoneData.map((zone, index) => (
                                    <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-2 border border-green-200">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-800 text-xs">{zone.nom}</p>
                                                    <p className="text-[10px] text-gray-600">{zone.buts} buts / {zone.tirs} tirs</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-green-600">{zone.pourcentage}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 pt-3 border-t border-gray-200 text-center shrink-0">
                        <button onClick={onClose} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
