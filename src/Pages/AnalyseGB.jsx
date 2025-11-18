// Pages/AnalyseGB.jsx
import { useEffect, useState, useMemo, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CarteTirs from "@/components/CarteTirs";

// -------------------------------------------------------------------
// Fonction de calcul du tableau GB (selon Excel)
// -------------------------------------------------------------------
function computeGbTable(stats) {
    const rows = [];

    stats.secteurs.forEach((s) => {
        const cat = s.categorie || "";

        // GB : Tirs cadrés = Arrêts + Buts
        const tirsCadres = s.arrets + s.buts;
        const pctArret = tirsCadres > 0 ? (s.arrets / tirsCadres) * 100 : 0;

        // Tireuse : Tirs totaux = Buts + Arrêts + HC
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

    // Totaux champ
    const champArrets = stats.totalChampArrets;
    const champButs = stats.totalChampButs;
    const champTirsCadres = champArrets + champButs;
    const champTirsTotaux = champButs + champArrets + stats.totalChampHc;

    const champPctArret =
        champTirsCadres > 0 ? (champArrets / champTirsCadres) * 100 : 0;
    const champPctTireuse =
        champTirsTotaux > 0 ? (champButs / champTirsTotaux) * 100 : 0;

    // Totaux avec 7m
    const a7Arrets = stats.totalAvec7mArrets;
    const a7Buts = stats.totalAvec7mButs;
    const a7TirsCadres = a7Arrets + a7Buts;
    const a7TirsTotaux = a7Buts + a7Arrets + stats.totalAvec7mHc;

    const a7PctArret = a7TirsCadres > 0 ? (a7Arrets / a7TirsCadres) * 100 : 0;
    const a7PctTireuse = a7TirsTotaux > 0 ? (a7Buts / a7TirsTotaux) * 100 : 0;

    const totals = {
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
    };

    return { rows, totals };
}

// -------------------------------------------------------------------
// Transformation des données pour CarteTirs (point de vue gardienne)
// -------------------------------------------------------------------
function formatDataForCarteTirs(stats) {
    const tirs = stats.secteurs.map((s) => ({
        secteur: s.secteur,
        tirsTotal: s.buts + s.arrets, // tirs cadrés
        tirsReussi: s.arrets, // arrêts réussis
    }));

    return [{ tirs }];
}

// -------------------------------------------------------------------
// Tableau 1 : Secteurs bruts (BUTS / Arrêts / HC / Arrêts NC)
// -------------------------------------------------------------------
function GardienneSecteursTable({ stats }) {
    const { secteurs } = stats;

    const grouped = secteurs.reduce((acc, s) => {
        const cat = s.categorie || "Autres";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
    }, {});

    const totalChampTirs =
        stats.totalChampButs +
        stats.totalChampArrets +
        stats.totalChampHc +
        stats.totalChampArretNc;

    const totalAvec7mTirs =
        stats.totalAvec7mButs +
        stats.totalAvec7mArrets +
        stats.totalAvec7mHc +
        stats.totalAvec7mArretNc;

    return (
        <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base text-primary">
                    Secteurs · {stats.joueuse}
                </CardTitle>
                <p className="text-xs text-neutral-500">
                    Répartition des tirs par secteur · BUTS / Arrêts / HC / Arrêts NC
                </p>
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
                                <td className="p-2 font-semibold text-neutral-800" colSpan={7}>
                                    {categorie}
                                </td>
                            </tr>
                            {lignes.map((s) => {
                                const total = s.buts + s.arrets + s.hc + s.arretNc;
                                return (
                                    <tr
                                        key={s.secteur}
                                        className="border-b border-neutral-100 hover:bg-neutral-50"
                                    >
                                        <td className="p-2 text-neutral-500"></td>
                                        <td className="p-2 font-medium">{s.secteur}</td>
                                        <td className="text-center p-2 text-red-500 font-semibold">
                                            {s.buts}
                                        </td>
                                        <td className="text-center p-2 text-emerald-600 font-semibold">
                                            {s.arrets}
                                        </td>
                                        <td className="text-center p-2 text-neutral-500">
                                            {s.hc}
                                        </td>
                                        <td className="text-center p-2 text-orange-500">
                                            {s.arretNc}
                                        </td>
                                        <td className="text-center p-2 text-neutral-800">
                                            {total}
                                        </td>
                                    </tr>
                                );
                            })}
                        </Fragment>
                    ))}

                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>
                            TOTAL Champ
                        </td>
                        <td className="text-center p-2 text-red-500">
                            {stats.totalChampButs}
                        </td>
                        <td className="text-center p-2 text-emerald-600">
                            {stats.totalChampArrets}
                        </td>
                        <td className="text-center p-2 text-neutral-500">
                            {stats.totalChampHc}
                        </td>
                        <td className="text-center p-2 text-orange-500">
                            {stats.totalChampArretNc}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totalChampTirs}
                        </td>
                    </tr>

                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>
                            TOTAL avec 7m
                        </td>
                        <td className="text-center p-2 text-red-500">
                            {stats.totalAvec7mButs}
                        </td>
                        <td className="text-center p-2 text-emerald-600">
                            {stats.totalAvec7mArrets}
                        </td>
                        <td className="text-center p-2 text-neutral-500">
                            {stats.totalAvec7mHc}
                        </td>
                        <td className="text-center p-2 text-orange-500">
                            {stats.totalAvec7mArretNc}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totalAvec7mTirs}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

// -------------------------------------------------------------------
// Tableau 2 : GB (Pourcentage Arrêt & Tireuse)
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
                <CardTitle className="text-base text-primary">
                    GB – {stats.joueuse}
                </CardTitle>
                <p className="text-xs text-neutral-500">
                    Pourcentage arrêt gardienne et pourcentage tireuse par secteur
                </p>
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
                                    <td className="p-2 font-semibold text-neutral-800" colSpan={8}>
                                        {categorie}
                                    </td>
                                </tr>
                            )}
                            {lignes.map((r) => (
                                <tr
                                    key={`${categorie}-${r.secteur}`}
                                    className="border-b border-neutral-100 hover:bg-neutral-50"
                                >
                                    <td className="p-2 text-neutral-500"></td>
                                    <td className="p-2 font-medium">{r.secteur}</td>

                                    <td className="text-center p-2 text-emerald-600 font-semibold">
                                        {r.arrets}
                                    </td>
                                    <td className="text-center p-2 text-neutral-800">
                                        {r.tirsCadres}
                                    </td>
                                    <td className="text-center p-2 text-neutral-800">
                                        {r.pctArret}%
                                    </td>

                                    <td className="text-center p-2 text-red-500 font-semibold">
                                        {r.buts}
                                    </td>
                                    <td className="text-center p-2 text-neutral-800">
                                        {r.tirs}
                                    </td>
                                    <td className="text-center p-2 text-neutral-800">
                                        {r.pctTireuse}%
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ))}

                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>
                            TOTAL Champ
                        </td>
                        <td className="text-center p-2 text-emerald-600">
                            {totals.champ.arrets}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.champ.tirsCadres}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.champ.pctArret}%
                        </td>
                        <td className="text-center p-2 text-red-500">
                            {totals.champ.buts}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.champ.tirs}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.champ.pctTireuse}%
                        </td>
                    </tr>

                    <tr className="bg-neutral-100 font-semibold border-t border-neutral-300">
                        <td className="p-2" colSpan={2}>
                            TOTAL avec 7m
                        </td>
                        <td className="text-center p-2 text-emerald-600">
                            {totals.avec7m.arrets}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.avec7m.tirsCadres}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.avec7m.pctArret}%
                        </td>
                        <td className="text-center p-2 text-red-500">
                            {totals.avec7m.buts}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.avec7m.tirs}
                        </td>
                        <td className="text-center p-2 text-neutral-800">
                            {totals.avec7m.pctTireuse}%
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

// -------------------------------------------------------------------
// Page principale AnalyseGB
// -------------------------------------------------------------------
export default function AnalyseGB() {
    const { matchId } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const joueuse = "alix";

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/stats/gardiennes/match/${matchId}/joueuse/${joueuse}`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("Erreur API");
                const data = await res.json();
                setStats(data);
                setError(null);
            } catch (e) {
                console.error(e);
                setError("Erreur lors du chargement des stats gardienne");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [matchId, joueuse]);

    const carteTirsData = stats ? formatDataForCarteTirs(stats) : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm text-neutral-600">
                    Chargement des statistiques gardienne...
                </p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 text-sm mb-3">{error ?? "Aucune donnée"}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            <header className="flex flex-col gap-1 border-b border-neutral-200 pb-3 mb-1">
                <h1 className="text-2xl font-semibold text-primary">
                    Analyse gardienne - {stats.joueuse}
                </h1>
                <p className="text-sm text-neutral-500">
                    Tirs subis par secteur – match {stats.matchId}
                </p>
            </header>

            {/* Carte visuelle des arrêts */}
            {carteTirsData && (
                <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base text-primary">
                            Carte des arrêts - {stats.joueuse}
                        </CardTitle>
                        <p className="text-xs text-neutral-500">
                            Répartition visuelle des arrêts par secteur
                        </p>
                    </CardHeader>
                    <CardContent>
                        <CarteTirs
                            datas={carteTirsData}
                            appui={true}
                            showData={true}
                            arret={true}
                        />
                    </CardContent>
                </Card>
            )}
            {/* Tableau 2 : GB avec pourcentages */}
            <GbTable stats={stats} />

            {/* Tableau 1 : données brutes */}
            <GardienneSecteursTable stats={stats} />


        </div>
    );
}
