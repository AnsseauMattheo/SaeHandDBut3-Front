import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calculator, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GrandEspace from "@/components/Grand-espace.jsx";
import StatsTable from "@/components/StatsTable";
import PossessionPieCharts from "@/components/PossessionPieCharts";
import PhaseRepartitionChart from "@/components/RepartitionChart.jsx";
import EfficacitePhases from "@/components/EfficacitePhasesChart.jsx";
import StatsComparaison from "@/components/StatsComparaison.jsx";

export default function StatsAvancees() {
    const navigate = useNavigate();
    const [matchsData, setMatchsData] = useState(null);
    const [loadingMatches, setLoadingMatches] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMatches, setSelectedMatches] = useState([]);
    const [calculationType, setCalculationType] = useState("moyenne");

    useEffect(() => {
        const abortController = new AbortController();

        fetch(`${import.meta.env.VITE_SERVER_URL}/stats/matchs`, {
            credentials: "include",
            signal: abortController.signal
        })
            .then(r => {
                if (!r.ok) throw new Error(`Erreur HTTP: ${r.status}`);
                return r.json();
            })
            .then(data => {
                console.log("Données reçues:", data);
                setMatchsData(data);
                setError(null);
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    setError(error.message);
                    console.error('Erreur:', error);
                }
            })
            .finally(() => setLoadingMatches(false));

        return () => abortController.abort();
    }, []);

    // ✅ CORRECTION : Mettre matchsList dans useMemo
    const matchsList = useMemo(() => {
        if (!matchsData) return [];

        const allMatches = [];
        Object.entries(matchsData).forEach(([saison, matchesArray]) => {
            matchesArray.forEach(matchData => {
                allMatches.push({
                    ...matchData.match,
                    saison,
                    stats: matchData
                });
            });
        });

        return allMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [matchsData]); // Ne dépend que de matchsData

    // ✅ CORRECTION : Mettre matchesBySeason dans useMemo
    const matchesBySeason = useMemo(() => {
        return matchsList.reduce((acc, match) => {
            if (!acc[match.saison]) {
                acc[match.saison] = [];
            }
            acc[match.saison].push(match);
            return acc;
        }, {});
    }, [matchsList]);

    // Fonction pour calculer l'efficacité
    const calculateEfficacite = (stat) => {
        const totalActions = stat.but + stat.s7mSanctions + stat.arret +
            stat.hc + stat.pdb + stat.tirRateNC +
            stat.arretNC + stat.neutContre;

        const positiveActions = stat.but + stat.s7mSanctions + stat.neutContre;

        return totalActions > 0
            ? parseFloat(((positiveActions / totalActions) * 100).toFixed(2))
            : 0;
    };

    // Fonction pour calculer les pourcentages dans une catégorie
    const calculatePctPhasesGlobales = (categoryData) => {
        if (!categoryData || categoryData.length === 0) return categoryData;

        const totalLine = categoryData.find(stat =>
            stat.type.toLowerCase().includes('total')
        );

        if (!totalLine) return categoryData;

        const totalBallons = totalLine.nbBallonsResultat;

        return categoryData.map(stat => ({
            ...stat,
            pctPhasesGlobales: totalBallons > 0
                ? parseFloat(((stat.nbBallonsResultat / totalBallons) * 100).toFixed(2))
                : 0
        }));
    };

    // Fonction pour agréger les statistiques d'une catégorie
    const aggregateCategory = (matchesData, category, isAverage) => {
        if (!matchesData.length || !matchesData[0].stats[category]) return [];

        const categoryData = matchesData[0].stats[category];
        if (!Array.isArray(categoryData)) return null;

        const aggregated = {};

        matchesData.forEach(match => {
            const stats = match.stats[category];
            if (!stats) return;

            stats.forEach(stat => {
                if (!aggregated[stat.type]) {
                    aggregated[stat.type] = {
                        type: stat.type,
                        but: 0,
                        s7mSanctions: 0,
                        arret: 0,
                        hc: 0,
                        pdb: 0,
                        tirRateNC: 0,
                        arretNC: 0,
                        neutContre: 0,
                        nbBallonsResultat: 0,
                        attendu: stat.attendu || null,
                        attendusSaison: null
                    };
                }

                aggregated[stat.type].but += stat.but || 0;
                aggregated[stat.type].s7mSanctions += stat.s7mSanctions || 0;
                aggregated[stat.type].arret += stat.arret || 0;
                aggregated[stat.type].hc += stat.hc || 0;
                aggregated[stat.type].pdb += stat.pdb || 0;
                aggregated[stat.type].tirRateNC += stat.tirRateNC || 0;
                aggregated[stat.type].arretNC += stat.arretNC || 0;
                aggregated[stat.type].neutContre += stat.neutContre || 0;
                aggregated[stat.type].nbBallonsResultat += stat.nbBallonsResultat || 0;
            });
        });

        const divisor = isAverage ? matchesData.length : 1;

        let result = Object.values(aggregated).map(stat => {
            const divided = {
                ...stat,
                but: parseFloat((stat.but / divisor).toFixed(2)),
                s7mSanctions: parseFloat((stat.s7mSanctions / divisor).toFixed(2)),
                arret: parseFloat((stat.arret / divisor).toFixed(2)),
                hc: parseFloat((stat.hc / divisor).toFixed(2)),
                pdb: parseFloat((stat.pdb / divisor).toFixed(2)),
                tirRateNC: parseFloat((stat.tirRateNC / divisor).toFixed(2)),
                arretNC: parseFloat((stat.arretNC / divisor).toFixed(2)),
                neutContre: parseFloat((stat.neutContre / divisor).toFixed(2)),
                nbBallonsResultat: parseFloat((stat.nbBallonsResultat / divisor).toFixed(2))
            };

            divided.efficacite = calculateEfficacite(divided);

            return divided;
        });

        result = calculatePctPhasesGlobales(result);

        return result;
    };

    // Fonction pour agréger les stats clés
    const aggregateStatsClefs = (matchesData, isEquipe, isAverage) => {
        const divisor = isAverage ? matchesData.length : 1;
        
        const rawData = {
            totalButs: 0,
            totalArrets: 0,
            totalHC: 0,
            totalButs6c6: 0,
            totalPossessions6c6Att: 0,
            totalButsEncaisses6c6: 0,
            totalPossessions6c6Def: 0,
            totalArretsDefense: 0,
            totalHCDefense: 0,
            totalButsPossession: 0,
            totalSanctions7m: 0,
            totalNeutralisations: 0,
            totalPossessions: 0,
            totalPertesBalle: 0,
            totalArretsPossession: 0,
            totalHCPossession: 0
        };
        
        const aggregated = {
            equipe: isEquipe,
            match: {
                mid: -1,
                nomImport: `${isAverage ? "Moyenne" : "Addition"} de ${matchesData.length} matchs`,
                date: new Date().toISOString(),
                adversaire: "Multiple",
                win: true,
                butsMis: 0,
                butsEncaisses: 0,
                loaded: true,
                saison: { id: -1, nom: "Agrégé" }
            },
            buts: 0,
            arrets: 0,
            HC: 0,
            efficaciteTir: 0,
            ballonJouesSurGE: 0,
            batailleGE: 0,
            nbPossessionsPlacees: 0,
            effiDef6c6: 0,
            effiAtt6c6: 0,
            pertesBalles: 0,
            neutralisations: 0,
            effiPossession: 0,
            effiDefPossession: 0,
            possessionGlobal: 0,
            hc: 0
        };
        
        matchesData.forEach(match => {
            const stats = isEquipe 
                ? match.stats.statsClefsDTOEquipe 
                : match.stats.statsClefsDTOAdversaire;
            
            if (!stats) return;
            
            aggregated.buts += stats.buts || 0;
            aggregated.arrets += stats.arrets || 0;
            aggregated.HC += stats.HC || 0;
            aggregated.hc += stats.hc || 0;
            aggregated.ballonJouesSurGE += stats.ballonJouesSurGE || 0;
            aggregated.batailleGE += stats.batailleGE || 0;
            aggregated.nbPossessionsPlacees += stats.nbPossessionsPlacees || 0;
            aggregated.pertesBalles += stats.pertesBalles || 0;
            aggregated.neutralisations += stats.neutralisations || 0;
            aggregated.possessionGlobal += stats.possessionGlobal || 0;
            aggregated.match.butsMis += stats.match?.butsMis || 0;
            aggregated.match.butsEncaisses += stats.match?.butsEncaisses || 0;
            
            rawData.totalButs += stats.buts || 0;
            rawData.totalArrets += stats.arrets || 0;
            rawData.totalHC += stats.HC || 0;
            
            if (isEquipe) {
                const attaqueTotal = match.stats.attaque?.find(a => 
                    a.type === "TOTAL Att 6 c 6"
                );
                const defenseTotal = match.stats.defense?.find(d => 
                    d.type === "TOTAL Déf 6 c 6"
                );
                
                if (attaqueTotal) {
                    rawData.totalButs6c6 += attaqueTotal.but || 0;
                    rawData.totalPossessions6c6Att += attaqueTotal.nbBallonsResultat || 0;
                }
                
                if (defenseTotal) {
                    rawData.totalButsEncaisses6c6 += defenseTotal.but || 0;
                    rawData.totalPossessions6c6Def += defenseTotal.nbBallonsResultat || 0;
                    rawData.totalArretsDefense += defenseTotal.arret || 0;
                    rawData.totalHCDefense += defenseTotal.hc || 0;
                }
                
                const efficacitePossession = match.stats.efficaciteTotal?.find(e => 
                    e.type === "Possession Equipe"
                );
                
                if (efficacitePossession) {
                    rawData.totalButsPossession += efficacitePossession.but || 0;
                    rawData.totalSanctions7m += efficacitePossession.s7mSanctions || 0;
                    rawData.totalNeutralisations += efficacitePossession.neutContre || 0;
                    rawData.totalPossessions += efficacitePossession.nbBallonsResultat || 0;
                    rawData.totalPertesBalle += efficacitePossession.pdb || 0;
                    rawData.totalArretsPossession += efficacitePossession.arret || 0;
                    rawData.totalHCPossession += efficacitePossession.hc || 0;
                }
            } else {
                const defenseTotal = match.stats.defense?.find(d => 
                    d.type === "TOTAL Déf 6 c 6"
                );
                const attaqueTotal = match.stats.attaque?.find(a => 
                    a.type === "TOTAL Att 6 c 6"
                );
                
                if (defenseTotal) {
                    rawData.totalButs6c6 += defenseTotal.but || 0;
                    rawData.totalPossessions6c6Att += defenseTotal.nbBallonsResultat || 0;
                }
                
                if (attaqueTotal) {
                    rawData.totalPossessions6c6Def += attaqueTotal.nbBallonsResultat || 0;
                    rawData.totalArretsDefense += attaqueTotal.arret || 0;
                    rawData.totalHCDefense += attaqueTotal.hc || 0;
                }
                
                const efficacitePossession = match.stats.efficaciteTotal?.find(e => 
                    e.type === "Possession Adversaire"
                );
                
                if (efficacitePossession) {
                    rawData.totalButsPossession += efficacitePossession.but || 0;
                    rawData.totalSanctions7m += efficacitePossession.s7mSanctions || 0;
                    rawData.totalNeutralisations += efficacitePossession.neutContre || 0;
                    rawData.totalPossessions += efficacitePossession.nbBallonsResultat || 0;
                    rawData.totalPertesBalle += efficacitePossession.pdb || 0;
                    rawData.totalArretsPossession += efficacitePossession.arret || 0;
                    rawData.totalHCPossession += efficacitePossession.hc || 0;
                }
            }
        });
        
        aggregated.buts = parseFloat((aggregated.buts / divisor).toFixed(2));
        aggregated.arrets = parseFloat((aggregated.arrets / divisor).toFixed(2));
        aggregated.HC = parseFloat((aggregated.HC / divisor).toFixed(2));
        aggregated.hc = parseFloat((aggregated.hc / divisor).toFixed(2));
        aggregated.ballonJouesSurGE = parseFloat((aggregated.ballonJouesSurGE / divisor).toFixed(2));
        aggregated.batailleGE = parseFloat((aggregated.batailleGE / divisor).toFixed(2));
        aggregated.nbPossessionsPlacees = parseFloat((aggregated.nbPossessionsPlacees / divisor).toFixed(2));
        aggregated.pertesBalles = parseFloat((aggregated.pertesBalles / divisor).toFixed(2));
        aggregated.neutralisations = parseFloat((aggregated.neutralisations / divisor).toFixed(2));
        aggregated.possessionGlobal = parseFloat((aggregated.possessionGlobal / divisor).toFixed(2));
        aggregated.match.butsMis = parseFloat((aggregated.match.butsMis / divisor).toFixed(2));
        aggregated.match.butsEncaisses = parseFloat((aggregated.match.butsEncaisses / divisor).toFixed(2));
        
        const totalTirs = rawData.totalButs + rawData.totalArrets + rawData.totalHC;
        aggregated.efficaciteTir = totalTirs > 0 
            ? parseFloat(((rawData.totalButs / totalTirs) * 100).toFixed(2))
            : 0;
        
        aggregated.effiAtt6c6 = rawData.totalPossessions6c6Att > 0
            ? parseFloat(((rawData.totalButs6c6 / rawData.totalPossessions6c6Att) * 100).toFixed(2))
            : 0;
        
        const totalDefensif = rawData.totalArretsDefense + rawData.totalHCDefense;
        aggregated.effiDef6c6 = rawData.totalPossessions6c6Def > 0
            ? parseFloat(((totalDefensif / rawData.totalPossessions6c6Def) * 100).toFixed(2))
            : 0;
        
        const totalPositif = rawData.totalButsPossession + rawData.totalSanctions7m + rawData.totalNeutralisations;
        aggregated.effiPossession = rawData.totalPossessions > 0
            ? parseFloat(((totalPositif / rawData.totalPossessions) * 100).toFixed(2))
            : 0;
        
        const totalDefPossession = rawData.totalArretsPossession + rawData.totalHCPossession + rawData.totalPertesBalle;
        aggregated.effiDefPossession = rawData.totalPossessions > 0
            ? parseFloat(((totalDefPossession / rawData.totalPossessions) * 100).toFixed(2))
            : 0;
        
        return aggregated;
    };

    // ✅ CORRECTION : Retirer matchsList des dépendances
    const calculatedData = useMemo(() => {
        if (selectedMatches.length === 0 || !matchsData) return null;

        const selectedMatchesData = matchsList.filter(m =>
            selectedMatches.includes(m.mid)
        );

        if (selectedMatchesData.length === 0) return null;

        const isAverage = calculationType === "moyenne";

        const result = {
            attaque: aggregateCategory(selectedMatchesData, 'attaque', isAverage),
            grandEspace: aggregateCategory(selectedMatchesData, 'grandEspace', isAverage),
            repli: aggregateCategory(selectedMatchesData, 'repli', isAverage),
            defense: aggregateCategory(selectedMatchesData, 'defense', isAverage),
            jet7m: aggregateCategory(selectedMatchesData, 'jet7m', isAverage),
            efficaciteTotal: aggregateCategory(selectedMatchesData, 'efficaciteTotal', isAverage),
            statsClefsDTOEquipe: aggregateStatsClefs(selectedMatchesData, true, isAverage),
            statsClefsDTOAdversaire: aggregateStatsClefs(selectedMatchesData, false, isAverage)
        };

        return result;
    }, [selectedMatches, calculationType, matchsData]); // matchsList retiré

    const handleMatchToggle = (matchId) => {
        setSelectedMatches(prev =>
            prev.includes(matchId)
                ? prev.filter(id => id !== matchId)
                : [...prev, matchId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMatches.length === matchsList.length) {
            setSelectedMatches([]);
        } else {
            setSelectedMatches(matchsList.map(m => m.mid));
        }
    };

    const handleSelectSeason = (saison) => {
        const seasonMatches = matchsList
            .filter(m => m.saison === saison)
            .map(m => m.mid);

        const allSelected = seasonMatches.every(mid => selectedMatches.includes(mid));

        if (allSelected) {
            setSelectedMatches(prev => prev.filter(mid => !seasonMatches.includes(mid)));
        } else {
            setSelectedMatches(prev => [...new Set([...prev, ...seasonMatches])]);
        }
    };

    if (loadingMatches) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des matchs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600">
                <div className="text-center">
                    <p className="font-semibold">Erreur de chargement</p>
                    <p className="text-sm">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-8 w-8" />
                        Statistiques Avancées
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Analysez les performances sur plusieurs matchs
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Retour
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Sélection des matchs
                        </CardTitle>
                        <CardDescription>
                            {selectedMatches.length} match{selectedMatches.length > 1 ? 's' : ''} sélectionné{selectedMatches.length > 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Type de calcul</Label>
                            <RadioGroup value={calculationType} onValueChange={setCalculationType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="moyenne" id="moyenne" />
                                    <Label htmlFor="moyenne" className="cursor-pointer">
                                        Moyenne des matchs
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="addition" id="addition" />
                                    <Label htmlFor="addition" className="cursor-pointer">
                                        Addition des matchs
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Matchs disponibles</Label>
                                {matchsList.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedMatches.length === matchsList.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                                    </Button>
                                )}
                            </div>

                            <ScrollArea className="h-[500px] border rounded-md p-4">
                                <div className="space-y-4">
                                    {Object.entries(matchesBySeason).map(([saison, matches]) => (
                                        <div key={saison}>
                                            <div className="flex items-center justify-between mb-2 sticky top-0 bg-white py-1 z-10">
                                                <h3 className="font-semibold text-sm text-gray-700">{saison}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs"
                                                    onClick={() => handleSelectSeason(saison)}
                                                >
                                                    {matches.every(m => selectedMatches.includes(m.mid)) ? 'Désélectionner' : 'Sélectionner'}
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {matches.map((match) => (
                                                    <div key={match.mid} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                                                        <Checkbox
                                                            id={`match-${match.mid}`}
                                                            checked={selectedMatches.includes(match.mid)}
                                                            onCheckedChange={() => handleMatchToggle(match.mid)}
                                                        />
                                                        <Label
                                                            htmlFor={`match-${match.mid}`}
                                                            className="cursor-pointer flex-1 leading-tight"
                                                        >
                                                            <div className="font-medium text-sm">
                                                                {match.nomImport || match.adversaire}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {new Date(match.date).toLocaleDateString('fr-FR')} -
                                                                <span className={match.win ? 'text-green-600' : 'text-red-600'}>
                                                                    {match.win ? ' Victoire' : ' Défaite'}
                                                                </span>
                                                                {' '}({match.butsMis}-{match.butsEncaisses})
                                                            </div>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator className="mt-3" />
                                        </div>
                                    ))}

                                    {matchsList.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            Aucun match disponible
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-xs text-blue-800">
                                <Calculator className="h-3 w-3 inline mr-1" />
                                Calculs automatiques côté client
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    {!calculatedData ? (
                        <Card className="h-full flex items-center justify-center">
                            <CardContent className="text-center py-12">
                                <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Aucun match sélectionné
                                </h3>
                                <p className="text-gray-500">
                                    Sélectionnez des matchs pour voir les statistiques
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Résultats - {calculationType === "moyenne" ? "Moyenne" : "Addition"} de {selectedMatches.length} match{selectedMatches.length > 1 ? 's' : ''}
                                    </CardTitle>
                                    <CardDescription>
                                        Statistiques calculées automatiquement
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <GrandEspace data={calculatedData} />
                            <PossessionPieCharts data={calculatedData} />
                            <PhaseRepartitionChart data={calculatedData} />
                            <EfficacitePhases data={calculatedData} />
                            <StatsComparaison
                                statsEquipe={calculatedData.statsClefsDTOEquipe}
                                statsAdversaire={calculatedData.statsClefsDTOAdversaire}
                            />

                            {calculatedData.grandEspace && (
                                <StatsTable
                                    title="Grand Espace"
                                    data={calculatedData.grandEspace}
                                    showAttendusSaison
                                    colorHeader={"bg-green-50"}
                                />
                            )}

                            {calculatedData.repli && (
                                <StatsTable
                                    title="Repli"
                                    data={calculatedData.repli}
                                    showAttendusSaison
                                    colorHeader={"bg-purple-50"}
                                />
                            )}

                            {calculatedData.attaque && (
                                <StatsTable
                                    title="Attaque"
                                    data={calculatedData.attaque}
                                    showAttendusSaison
                                    colorHeader={"bg-blue-50"}
                                />
                            )}

                            {calculatedData.defense && (
                                <StatsTable
                                    title="Défense"
                                    data={calculatedData.defense}
                                    showAttendusSaison
                                    colorHeader={"bg-red-50"}
                                />
                            )}

                            {calculatedData.jet7m && (
                                <StatsTable
                                    title="Jet de 7 mètres"
                                    data={calculatedData.jet7m}
                                    showAttendusSaison
                                    colorHeader={"bg-yellow-50"}
                                />
                            )}

                            {calculatedData.efficaciteTotal && (
                                <StatsTable
                                    title="Efficacité possession"
                                    data={calculatedData.efficaciteTotal}
                                    showAttendusSaison
                                    colorHeader={"bg-orange-50"}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
