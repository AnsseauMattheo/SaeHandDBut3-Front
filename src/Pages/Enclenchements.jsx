import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import EnclenchementDetailModal from '@/components/EnclenchementDetailModal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Loader2} from 'lucide-react';
import EnclenchementCard from '@/components/EnclenchementCard';
import axios from 'axios';

export default function Enclenchements() {
    const {matchId} = useParams();
    const [stats, setStats] = useState([]);
    const [joueuseStats, setJoueuseStats] = useState([]);
    const [topEnclenchements, setTopEnclenchements] = useState([]);
    const [transitionERStats, setTransitionERStats] = useState([]);
    const [stats6c5, setStats6c5] = useState([]);
    const [stats15, setStats15] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('effectues');
    const [selectedEnclenchement, setSelectedEnclenchement] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleCardClick = (stats) => {
        setSelectedEnclenchement(stats.enclenchement);
        setSelectedType(stats.type);
        setIsDetailModalOpen(true);
    };

    useEffect(() => {
        loadData();
    }, [matchId]);

    const loadData = async () => {
        try {
            setLoading(true);

            const [globalRes, joueuseRes, topRes, erRes, c5Res, stats15Res] = await Promise.all([
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/stats`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/joueuses`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/top?limit=5`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/transition-er`, {
                    withCredentials: true
                }).catch(() => ({ data: [] })),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/6c5`, {
                    withCredentials: true
                }).catch(() => ({ data: [] })),
                // NOUVEAU: enclenchements 15
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/15`, {
                    withCredentials: true
                }).catch(() => ({ data: [] }))
            ]);

            setStats(globalRes.data);
            setJoueuseStats(joueuseRes.data);
            setTopEnclenchements(topRes.data);
            setTransitionERStats(erRes.data);
            setStats6c5(c5Res.data);
            setStats15(stats15Res.data); // NOUVEAU
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des statistiques');
            console.error("Erreur lors de la récupération des enclenchements :", err);
        } finally {
            setLoading(false);
        }
    };


    const sortStats = (statsArray) => {
        const sorted = [...statsArray];
        switch (sortBy) {
            case 'reussite':
                return sorted.sort((a, b) => b.pourcentageReussite - a.pourcentageReussite);
            case 'echecs':
                return sorted.sort((a, b) => b.echecs - a.echecs);
            case 'effectues':
            default:
                return sorted.sort((a, b) => b.effectues - a.effectues);
        }
    };

    const groupByJoueuse = (joueuseStats) => {
        const grouped = joueuseStats.reduce((acc, stat) => {
            if (!acc[stat.joueuse]) acc[stat.joueuse] = [];
            acc[stat.joueuse].push(stat);
            return acc;
        }, {});
        return grouped;
    };

    const calculateSummary = () => {
        const totalActions = stats.reduce((sum, s) => sum + s.effectues, 0);
        const totalReussis = stats.reduce((sum, s) => sum + s.reussis, 0);
        const tauxMoyen = stats.length > 0
            ? stats.reduce((sum, s) => sum + s.pourcentageReussite, 0) / stats.length
            : 0;
        return {totalActions, totalReussis, tauxMoyen};
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600"/>
                <p className="mt-4 text-lg text-gray-600">Chargement des statistiques...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <Button onClick={loadData}>Réessayer</Button>
            </div>
        );
    }

    const summary = calculateSummary();
    const sortedStats = sortStats(stats);
    const groupedJoueuses = groupByJoueuse(joueuseStats);

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Statistiques d'Enclenchements
                </h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">Total Enclenchements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold">{stats.length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">Total Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold">{summary.totalActions}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">Total Réussis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-green-600">{summary.totalReussis}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">Taux Moyen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-blue-600">{summary.tauxMoyen.toFixed(1)}%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top 5 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Enclenchements les plus efficaces</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {topEnclenchements.map((encl, index) => (
                            <EnclenchementCard
                                key={`top-${encl.type}-${encl.enclenchement}-${index}`}
                                stats={encl}
                                rank={index + 1}
                                onClick={handleCardClick}
                            />                        ))}
                    </div>

                </CardContent>
            </Card>
            <EnclenchementDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                enclenchement={selectedEnclenchement}
                type={selectedType}
                matchId={matchId}
            />

            {/* Accordion avec les différentes catégories */}
            <div className="p-2 sm:p-3 lg:p-4">
                <Accordion type="multiple" className="w-full">
                    {/* Enclenchements 0-6 */}
                    <AccordionItem value="0-6">
                        <AccordionTrigger className="text-xs sm:text-sm">
                            Enclenchements 0-6 ({stats.length})
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            {/* Tri */}
                            <div className="mb-4 flex items-center gap-3">
                                <span className="text-sm text-gray-600">Trier par:</span>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="effectues">Effectués</SelectItem>
                                        <SelectItem value="reussite">% Réussite</SelectItem>
                                        <SelectItem value="echecs">Échecs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {sortedStats.map((encl) => (
                                    <EnclenchementCard key={`6c5-${encl.enclenchement}`} stats={encl} onClick={handleCardClick}/>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Transition ER */}
                    {transitionERStats.length > 0 && (
                        <AccordionItem value="transition-er">
                            <AccordionTrigger className="text-xs sm:text-sm">
                                Enclenchements Transition ER ({transitionERStats.length})
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {transitionERStats.map((encl) => (
                                        <EnclenchementCard key={`er-${encl.enclenchement}`} stats={encl} onClick={handleCardClick}/>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* 6 contre 5 */}
                    {stats6c5.length > 0 && (
                        <AccordionItem value="6c5">
                            <AccordionTrigger className="text-xs sm:text-sm">
                                Enclenchements 6 contre 5 ({stats6c5.length})
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {stats6c5.map((encl) => (
                                        <EnclenchementCard key={`06-${encl.enclenchement}`} stats={encl} onClick={handleCardClick}/>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Enclenchements 15 */}
                    {stats15.length > 0 && (
                        <AccordionItem value="15">
                            <AccordionTrigger className="text-xs sm:text-sm">
                                Enclenchements 15 ({stats15.length})
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {stats15.map((encl) => (
                                        <EnclenchementCard key={`15-${encl.enclenchement}`} stats={encl} onClick={handleCardClick}/>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}


                    {/* Par Joueuse */}
                    {Object.keys(groupedJoueuses).map((joueuse) => (
                        <AccordionItem value={joueuse} key={joueuse}>
                            <AccordionTrigger className="text-xs sm:text-sm">
                                👤 {joueuse} ({groupedJoueuses[joueuse].length})
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                    {groupedJoueuses[joueuse].map((encl) => (
                                        <Card key={encl.enclenchement} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-2">
                                                <CardTitle
                                                    className="text-sm line-clamp-2">{encl.enclenchement}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500">Effectués</div>
                                                        <div className="text-lg font-bold">{encl.effectues}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500">Réussis</div>
                                                        <div
                                                            className="text-lg font-bold text-green-600">{encl.reussis}</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500">Taux</div>
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {encl.pourcentageReussite.toFixed(1)}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                        style={{width: `${encl.pourcentageReussite}%`}}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
