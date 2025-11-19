import React, { useEffect, useState } from "react";
import { getLastMatch, getInsights, getPossessionsByPhase } from "../axiosRequests.js";
import StatCard from "../components/StatCard/StatCard.jsx";
import LastMatchCard from "../components/StatCard/LastMatchCard.jsx";
import InsightCard from '../components/StatCard/InsightCard.jsx';
import PossessionPhaseChart from '../components/StatCard/PossessionPhaseChart.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function DashboardTeam() {
    const [lastMatches, setLastMatches] = useState([]);
    const [insights, setInsights] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Chargement des données au montage du composant
    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchResponse = await getLastMatch();
                setLastMatches(Array.isArray(matchResponse) ? matchResponse : [matchResponse]);

                const insightsResponse = await getInsights();
                setInsights(insightsResponse);

                const possessionsResponse = await getPossessionsByPhase();
                transformChartData(possessionsResponse);

                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Transforme les données du backend en format utilisable par le graphique
    const transformChartData = (data) => {
        if (!data || data.length === 0) {
            return;
        }

        const categories = ['AP', 'CA MB', 'Transition', 'ER', 'But vide'];
        const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];

        // Crée un objet pour chaque match avec son nom, ses valeurs et sa couleur
        const matches = data.map((match, index) => ({
            name: match.adversaire || `Match ${index + 1}`,
            values: categories.map(cat => match.phases[cat] || 0),
            color: colors[index] || '#3b82f6'
        }));

        setChartData({ categories, matches });
    };

    return (
        <PageTransition loading={loading} welcomeText="Bienvenue dans votre Dashboard d'équipe.">
            <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    <div className="lg:col-span-1">
                        {lastMatches.length > 0 && <LastMatchCard matches={lastMatches} />}
                    </div>

                    <div className="lg:col-span-2">
                        <StatCard className="h-full">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">
                                    Répartition des possessions par phase de jeu
                                </h3>
                                <div className="flex items-center justify-center">
                                    <PossessionPhaseChart chartData={chartData} />
                                </div>
                            </div>
                        </StatCard>
                    </div>

                    <div className="lg:col-span-1">
                        {insights.length > 0 && <InsightCard insights={insights} vertical={true} />}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
