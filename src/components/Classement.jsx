import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

export default function Classement() {
    const [classement, setClassement] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassement = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/ffhandball/classement`,
                    { withCredentials: true }
                );
                setClassement(data.data);
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClassement();
    }, []);

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
                    Classement
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b-2 border-neutral-200">
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700">Pos</th>
                            <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700 min-w-[120px] sm:min-w-[200px]">Équipe</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700">Pts</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700 hidden sm:table-cell">J</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700 hidden md:table-cell">G</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700 hidden md:table-cell">N</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700 hidden md:table-cell">P</th>
                            <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-neutral-700">+/-</th>
                        </tr>
                        </thead>
                        <tbody>
                        {classement.map((equipe) => (
                            <tr
                                key={equipe.position}
                                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                            >
                                {/* Position */}
                                <td className="p-2 sm:p-3 text-center">
                                    <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                                        equipe.position <= 3 ? 'bg-green-100 text-green-800' :
                                            equipe.position >= 12 ? 'bg-red-100 text-red-800' :
                                                'bg-neutral-100 text-neutral-800'
                                    }`}>
                                        {equipe.position}
                                    </div>
                                </td>

                                {/* Logo + Nom équipe */}
                                <td className="p-2 sm:p-3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        {equipe.logo && (
                                            <img
                                                src={equipe.logo}
                                                alt={equipe.equipe}
                                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain shrink-0"
                                            />
                                        )}
                                        <span className="font-semibold text-xs sm:text-sm truncate">{equipe.equipe}</span>
                                    </div>
                                </td>

                                {/* Points */}
                                <td className="p-2 sm:p-3 text-center">
                                    <span className="font-bold text-primary text-sm sm:text-base">{equipe.points}</span>
                                </td>

                                {/* Joués */}
                                <td className="p-2 sm:p-3 text-center text-neutral-700 text-xs sm:text-sm hidden sm:table-cell">
                                    {equipe.joues}
                                </td>

                                {/* Gagnés */}
                                <td className="p-2 sm:p-3 text-center hidden md:table-cell">
                                    <span className="text-green-600 font-semibold text-xs sm:text-sm">{equipe.gagnes}</span>
                                </td>

                                {/* Nuls */}
                                <td className="p-2 sm:p-3 text-center hidden md:table-cell">
                                    <span className="text-orange-500 text-xs sm:text-sm">{equipe.nuls}</span>
                                </td>

                                {/* Perdus */}
                                <td className="p-2 sm:p-3 text-center hidden md:table-cell">
                                    <span className="text-red-600 text-xs sm:text-sm">{equipe.perdus}</span>
                                </td>

                                {/* Différence */}
                                <td className="p-2 sm:p-3 text-center">
                        <span className={`font-semibold text-xs sm:text-sm ${
                            equipe.diff > 0 ? 'text-green-600' :
                                equipe.diff < 0 ? 'text-red-600' :
                                    'text-neutral-600'
                        }`}>
                            {equipe.diff > 0 ? '+' : ''}{equipe.diff}
                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>

        </Card>
    );
}
