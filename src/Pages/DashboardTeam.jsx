import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLastMatch, getInsights, getPossessionsByPhase, getTopPlayers } from "../axiosRequests.js";
import StatCard from "../components/StatCard/StatCard.jsx";
import LastMatchCard from "../components/StatCard/LastMatchCard.jsx";
import InsightCard from '../components/StatCard/InsightCard.jsx';
import PossessionPhaseChart from '../components/StatCard/PossessionPhaseChart.jsx';
import TopPlayersCard from '../components/StatCard/TopPlayersCard.jsx';
import PageTransition from '../components/PageTransition.jsx';

function DashboardTeam() {
    const [lastMatches, setLastMatches] = useState([]);
    const [insights, setInsights] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTransition, setShowTransition] = useState(false);

    useEffect(() => {
        // Vérifie si l'utilisateur vient de se connecter
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');

        if (justLoggedIn === 'true') {
            setShowTransition(true);
            // Supprime le flag pour ne plus montrer l'animation
            sessionStorage.removeItem('justLoggedIn');
        }

        const fetchData = async () => {
            try {
                const matchResponse = await getLastMatch();
                setLastMatches(Array.isArray(matchResponse) ? matchResponse : [matchResponse]);

                const insightsResponse = await getInsights();
                setInsights(insightsResponse);

                const possessionsResponse = await getPossessionsByPhase();
                transformChartData(possessionsResponse);

                const playersResponse = await getTopPlayers();
                setTopPlayers(playersResponse);

                setLoading(false);
            } catch (error) {
                console.error("Erreur:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const transformChartData = (data) => {
        if (!data || data.length === 0) return;

        const categories = ['AP', 'CA MB', 'Transition', 'ER', 'But vide'];
        const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];

        const matches = data.map((match, index) => ({
            name: match.adversaire || `Match ${index + 1}`,
            values: categories.map(cat => match.phases[cat] || 0),
            color: colors[index] || '#3b82f6'
        }));

        setChartData({ categories, matches });
    };

    // Si pas de transition, affiche directement le contenu
    if (!showTransition) {
        return (
            <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
                    <div className="lg:col-span-1">
                        {lastMatches.length > 0 && <LastMatchCard matches={lastMatches} />}
                    </div>

                    <div className="lg:col-span-2">
                        <StatCard>
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

                    <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                        {insights.length > 0 && <InsightCard insights={insights} vertical={true} />}
                        <TopPlayersCard players={topPlayers} />
                    </div>
                </div>
            </div>
        );
    }

    // Avec transition (uniquement après connexion)
    return (
        <PageTransition loading={loading} welcomeText="Bienvenue dans votre Dashboard d'équipe.">
            <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
                    <div className="lg:col-span-1">
                        {lastMatches.length > 0 && <LastMatchCard matches={lastMatches} />}
                    </div>

                    <div className="lg:col-span-2">
                        <StatCard>
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

                    <div className="lg:col-span-1 flex flex-col gap-4 h-full">
                        {insights.length > 0 && <InsightCard insights={insights} vertical={true} />}
                        <TopPlayersCard players={topPlayers} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

export default DashboardTeam;
