// Pages/AnalyseGB.jsx
import { useEffect, useState, useMemo, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import CarteTirs from "@/components/CarteTirs";
import axios from "axios";

// -------------------------------------------------------------------
// Calcul GB (selon Excel)
// -------------------------------------------------------------------
function computeGbTable(stats) {
    const rows = [];

    stats.secteurs.forEach((s) => {
        const cat = s.categorie || "";
        const tirsCadres = s.arrets + s.buts;
        const pctArret = tirsCadres > 0 ? (s.arrets / tirsCadres) * 100 : 0;
        const tirsTotaux = s.buts + s.arrets + s.hc;
        const pctTireuse = tirsTotaux > 0 ? (s.buts / tirsTotaux) * 100 : 0;

        rows.push({
            categorie: cat,
            secteur: s.secteur,
            arrets: s.arrets,
            tirsCadres,
            pctArret: Math.round(pctArret),
            buts: s.buts,
            tirs: tirsTotaux,
            pctTireuse: Math.round(pctTireuse),
        });
    });

    const champArrets = stats.totalChampArrets;
    const champButs = stats.totalChampButs;
    const champTirsCadres = champArrets + champButs;
    const champTirsTotaux = champButs + champArrets + stats.totalChampHc;
    const champPctArret = champTirsCadres > 0 ? (champArrets / champTirsCadres) * 100 : 0;
    const champPctTireuse = champTirsTotaux > 0 ? (champButs / champTirsTotaux) * 100 : 0;

    const a7Arrets = stats.totalAvec7mArrets;
    const a7Buts = stats.totalAvec7mButs;
    const a7TirsCadres = a7Arrets + a7Buts;
    const a7TirsTotaux = a7Buts + a7Arrets + stats.totalAvec7mHc;
    const a7PctArret = a7TirsCadres > 0 ? (a7Arrets / a7TirsCadres) * 100 : 0;
    const a7PctTireuse = a7TirsTotaux > 0 ? (a7Buts / a7TirsTotaux) * 100 : 0;

    return {
        rows,
        totals: {
            champ: {
                arrets: champArrets,
                tirsCadres: champTirsCadres,
                pctArret: Math.round(champPctArret),
                buts: champButs,
                tirs: champTirsTotaux,
                pctTireuse: Math.round(champPctTireuse),
            },
            avec7m: {
                arrets: a7Arrets,
                tirsCadres: a7TirsCadres,
                pctArret: Math.round(a7PctArret),
                buts: a7Buts,
                tirs: a7TirsTotaux,
                pctTireuse: Math.round(a7PctTireuse),
            },
        },
    };
}

// -------------------------------------------------------------------
// Données pour CarteTirs
// -------------------------------------------------------------------
function formatDataForCarteTirs(stats) {
    const tirs = stats.secteurs.map((s) => ({
        secteur: s.secteur,
        tirsTotal: s.arrets + s.buts,
        tirsReussi: s.arrets,
    }));
    return [{ tirs }];
}

// -------------------------------------------------------------------
// Tableau Secteurs bruts
// -------------------------------------------------------------------
function GardienneSecteursTable({ stats }) {
    const { secteurs } = stats;
    const grouped = secteurs.reduce((acc, s) => {
        const cat = s.categorie || "Autres";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
    }, {});

    const totalChampTirs = stats.totalChampButs + stats.totalChampArrets + stats.totalChampHc + stats.totalChampArretNc;
    const totalAvec7mTirs = stats.totalAvec7mButs + stats.totalAvec7mArrets + stats.totalAvec7mHc + stats.totalAvec7mArretNc;

    return (
        <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base text-primary">Secteurs · {stats.joueuse}</CardTitle>
                <p className="text-xs text-neutral-500">Répartition des tirs par secteur · BUTS / Arrêts / HC / Arrêts NC</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                    <thead className="bg-neutral-100 text-neutral-700">
                    <tr>
                        <th className="text-left p-2">Catégorie</th>
                        <th className="text-left p-2">Secteur</th>
                        <th className="text-center p-2">BUTS</th>
                        <th className="text-center p-2">Arrêts</th>
                        <th className="text-center p-2">HC</th>
                        <th className="text-center p-2">Arrêts NC</th>
                        <th className="text-center p-2">Total tirs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(grouped).map(([categorie, lignes]) => (
                        <Fragment key={categorie}>
                            <tr className="bg-neutral-50 border-t border-neutral-200">
                                <td className="p-2 font-semibold text-neutral-800" colSpan={7}>{categorie}</td>
                            </tr>
                            {lignes.map((s) => {
                                const total = s.buts + s.arrets + s.hc + s.arretNc;
                                return (
                                    <tr key={s.secteur} className="border-b border-neutral-100 hover:bg-neutral-50">
                                        <td className="p-2 text-neutral-500"></td>
                                        <td className="p-2 font-medium">{s.secteur}</td>
                                        <td className="text-center p-2 text-red-500 font-semibold">{s.buts}</td>
                                        <td className="text-center p-2 text-emerald-600 font-semibold">{s.arrets}</td>
                                        <td className="text-center p-2 text-neutral-500">{s.hc}</td>
                                        <td className="text-center p-2 text-orange-500">{s.arretNc}</td>
                                        <td className="text-center p-2 text-neutral-800">{total}</td>
                                    </tr>
                                );
                            })}
                        </Fragment>
                    ))}
                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>TOTAL Champ</td>
                        <td className="text-center p-2 text-red-500">{stats.totalChampButs}</td>
                        <td className="text-center p-2 text-emerald-600">{stats.totalChampArrets}</td>
                        <td className="text-center p-2 text-neutral-500">{stats.totalChampHc}</td>
                        <td className="text-center p-2 text-orange-500">{stats.totalChampArretNc}</td>
                        <td className="text-center p-2 text-neutral-800">{totalChampTirs}</td>
                    </tr>
                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>TOTAL avec 7m</td>
                        <td className="text-center p-2 text-red-500">{stats.totalAvec7mButs}</td>
                        <td className="text-center p-2 text-emerald-600">{stats.totalAvec7mArrets}</td>
                        <td className="text-center p-2 text-neutral-500">{stats.totalAvec7mHc}</td>
                        <td className="text-center p-2 text-orange-500">{stats.totalAvec7mArretNc}</td>
                        <td className="text-center p-2 text-neutral-800">{totalAvec7mTirs}</td>
                    </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

// -------------------------------------------------------------------
// Tableau GB avec pourcentages
// -------------------------------------------------------------------
function GbTable({ stats }) {
    const { rows, totals } = useMemo(() => computeGbTable(stats), [stats]);
    const grouped = useMemo(() => {
        return rows.reduce((acc, r) => {
            const key = r.categorie || "";
            if (!acc[key]) acc[key] = [];
            acc[key].push(r);
            return acc;
        }, {});
    }, [rows]);

    return (
        <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base text-primary">GB – {stats.joueuse}</CardTitle>
                <p className="text-xs text-neutral-500">% arrêt gardienne et % tireuse par secteur</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                    <thead className="bg-neutral-100 text-neutral-700">
                    <tr>
                        <th className="text-left p-2">GB</th>
                        <th className="text-left p-2">Secteurs</th>
                        <th className="text-center p-2">Arrêt</th>
                        <th className="text-center p-2">Tirs cadrés</th>
                        <th className="text-center p-2">% Arrêt</th>
                        <th className="text-center p-2">But</th>
                        <th className="text-center p-2">Tirs</th>
                        <th className="text-center p-2">% tireuse</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(grouped).map(([categorie, lignes]) => (
                        <Fragment key={categorie || "no-cat"}>
                            {categorie && (
                                <tr className="bg-neutral-50 border-t border-neutral-200">
                                    <td className="p-2 font-semibold text-neutral-800" colSpan={8}>{categorie}</td>
                                </tr>
                            )}
                            {lignes.map((r) => (
                                <tr key={`${categorie}-${r.secteur}`} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-2 text-neutral-500"></td>
                                    <td className="p-2 font-medium">{r.secteur}</td>
                                    <td className="text-center p-2 text-emerald-600 font-semibold">{r.arrets}</td>
                                    <td className="text-center p-2 text-neutral-800">{r.tirsCadres}</td>
                                    <td className="text-center p-2 text-neutral-800">{r.pctArret}%</td>
                                    <td className="text-center p-2 text-red-500 font-semibold">{r.buts}</td>
                                    <td className="text-center p-2 text-neutral-800">{r.tirs}</td>
                                    <td className="text-center p-2 text-neutral-800">{r.pctTireuse}%</td>
                                </tr>
                            ))}
                        </Fragment>
                    ))}
                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>TOTAL Champ</td>
                        <td className="text-center p-2 text-emerald-600">{totals.champ.arrets}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.champ.tirsCadres}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.champ.pctArret}%</td>
                        <td className="text-center p-2 text-red-500">{totals.champ.buts}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.champ.tirs}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.champ.pctTireuse}%</td>
                    </tr>
                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>TOTAL avec 7m</td>
                        <td className="text-center p-2 text-emerald-600">{totals.avec7m.arrets}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.avec7m.tirsCadres}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.avec7m.pctArret}%</td>
                        <td className="text-center p-2 text-red-500">{totals.avec7m.buts}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.avec7m.tirs}</td>
                        <td className="text-center p-2 text-neutral-800">{totals.avec7m.pctTireuse}%</td>
                    </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

// -------------------------------------------------------------------
// Page principale
// -------------------------------------------------------------------
export default function AnalyseGB() {
    const { matchId } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joueuses, setJoueuses] = useState([]);
    const [selectedGbs, setSelectedGbs] = useState([]);
    const [appui, setAppui] = useState(true);

    // Charger les gardiennes
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/joueuses/JoueusesParAffectation`, {
                withCredentials: true,
            })
            .then((response) => {
                const payload = response?.data;
                let gardiennes = [];

                if (payload && typeof payload === "object" && !Array.isArray(payload)) {
                    gardiennes = payload.GB || payload.Gardiennes || payload["Gardien de but"] || [];
                    if (gardiennes.length === 0) {
                        const flat = Object.values(payload).flat();
                        gardiennes = flat.filter((j) =>
                            (j?.affectation?.affectation || "").toUpperCase().includes("GB") ||
                            (j?.affectation?.affectation || "").toUpperCase().includes("GARD")
                        );
                    }
                } else if (Array.isArray(payload)) {
                    gardiennes = payload.filter((j) =>
                        (j?.affectation?.affectation || "").toUpperCase().includes("GB")
                    );
                }

                setJoueuses(gardiennes);
                if (gardiennes.length > 0) {
                    setSelectedGbs(gardiennes);
                }
            })
            .catch((error) => {
                console.error("Erreur récupération joueuses :", error);
                setJoueuses([]);
            });
    }, []);

    // Charger les stats
    useEffect(() => {
        if (!matchId || selectedGbs.length === 0) {
            setStats(null);
            return;
        }

        const loadAll = async () => {
            try {
                setLoading(true);
                const promises = selectedGbs.map((gb) =>
                    fetch(
                        `${import.meta.env.VITE_SERVER_URL}/stats/gardiennes/match/${matchId}/joueuse/${encodeURIComponent(gb.nom)}`,
                        { credentials: "include" }
                    ).then((r) => (r.ok ? r.json() : null))
                );

                const results = await Promise.all(promises);
                const validResults = results.filter((r) => r !== null);

                if (validResults.length === 0) {
                    setError("Aucune donnée disponible");
                    setStats(null);
                    return;
                }

                const aggregated = aggregateStats(validResults);
                setStats(aggregated);
                setError(null);
            } catch (e) {
                console.error(e);
                setError("Erreur chargement stats");
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, [matchId, selectedGbs]);

    function aggregateStats(statsArray) {
        if (statsArray.length === 1) return statsArray[0];

        const noms = statsArray.map((s) => s.joueuse).join(" + ");
        const secteursMap = new Map();

        statsArray.forEach((stat) => {
            stat.secteurs.forEach((s) => {
                const key = s.secteur;
                if (!secteursMap.has(key)) {
                    secteursMap.set(key, {
                        categorie: s.categorie,
                        secteur: s.secteur,
                        buts: 0,
                        arrets: 0,
                        hc: 0,
                        arretNc: 0
                    });
                }
                const current = secteursMap.get(key);
                current.buts += s.buts || 0;
                current.arrets += s.arrets || 0;
                current.hc += s.hc || 0;
                current.arretNc += s.arretNc || 0;
            });
        });

        const totalChampButs = statsArray.reduce((sum, s) => sum + (s.totalChampButs || 0), 0);
        const totalChampArrets = statsArray.reduce((sum, s) => sum + (s.totalChampArrets || 0), 0);
        const totalChampHc = statsArray.reduce((sum, s) => sum + (s.totalChampHc || 0), 0);
        const totalChampArretNc = statsArray.reduce((sum, s) => sum + (s.totalChampArretNc || 0), 0);
        const totalAvec7mButs = statsArray.reduce((sum, s) => sum + (s.totalAvec7mButs || 0), 0);
        const totalAvec7mArrets = statsArray.reduce((sum, s) => sum + (s.totalAvec7mArrets || 0), 0);
        const totalAvec7mHc = statsArray.reduce((sum, s) => sum + (s.totalAvec7mHc || 0), 0);
        const totalAvec7mArretNc = statsArray.reduce((sum, s) => sum + (s.totalAvec7mArretNc || 0), 0);

        return {
            joueuse: noms,
            matchId: statsArray[0].matchId,
            totalChampButs,
            totalChampArrets,
            totalChampHc,
            totalChampArretNc,
            totalAvec7mButs,
            totalAvec7mArrets,
            totalAvec7mHc,
            totalAvec7mArretNc,
            secteurs: Array.from(secteursMap.values()),
        };
    }

    const toggleGb = (gb) => {
        setSelectedGbs((prev) => {
            const isSelected = prev.some((g) => g.nom === gb.nom);
            if (isSelected) {
                // Permet de désélectionner même si c'est la dernière
                return prev.filter((g) => g.nom !== gb.nom);
            } else {
                return [...prev, gb];
            }
        });
    };


    const selectAll = () => setSelectedGbs(joueuses);
    const clearAll = () => {
        setSelectedGbs([]);
    };

    const carteTirsData = stats ? formatDataForCarteTirs(stats) : null;

    return (
        <div className="flex justify-center px-2 sm:px-4 lg:px-6">
            <Card className="w-full max-w-7xl">
                <CardContent className="p-3 sm:p-4 lg:p-6 mb-4 sm:mb-7">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-[400px] lg:h-[600px]">

                        {/* Barre latérale gardiennes */}
                        <div className="flex flex-col w-full lg:w-56 xl:w-64 h-[320px] lg:h-full bg-gradient-to-b from-neutral-50 to-white rounded-xl border border-neutral-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-neutral-200 bg-white rounded-t-xl">
                                <h2 className="text-sm font-semibold text-neutral-800 mb-3">Gardiennes</h2>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                                        onClick={selectAll}
                                    >
                                        Toutes
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 h-8 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                                        onClick={clearAll}
                                    >
                                        Réinitialiser
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                                {joueuses.length === 0 && (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-xs text-neutral-400 text-center">Aucune gardienne disponible</p>
                                    </div>
                                )}
                                {joueuses.map((j) => {
                                    const isSelected = selectedGbs.some((g) => g.nom === j.nom);
                                    return (
                                        <button
                                            key={j.nom}
                                            onClick={() => toggleGb(j)}
                                            className={[
                                                "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-3 group",
                                                isSelected
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "bg-white hover:bg-neutral-50 text-neutral-700 hover:shadow-sm border border-neutral-200 hover:border-neutral-300",
                                            ].join(" ")}
                                        >
                                            <div className={[
                                                "w-4 h-4 rounded flex items-center justify-center border-2 transition-all",
                                                isSelected
                                                    ? "bg-white border-white"
                                                    : "border-neutral-300 group-hover:border-primary/40"
                                            ].join(" ")}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="flex-1 truncate">{j.nom}</span>
                                            {isSelected && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="px-3 py-2 bg-neutral-50 rounded-b-xl border-t border-neutral-200">
                                <p className="text-[10px] text-neutral-500 text-center">
                                    {selectedGbs.length} / {joueuses.length} sélectionnée{selectedGbs.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Carte centrale */}
                        {/* Carte centrale */}
                        <div className="flex-1 flex flex-col min-h-[400px] lg:max-w-[900px] lg:max-h-[500px]">
                            {selectedGbs.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-neutral-500 text-sm mb-2">Aucune gardienne sélectionnée</p>
                                        <p className="text-neutral-400 text-xs">Sélectionnez au moins une gardienne pour voir les stats</p>
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="mt-3 text-sm text-neutral-600">Chargement...</p>
                                </div>
                            ) : error || !stats ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-red-500 text-sm">{error ?? "Aucune donnée"}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 px-3 py-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                                        <h1 className="text-center text-sm sm:text-base font-semibold text-primary">
                                            {selectedGbs.length === 1
                                                ? `${stats.joueuse}`
                                                : `${selectedGbs.length} gardiennes`}
                                        </h1>
                                    </div>
                                    <div className="flex-1 relative">
                                        {carteTirsData && <CarteTirs datas={carteTirsData} appui={appui} showData={true} arret={true} />}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                    {/* Tableaux en dessous */}
                    {stats && (
                        <div className="mt-6 space-y-4">
                            <GbTable stats={stats} />
                            <GardienneSecteursTable stats={stats} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
