import React, { useEffect, useState } from 'react';

// Composant réutilisable pour ajouter une animation d'entrée aux pages
export default function PageTransition({ children, loading = false, welcomeText = "Bienvenue" }) {
    const [isEntering, setIsEntering] = useState(true);
    const [showOverlay, setShowOverlay] = useState(true);
    const [showWelcomeText, setShowWelcomeText] = useState(false);
    const [transitionComplete, setTransitionComplete] = useState(false);

    useEffect(() => {
        // Affiche le texte de bienvenue
        setTimeout(() => {
            setShowWelcomeText(true);
        }, 200);

        // N'éclaircit l'overlay que si les données sont chargées
        if (!loading) {
            // Cache le texte de bienvenue après 800ms
            setTimeout(() => {
                setShowWelcomeText(false);
            }, 800);

            // Commence l'éclaircissement après 1200ms
            setTimeout(() => {
                setShowOverlay(false);
            }, 1200);

            // Fait apparaître le contenu après 1400ms
            setTimeout(() => {
                setIsEntering(false);
            }, 1400);

            // Marque la transition comme terminée après 2500ms (fin TOTALE de l'overlay)
            setTimeout(() => {
                setTransitionComplete(true);
            }, 2500);
        }
    }, [loading]);

    return (
        <>
            {/* Overlay noir avec texte de bienvenue */}
            <div
                className={`fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-1000 flex items-center justify-center ${
                    showOverlay ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <h2
                    className={`text-white text-2xl md:text-4xl font-bold text-center px-6 transition-opacity duration-700 ${
                        showWelcomeText ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {welcomeText}
                </h2>
            </div>

            {/* Contenu de la page avec prop transitionComplete */}
            <div
                className={`transition-all duration-1000 ease-out ${
                    isEntering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
            >
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { transitionComplete });
                    }
                    return child;
                })}
            </div>
        </>
    );
}
