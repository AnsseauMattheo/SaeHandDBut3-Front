import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

export default function ProchainsMatchs({ equipeId }) {
    const [matchs, setMatchs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchs = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/ffhandball/mon-equipe`,
                    { withCredentials: true }
                );
                setMatchs(data.data.matchsAVenir.slice(0, 3));
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
                <CardTitle className="text-xl flex items-center gap-2">
                    Prochains matchs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {matchs.length === 0 ? (
                    <p className="text-neutral-500 text-center py-8">Aucun match à venir</p>
                ) : (
                    matchs.map((match, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                        >
                            {/* Date + Heure à gauche */}
                            <div className="flex flex-col gap-1 min-w-[140px]">
                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">
                                        {match.dateSimple ? new Date(match.dateSimple).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short'
                                        }) : 'À confirmer'}
                                    </span>
                                </div>
                                {match.heure && (
                                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                                        <Clock className="w-3 h-3" />
                                        {match.heure}
                                    </div>
                                )}
                            </div>

                            {/* Match au centre */}
                            <div className="flex items-center gap-3 flex-1">
                                <p className="font-semibold text-sm flex-1 text-right truncate">{match.domicile}</p>
                                <span className="font-bold text-neutral-400 text-lg px-2">VS</span>
                                <p className="font-semibold text-sm flex-1 text-left truncate">{match.exterieur}</p>
                            </div>

                            {/* Infos à droite */}
                            <div className="flex flex-col gap-1 items-end min-w-[100px]">
                                {match.domExterieur && (
                                    <span className={`font-semibold px-2 py-1 rounded text-xs ${
                                        match.domExterieur === 'Domicile'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {match.domExterieur}
                                    </span>
                                )}
                                {match.salle && (
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-[80px]">{match.salle}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
