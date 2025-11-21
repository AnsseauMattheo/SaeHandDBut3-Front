import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, MinusCircle, Calendar } from 'lucide-react';
import axios from 'axios';

export default function Resultats({ equipeId }) {
    const [matchs, setMatchs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/ffhandball/mon-equipe`,
                    { withCredentials: true }
                );
                setMatchs(data.data.matchsJoues.reverse());
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        if (equipeId) fetchMatchs();
    }, [equipeId]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Derniers résultats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {matchs.length === 0 ? (
                    <p className="text-neutral-500 text-center py-8">Aucun match joué</p>
                ) : (
                    matchs.map((match, index) => (
                        <div
                            key={index}
                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 rounded-lg ${
                                match.exterieur === "SAMBRE AVESNOIS HANDBALL" && match.resultat === 'Victoire' ? 'bg-green-100' :
                                    match.exterieur === "SAMBRE AVESNOIS HANDBALL" && match.resultat === 'Défaite' ? 'bg-red-100' :
                                        match.exterieur !== "SAMBRE AVESNOIS HANDBALL" && match.resultat === 'Victoire' ? 'bg-red-100' :
                                            match.exterieur !== "SAMBRE AVESNOIS HANDBALL" && match.resultat === 'Défaite' ? 'bg-green-100' :
                                                'bg-orange-100'
                            }`}
                        >
                            {/* Match au centre */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
                                <p className="font-semibold text-xs sm:text-sm flex-1 text-right truncate">{match.domicile}</p>
                                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-white rounded-lg shadow-sm">
                                    <span className="text-lg sm:text-xl font-bold">{match.scoreDomicile}</span>
                                    <span className="text-neutral-400">-</span>
                                    <span className="text-lg sm:text-xl font-bold">{match.scoreExterieur}</span>
                                </div>
                                <p className="font-semibold text-xs sm:text-sm flex-1 text-left truncate">{match.exterieur}</p>
                            </div>

                            {/* Date à droite */}
                            {match.dateSimple && (
                                <div className="flex items-center gap-1 text-xs text-neutral-500 sm:min-w-[80px] sm:justify-end w-full sm:w-auto justify-start">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(match.dateSimple).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                </div>
                            )}
                        </div>

                    ))
                )}
            </CardContent>
        </Card>
    );
}
