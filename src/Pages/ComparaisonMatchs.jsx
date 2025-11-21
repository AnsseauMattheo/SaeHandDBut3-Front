import { useEffect, useState, useMemo } from "react";
import { Loader2, GitCompare, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import chroma from "chroma-js";

export default function ComparaisonMatchs() {
    const [matchsData, setMatchsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [match1Id, setMatch1Id] = useState(null);
    const [match2Id, setMatch2Id] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${import.meta.env.VITE_SERVER_URL}/stats/matchs`, {
            credentials: "include",
            signal: controller.signal
        })
            .then(r => { if (!r.ok) throw new Error(`Erreur HTTP: ${r.status}`); return r.json(); })
            .then(data => { setMatchsData(data); setError(null); })
            .catch(err => { if (err.name !== 'AbortError') { setError(err.message); } })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const matchsList = useMemo(() => {
        if (!matchsData) return [];
        const entries = Array.isArray(matchsData) ? [["", matchsData]] : Object.entries(matchsData);
        const all = [];
        entries.forEach(([saisonNom, arr]) => {
            (arr || []).forEach(entry => {
                const m = entry?.match ?? entry?.macth ?? null;
                if (!m) return;
                all.push({
                    mid: m.mid, date: m.date, adversaire: m.adversaire, nomImport: m.nomImport,
                    win: Boolean(m.win), butsMis: m.butsMis ?? 0, butsEncaisses: m.butsEncaisses ?? 0,
                    saison: m.saison?.nom ?? saisonNom ?? "Inconnue",
                    stats: { ...entry, match: m }
                });
            });
        });
        return all.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [matchsData]);

    const matchesBySeason = useMemo(() => {
        return matchsList.reduce((acc, m) => {
            const k = m.saison || "Inconnue";
            if (!acc[k]) acc[k] = [];
            acc[k].push(m);
            return acc;
        }, {});
    }, [matchsList]);

    const match1 = useMemo(() => matchsList.find(m => m.mid === match1Id), [matchsList, match1Id]);
    const match2 = useMemo(() => matchsList.find(m => m.mid === match2Id), [matchsList, match2Id]);

    const getDiffColor = (val1, val2, higherIsBetter = true) => {
        if (val1 == null || val2 == null) return { bg1: "transparent", bg2: "transparent" };
        const diff = val1 - val2;
        if (diff === 0) return { bg1: "bg-gray-100", bg2: "bg-gray-100" };
        const better = higherIsBetter ? diff > 0 : diff < 0;
        return {
            bg1: better ? "bg-green-200" : "bg-red-200",
            bg2: better ? "bg-red-200" : "bg-green-200"
        };
    };

    const Arrow = ({ val1, val2, higherIsBetter = true }) => {
        if (val1 == null || val2 == null || val1 === val2) return <Minus className="w-4 h-4 text-gray-400 inline ml-1" />;
        const better = higherIsBetter ? val1 > val2 : val1 < val2;
        return better 
            ? <ArrowUp className="w-4 h-4 text-green-600 inline ml-1" />
            : <ArrowDown className="w-4 h-4 text-red-600 inline ml-1" />;
    };

    const statsRows = [
        { label: "Buts", key: "buts", higher: true },
        { label: "Arrêts", key: "arrets", higher: true },
        { label: "HC", key: "HC", higher: true },
        { label: "Efficacité au tir", key: "efficaciteTir", higher: true, pct: true },
        { label: "Ballons joués sur GE", key: "ballonJouesSurGE", higher: true },
        { label: "Bataille GE", key: "batailleGE", higher: true },
        { label: "Possessions attaque placée", key: "nbPossessionsPlacees", higher: false },
        { label: "Efficacité Déf 6c6", key: "effiDef6c6", higher: true, pct: true },
        { label: "Efficacité Att 6c6", key: "effiAtt6c6", higher: true, pct: true },
        { label: "Pertes de balles", key: "pertesBalles", higher: false },
        { label: "Neutralisations", key: "neutralisations", higher: true },
        { label: "Efficacité possession", key: "effiPossession", higher: true, pct: true },
        { label: "Efficacité déf possession", key: "effiDefPossession", higher: true, pct: true },
        { label: "Possessions globales", key: "possessionGlobal", higher: true }
    ];

    const ComparisonTable = ({ title, data1, data2, colorHeader }) => {
        if (!data1 || !data2) return null;
        const rows = data1.map((row, i) => ({ ...row, row2: data2[i] }));
        
        return (
            <Card className="mb-6">
                <CardHeader className={colorHeader}>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-left py-2 px-3 font-semibold">Type</th>
                                <th className="text-center px-2 bg-blue-50" colSpan={2}>Match 1</th>
                                <th className="text-center px-2 bg-orange-50" colSpan={2}>Match 2</th>
                                <th className="text-center px-2">Δ Efficacité</th>
                            </tr>
                            <tr className="bg-gray-50 border-b text-xs">
                                <th></th>
                                <th className="px-2 bg-blue-50">Eff.</th>
                                <th className="px-2 bg-blue-50">Ballons</th>
                                <th className="px-2 bg-orange-50">Eff.</th>
                                <th className="px-2 bg-orange-50">Ballons</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                const eff1 = row.efficacite, eff2 = row.row2?.efficacite;
                                const diff = eff1 != null && eff2 != null ? (eff1 - eff2).toFixed(1) : "-";
                                const diffNum = parseFloat(diff);
                                const diffColor = isNaN(diffNum) ? "" : diffNum > 0 ? "text-green-600 bg-green-50" : diffNum < 0 ? "text-red-600 bg-red-50" : "";
                                const isTotal = row.type?.toLowerCase().includes("total");
                                
                                return (
                                    <tr key={i} className={`border-b hover:bg-gray-50 ${isTotal ? "bg-blue-50 font-semibold" : ""}`}>
                                        <td className="py-2 px-3">{row.type}</td>
                                        <td className="text-center px-2 bg-blue-50/30">{eff1?.toFixed(1) ?? "-"}%</td>
                                        <td className="text-center px-2 bg-blue-50/30">{row.nbBallonsResultat ?? 0}</td>
                                        <td className="text-center px-2 bg-orange-50/30">{eff2?.toFixed(1) ?? "-"}%</td>
                                        <td className="text-center px-2 bg-orange-50/30">{row.row2?.nbBallonsResultat ?? 0}</td>
                                        <td className={`text-center px-2 font-semibold ${diffColor}`}>
                                            {diff !== "-" ? `${diffNum > 0 ? "+" : ""}${diff}%` : "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        );
    };

    if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...</div>;
    if (error) return <div className="flex items-center justify-center h-64 text-red-600"><p>{error}</p></div>;

    return (
        <div className="p-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2"><GitCompare className="h-8 w-8" />Comparaison de Matchs</h1>
                <p className="text-gray-500 mt-1">Comparez les performances entre deux matchs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="bg-blue-50"><CardTitle className="text-lg">Match 1</CardTitle></CardHeader>
                    <CardContent className="pt-4">
                        <Select value={match1Id?.toString() || ""} onValueChange={v => setMatch1Id(parseInt(v))}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner un match" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(matchesBySeason).map(([saison, matches]) => (
                                    <div key={saison}>
                                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">{saison}</div>
                                        {matches.map(m => (
                                            <SelectItem key={m.mid} value={m.mid.toString()} disabled={m.mid === match2Id}>
                                                {m.nomImport || m.adversaire} ({m.butsMis}-{m.butsEncaisses})
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                        {match1 && (
                            <div className="mt-3 text-sm">
                                <p className="font-semibold">{match1.nomImport}</p>
                                <p className="text-gray-500">{new Date(match1.date).toLocaleDateString('fr-FR')} - <span className={match1.win ? "text-green-600" : "text-red-600"}>{match1.win ? "Victoire" : "Défaite"}</span></p>
                                <p className="text-lg font-bold mt-1">{match1.butsMis} - {match1.butsEncaisses}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-orange-50"><CardTitle className="text-lg">Match 2</CardTitle></CardHeader>
                    <CardContent className="pt-4">
                        <Select value={match2Id?.toString() || ""} onValueChange={v => setMatch2Id(parseInt(v))}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner un match" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(matchesBySeason).map(([saison, matches]) => (
                                    <div key={saison}>
                                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">{saison}</div>
                                        {matches.map(m => (
                                            <SelectItem key={m.mid} value={m.mid.toString()} disabled={m.mid === match1Id}>
                                                {m.nomImport || m.adversaire} ({m.butsMis}-{m.butsEncaisses})
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                        {match2 && (
                            <div className="mt-3 text-sm">
                                <p className="font-semibold">{match2.nomImport}</p>
                                <p className="text-gray-500">{new Date(match2.date).toLocaleDateString('fr-FR')} - <span className={match2.win ? "text-green-600" : "text-red-600"}>{match2.win ? "Victoire" : "Défaite"}</span></p>
                                <p className="text-lg font-bold mt-1">{match2.butsMis} - {match2.butsEncaisses}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {match1 && match2 && (
                <div className="space-y-6">
                    {/* Stats Clés Comparaison */}
                    <Card>
                        <CardHeader><CardTitle>Comparaison des Stats Clés (Équipe)</CardTitle></CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">Statistique</th>
                                        <th className="border p-2 bg-blue-100">Match 1</th>
                                        <th className="border p-2 bg-orange-100">Match 2</th>
                                        <th className="border p-2">Différence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsRows.map(row => {
                                        const v1 = match1.stats.statsClefsDTOEquipe?.[row.key];
                                        const v2 = match2.stats.statsClefsDTOEquipe?.[row.key];
                                        const diff = v1 != null && v2 != null ? v1 - v2 : null;
                                        const { bg1, bg2 } = getDiffColor(v1, v2, row.higher);
                                        const diffColor = diff == null ? "" : (row.higher ? diff > 0 : diff < 0) ? "text-green-600 bg-green-50" : (row.higher ? diff < 0 : diff > 0) ? "text-red-600 bg-red-50" : "";
                                        
                                        return (
                                            <tr key={row.key} className="border-b">
                                                <td className="border p-2 bg-gray-50">{row.label}</td>
                                                <td className={`border p-2 text-center ${bg1}`}>{v1 != null ? (row.pct ? `${v1}%` : v1) : "-"}<Arrow val1={v1} val2={v2} higherIsBetter={row.higher} /></td>
                                                <td className={`border p-2 text-center ${bg2}`}>{v2 != null ? (row.pct ? `${v2}%` : v2) : "-"}<Arrow val1={v2} val2={v1} higherIsBetter={row.higher} /></td>
                                                <td className={`border p-2 text-center font-semibold ${diffColor}`}>{diff != null ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)}${row.pct ? "%" : ""}` : "-"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <ComparisonTable title="Grand Espace" data1={match1.stats.grandEspace} data2={match2.stats.grandEspace} colorHeader="bg-green-50" />
                    <ComparisonTable title="Repli" data1={match1.stats.repli} data2={match2.stats.repli} colorHeader="bg-purple-50" />
                    <ComparisonTable title="Attaque" data1={match1.stats.attaque} data2={match2.stats.attaque} colorHeader="bg-blue-50" />
                    <ComparisonTable title="Défense" data1={match1.stats.defense} data2={match2.stats.defense} colorHeader="bg-red-50" />
                    <ComparisonTable title="Jet 7m" data1={match1.stats.jet7m} data2={match2.stats.jet7m} colorHeader="bg-yellow-50" />
                    <ComparisonTable title="Efficacité Possession" data1={match1.stats.efficaciteTotal} data2={match2.stats.efficaciteTotal} colorHeader="bg-orange-50" />
                </div>
            )}

            {(!match1 || !match2) && (
                <Card className="h-64 flex items-center justify-center">
                    <CardContent className="text-center">
                        <GitCompare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Sélectionnez deux matchs</h3>
                        <p className="text-gray-500">Choisissez deux matchs pour comparer leurs statistiques</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}