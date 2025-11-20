import React from 'react';

// Overlay qui gère la transition entre les pages
export default function TransitionOverlay({ isActive }) {
    return (
        <div
            className={`fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-700 ${
                isActive ? 'opacity-100' : 'opacity-0'
            }`}
        />
    );
}
