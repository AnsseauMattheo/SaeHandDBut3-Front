import { useState } from "react";
import { Loader2, Calculator } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function MatchSelector({ onCalculate }) {
    const [matchsData, setMatchsData] = useState(null);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [selectedMatches, setSelectedMatches] = useState([]);
    const [calculationType, setCalculationType] = useState("moyenne");

    const loadMatchsList = () => {
        setLoadingMatches(true);
        fetch(`${import.meta.env.VITE_SERVER_URL}/stats/matchs`, { credentials: "include" })
            .then(r => r.json())
            .then(data => {
                setMatchsData(data);
            })
            .catch(console.error)
            .finally(() => setLoadingMatches(false));
    };

    // Convertir l'objet de saisons en tableau de matchs avec leur saison
    const getAllMatches = () => {
        if (!matchsData) return [];
        
        const allMatches = [];
        Object.entries(matchsData).forEach(([saison, matches]) => {
            matches.forEach(match => {
                allMatches.push({
                    ...match.match,
                    saison
                });
            });
        });
        
        // Trier par date décroissante
        return allMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const matchsList = getAllMatches();

    const handleMatchToggle = (matchId) => {
        setSelectedMatches(prev => 
            prev.includes(matchId) 
                ? prev.filter(id => id !== matchId)
                : [...prev, matchId]
        );
    };

    const handleCalculate = () => {
        if (selectedMatches.length === 0) return;
        
        // Appeler la fonction de callback avec les données sélectionnées
        onCalculate?.({
            matches: selectedMatches,
            type: calculationType
        });
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
            // Désélectionner tous les matchs de cette saison
            setSelectedMatches(prev => prev.filter(mid => !seasonMatches.includes(mid)));
        } else {
            // Sélectionner tous les matchs de cette saison
            setSelectedMatches(prev => [...new Set([...prev, ...seasonMatches])]);
        }
    };

    // Grouper les matchs par saison
    const matchesBySeason = matchsList.reduce((acc, match) => {
        if (!acc[match.saison]) {
            acc[match.saison] = [];
        }
        acc[match.saison].push(match);
        return acc;
    }, {});

    return (
        <Sheet onOpenChange={(open) => open && loadMatchsList()}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Moyenne des matchs
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Sélection des matchs</SheetTitle>
                    <SheetDescription>
                        Choisissez les matchs à analyser et le type de calcul
                    </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                    {/* Type de calcul */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Type de calcul</Label>
                        <RadioGroup value={calculationType} onValueChange={setCalculationType}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moyenne" id="moyenne" />
                                <Label htmlFor="moyenne" className="cursor-pointer">Moyenne des matchs</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="addition" id="addition" />
                                <Label htmlFor="addition" className="cursor-pointer">Addition des matchs</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Liste des matchs */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">
                                Matchs disponibles ({selectedMatches.length} sélectionné{selectedMatches.length > 1 ? 's' : ''})
                            </Label>
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
                        
                        {loadingMatches ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                Chargement des matchs...
                            </div>
                        ) : (
                            <ScrollArea className="h-[400px] border rounded-md p-4">
                                <div className="space-y-4">
                                    {Object.entries(matchesBySeason).map(([saison, matches]) => (
                                        <div key={saison}>
                                            <div className="flex items-center justify-between mb-2">
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
                                                            <div className="font-medium">{match.nomImport || match.adversaire}</div>
                                                            <div className="text-sm text-gray-500">
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
                        )}
                    </div>
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button 
                            onClick={handleCalculate}
                            disabled={selectedMatches.length === 0}
                        >
                            Calculer ({selectedMatches.length})
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}