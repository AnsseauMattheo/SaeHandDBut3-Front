import {useState, useEffect, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import EnclenchementDetailModal from '@/components/EnclenchementDetailModal';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label} from 'recharts';

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

    const [stats06, setStats06] = useState([]);
    const [statsER, setStatsER] = useState([]);
    const [stats6c5, setStats6c5] = useState([]);
    const [stats15, setStats15] = useState([]);
    const [joueuseStats, setJoueuseStats] = useState({});
    const [topEnclenchements, setTopEnclenchements] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('reussite');
    const [selectedEnclenchement, setSelectedEnclenchement] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedJoueuse, setSelectedJoueuse] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleCardClick = (stats) => {
        setSelectedEnclenchement(stats.enclenchement);
        setSelectedType(stats.type);
        setSelectedJoueuse(null);
        setIsDetailModalOpen(true);
    };

    const handleJoueuseCardClick = (stats, joueuse) => {
        setSelectedEnclenchement(stats.enclenchement);
        setSelectedType(stats.type);
        setSelectedJoueuse(joueuse);
        setIsDetailModalOpen(true);
    };

    useEffect(() => {
        loadData();
    }, [matchId]);

    const loadData = async () => {
        try {
            setLoading(true);

            const [res06, joueuseRes, topRes, resER, res6c5, res15] = await Promise.all([
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/stats`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/joueuses`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/top?limit=10`, {
                    withCredentials: true
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/transition-er`, {
                    withCredentials: true
                }).catch(() => ({data: []})),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/6c5`, {
                    withCredentials: true
                }).catch(() => ({data: []})),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/15`, {
                    withCredentials: true
                }).catch(() => ({data: []}))
            ]);

            setStats06(res06.data);
            setJoueuseStats(joueuseRes.data);
            setTopEnclenchements(topRes.data);
            setStatsER(resER.data);
            setStats6c5(res6c5.data);
            setStats15(res15.data);
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
                return sorted.sort((a, b) => b.effectues - a.effectues);
            default:
                return sorted;
        }
    };

    const sortedStats06 = useMemo(() => sortStats(stats06), [stats06, sortBy]);
    const sortedStatsER = useMemo(() => sortStats(statsER), [statsER, sortBy]);
    const sortedStats6c5 = useMemo(() => sortStats(stats6c5), [stats6c5, sortBy]);
    const sortedStats15 = useMemo(() => sortStats(stats15), [stats15, sortBy]);
    const sortedTopEnclenchements = useMemo(() => {
        const allEnclenchements = [...stats06, ...statsER, ...stats6c5, ...stats15];
        const sorted = sortStats(allEnclenchements);
        return sorted.slice(0, 5);
    }, [stats06, statsER, stats6c5, stats15, sortBy]);
    const sortedJoueuseStats = useMemo(() => {
        const result = {};
        Object.keys(joueuseStats).forEach(joueuse => {
            result[joueuse] = sortStats(joueuseStats[joueuse]);
        });
        return result;
    }, [joueuseStats, sortBy]);

    const calculateSummary = () => {
        const allEnclenchements = [...stats06, ...statsER, ...stats6c5, ...stats15];

        const totalEnclenchementsDifferents = allEnclenchements.length;
        const totalActions = allEnclenchements.reduce((sum, s) => sum + s.effectues, 0);
        const totalReussis = allEnclenchements.reduce((sum, s) => sum + s.reussis, 0);
        const tauxMoyen = allEnclenchements.length > 0
            ? allEnclenchements.reduce((sum, s) => sum + s.pourcentageReussite, 0) / allEnclenchements.length
            : 0;

        return {
            totalEnclenchementsDifferents,
            totalActions,
            totalReussis,
            tauxMoyen
        };
    };

    const calculateProportions = useMemo(() => {
        const allEnclenchements = [...stats06, ...statsER, ...stats6c5, ...stats15];
        const totalActions = allEnclenchements.reduce((sum, s) => sum + s.effectues, 0);

        const grouped = allEnclenchements.reduce((acc, encl) => {
            const name = encl.enclenchement;
            if (!acc[name]) {
                acc[name] = {
                    name: name,
                    count: 0,
                    reussis: 0,
                    types: new Set(),
                    details: []
                };
            }
            acc[name].count += encl.effectues;
            acc[name].reussis += encl.reussis;
            acc[name].types.add(encl.type);
            acc[name].details.push({
                type: encl.type,
                count: encl.effectues,
                efficacite: encl.pourcentageReussite
            });
            return acc;
        }, {});

        return Object.values(grouped)
            .map(item => ({
                name: item.name,
                count: item.count,
                reussis: item.reussis,
                percentage: totalActions > 0 ? (item.count / totalActions) * 100 : 0,
                efficacite: item.count > 0 ? (item.reussis / item.count) * 100 : 0,
                types: Array.from(item.types).join(', '),
                typesCount: item.types.size,
                details: item.details
            }))
            .sort((a, b) => b.count - a.count);
    }, [stats06, statsER, stats6c5, stats15]);

    const pieChartData = useMemo(() => {
        return calculateProportions.map((item, index) => ({
            name: item.name,
            value: item.count,
            percentage: item.percentage
        }));
    }, [calculateProportions]);

    const COLORS = useMemo(() => {
        return pieChartData.map((_, index) => {
            const hue = (index * 137.5) % 360;
            return `hsl(${hue}, 70%, 60%)`;
        });
    }, [pieChartData.length]);

    const renderLabel = (entry) => {
        if (entry.percentage > 4) {
            return entry.name;
        }
        return '';
    };

    const CustomTooltip = ({active, payload}) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white px-3 py-2 rounded shadow-lg border border-gray-200">
                    <p className="font-semibold text-sm">{data.name}</p>
                    <p className="text-xs text-gray-600">{data.value} actions
                        ({data.payload.percentage.toFixed(1)}%)</p>
                </div>
            );
        }
        return null;
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

    const SortSelector = () => (
        <div className=" flex items-center gap-3">
            <span className="text-sm text-gray-600">Trier par:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="effectues">Effectués</SelectItem>
                    <SelectItem value="reussite">% Efficacité</SelectItem>
                    <SelectItem value="echecs">Échecs</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <div className="container mx-auto p-6">

            {/* Summary Cards + Camembert */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Récapitulatif des enclenchements</CardTitle>
                </CardHeader>
                <CardContent className="pt-1">
                    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <span
                                        className="text-4xl font-bold text-gray-800">{summary.totalEnclenchementsDifferents}</span>
                                    <span className="text-xs text-gray-500 mt-2">Enclenchements différents</span>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <span className="text-4xl font-bold text-gray-800">{summary.totalActions}</span>
                                    <span className="text-xs text-gray-500 mt-2">Nombre d'actions</span>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <span className="text-4xl font-bold text-green-600">{summary.totalReussis}</span>
                                    <span className="text-xs text-gray-500 mt-2">Actions réussies</span>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-4">
                                    <span
                                        className="text-4xl font-bold text-blue-600">{summary.tauxMoyen.toFixed(1)}%</span>
                                    <span className="text-xs text-gray-500 mt-2">Efficacité moyenne</span>
                                </CardContent>
                            </Card>
                        </div>


                        {/* Droite: Camembert */}
                        <Card className="py-3">
                            <CardHeader>
                                <CardTitle className="text-s text-gray-500">Proportion de l'utilisation des enclenchements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <ResponsiveContainer width="100%" height={360}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderLabel}
                                                outerRadius={130}
                                                innerRadius={55}
                                                fill="#8884d8"
                                                dataKey="value"
                                                animationDuration={800}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                        className="hover:opacity-80 cursor-pointer transition-opacity stroke-white"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip/>}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>


            {/* Top 5 */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>Top 5 Enclenchements</CardTitle>
                        <SortSelector/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {sortedTopEnclenchements.map((encl, index) => (
                            <EnclenchementCard
                                key={`top-${encl.type}-${encl.enclenchement}-${index}`}
                                stats={encl}
                                rank={index + 1}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <EnclenchementDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                enclenchement={selectedEnclenchement}
                type={selectedType}
                joueuse={selectedJoueuse}
                matchId={matchId}
            />


            <div>
                <Accordion type="multiple" className="w-full space-y-2" defaultValue={["types"]}>
                    {/* SECTION: Types d'enclenchements */}
                    <AccordionItem value="types">
                        <AccordionTrigger className="text-lg">
                            Enclenchements
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <Accordion type="multiple" className="w-full space-y-1">
                                {/* Enclenchements 0-6 */}
                                <AccordionItem value="0-6">
                                    <AccordionTrigger className="text-base pl-4">
                                        Attaque 0-6 ({stats06.length})
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pl-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                            {sortedStats06.map((encl, index) => (
                                                <EnclenchementCard
                                                    key={`06-${encl.enclenchement}-${index}`}
                                                    stats={encl}
                                                    onClick={handleCardClick}
                                                />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Transition ER */}
                                {statsER.length > 0 && (
                                    <AccordionItem value="transition-er">
                                        <AccordionTrigger className="text-base pl-4">
                                            Transition ER ({statsER.length})
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pl-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                                {sortedStatsER.map((encl, index) => (
                                                    <EnclenchementCard
                                                        key={`er-${encl.enclenchement}-${index}`}
                                                        stats={encl}
                                                        onClick={handleCardClick}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                {/* 6 contre 5 */}
                                {stats6c5.length > 0 && (
                                    <AccordionItem value="6c5">
                                        <AccordionTrigger className="text-base pl-4">
                                            6 contre 5 ({stats6c5.length})
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pl-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                                {sortedStats6c5.map((encl, index) => (
                                                    <EnclenchementCard
                                                        key={`6c5-${encl.enclenchement}-${index}`}
                                                        stats={encl}
                                                        onClick={handleCardClick}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}

                                {/* Enclenchements 15 */}
                                {stats15.length > 0 && (
                                    <AccordionItem value="15">
                                        <AccordionTrigger className="text-base pl-4">
                                            Enclenchements 15 ({stats15.length})
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pl-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                                {sortedStats15.map((encl, index) => (
                                                    <EnclenchementCard
                                                        key={`15-${encl.enclenchement}-${index}`}
                                                        stats={encl}
                                                        onClick={handleCardClick}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>

                    {/* SECTION: Par joueuse */}
                    <AccordionItem value="joueuses">
                        <AccordionTrigger className="text-lg">
                            Joueuses
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <Accordion type="multiple" className="w-full space-y-1">
                                {Object.keys(sortedJoueuseStats).map((joueuse) => (
                                    <AccordionItem value={joueuse} key={joueuse}>
                                        <AccordionTrigger className="text-base pl-4">
                                            {joueuse} ({sortedJoueuseStats[joueuse].length})
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pl-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {sortedJoueuseStats[joueuse].map((encl, index) => (
                                                    <EnclenchementCard
                                                        key={`joueuse-${joueuse}-${encl.type}-${encl.enclenchement}-${index}`}
                                                        stats={encl}
                                                        onClick={(stats) => handleJoueuseCardClick(stats, joueuse)}
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    );
}
