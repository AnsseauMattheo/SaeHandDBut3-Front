import {useEffect, useState, useMemo} from "react";
import {useParams} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import {TrendingUp, AlertTriangle, Award, Flame, Filter} from "lucide-react";

export default function AnalyseDefensive() {
    const {matchId} = useParams();
    const [data, setData] = useState([]);
    const [selectedJoueuse, setSelectedJoueuse] = useState(null);
    const [sortCol, setSortCol] = useState("pourcentage");
    const [sortDir, setSortDir] = useState("desc");
    const [filterEff, setFilterEff] = useState(null);

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_SERVER_URL}/stats/match/${matchId}/defensives-joueuses`,
            {credentials: "include"}
        )
            .then((r) => r.json())
            .then(setData);
    }, [matchId]);

    const filtered = useMemo(() => {
        let result = [...data];
        if (filterEff === "high") result = result.filter((j) => j.pourcentage >= 70);
        if (filterEff === "mid") {
            result = result.filter(
                (j) => j.pourcentage >= 50 && j.pourcentage < 70
            );
        }
        if (filterEff === "low") result = result.filter((j) => j.pourcentage < 50);

        return result.sort((a, b) => {
            const aVal = a[sortCol] ?? 0;
            const bVal = b[sortCol] ?? 0;
            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [data, sortCol, sortDir, filterEff]);

    const globalTypesData = useMemo(() => {
        if (!data.length) return [];

        const plusFields = [
            {key: "minvPlus", label: "M inv +"},
            {key: "contre", label: "contre"},
            {key: "duelGagne", label: "duel gagné"},
            {key: "contournementPvt", label: "contournement pvt"},
            {key: "entraidePlus", label: "entraide +"},
            {key: "recupPlus", label: "recup +"},
            {key: "enchTachesEtRep", label: "Ench taches et rep +"},
            {key: "repliPlus", label: "repli +"},
            {key: "pfProvoQue", label: "PF provoqué"},
            {key: "autresPlus", label: "Autres (D+)"},
        ];

        const moinsFields = [
            {key: "minvMoins", label: "M inv -"},
            {key: "duelPerdu", label: "duel perdu"},
            {key: "pbGestionPvt", label: "Pb gestion pvt"},
            {key: "repartiMoins", label: "repartition -"},
            {key: "pasEntraide", label: "pas d'entraide"},
            {key: "sanctionN2OuR", label: "Sanction 2 ou R"},
            {key: "surentraide", label: "Surentraide"},
            {key: "repliMoins", label: "Repli -"},
            {key: "recupMoins", label: "Recup -"},
            {key: "interceptionManque", label: "Interception manqué"},
            {key: "autresMoins", label: "Autres (D-)"},
            {key: "sortPasCourseInt", label: "Sort pas course int"},
        ];

        const sumField = (fieldKey) =>
            data.reduce((sum, j) => sum + (j[fieldKey] ?? 0), 0);

        const totalDplus = data.reduce((s, j) => s + (j.dplus ?? 0), 0);
        const totalDmoins = data.reduce((s, j) => s + (j.dmoins ?? 0), 0);
        const totalPlus = totalDplus || 1;
        const totalMoins = totalDmoins || 1;

        const plusRows = plusFields.map(({key, label}) => {
            const count = sumField(key);
            const rawPct = (count / totalPlus) * 100;
            return {
                label,
                count,
                value: Math.round(rawPct * 10) / 10,
                groupe: "D+",
            };
        });

        const moinsRows = moinsFields.map(({key, label}) => {
            const count = sumField(key);
            const rawPct = (count / totalMoins) * 100;
            return {
                label,
                count,
                value: Math.round(rawPct * 10) / 10, // arrondi à 1 décimale
                groupe: "D-",
            };
        });

        return [...plusRows, ...moinsRows];
    }, [data]);


    const stats = useMemo(() => {
        if (!data.length)
            return {totalDP: 0, totalDM: 0, moyEff: 0, top: [], faibles: []};

        const valid = data.filter((j) => j.nom && j.nom.trim() !== "");

        const totalDP = valid.reduce((s, j) => s + (j.dplus ?? 0), 0);
        const totalDM = valid.reduce((s, j) => s + (j.dmoins ?? 0), 0);
        const denom = totalDP + totalDM;
        const moyEff = denom > 0 ? (totalDP / denom) * 100 : 0;

        const top = [...valid]
            .sort((a, b) => b.pourcentage - a.pourcentage)
            .slice(0, 5);
        const faibles = valid.filter((j) => j.pourcentage < 40);

        return {totalDP, totalDM, moyEff, top, faibles};
    }, [data]);

    const scatterData = useMemo(
        () =>
            data.map((j) => ({
                nom: j.nom,
                x: j.dplus ?? 0,
                y: j.pourcentage ?? 0,
                z: (j.dplus ?? 0) + (j.dmoins ?? 0),
            })),
        [data]
    );

    const radarData = useMemo(() => {
        if (!selectedJoueuse || !data.length) return [];

        const maxDP = Math.max(...data.map((x) => x.dplus ?? 0));
        const maxMInv = Math.max(...data.map((x) => x.minvPlus ?? 0));
        const maxContre = Math.max(...data.map((x) => x.contre ?? 0));
        const maxDuel = Math.max(...data.map((x) => x.duelGagne ?? 0));
        const maxRepli = Math.max(...data.map((x) => x.repliPlus ?? 0));

        const j = selectedJoueuse;

        const norm = (val, max) => {
            const v = val ?? 0;
            const m = max || 1;
            return (v / m) * 100;
        };

        return [
            {metric: "D+", value: norm(j.dplus, maxDP)},
            {
                metric: "Efficacité",
                value: Math.max(0, Math.min(100, j.pourcentage ?? 0)),
            },
            {metric: "M inv+", value: norm(j.minvPlus, maxMInv)},
            {metric: "Contre", value: norm(j.contre, maxContre)},
            {metric: "Duel gagné", value: norm(j.duelGagne, maxDuel)},
            {metric: "Repli+", value: norm(j.repliPlus, maxRepli)},
        ];
    }, [selectedJoueuse, data]);

    const barStackData = useMemo(
        () =>
            data
                .map((j) => ({
                    nom: j.nom.split(" ")[0],
                    mInv: j.minvPlus ?? 0,
                    contre: j.contre ?? 0,
                    duel: j.duelGagne ?? 0,
                    ench: j.enchTachesEtRep ?? 0,
                    repli: j.repliPlus ?? 0,
                }))
                .slice(0, 10),
        [data]
    );


    const handleSort = (col) => {
        if (sortCol === col) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir("desc");
        }
    };

    const getEffColor = (eff) => {
        if (eff >= 70) return "bg-emerald-50 text-emerald-700";
        if (eff >= 50) return "bg-amber-50 text-amber-700";
        return "bg-red-50 text-red-400";
    };

    const handleRowClick = (j) => {
        setSelectedJoueuse(j);
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-6xl mx-auto p-4 space-y-6">


                {/* Résumé Équipe */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs uppercase tracking-wide text-neutral-500">
                                Total D+
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-emerald-600">
                                {stats.totalDP}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1">
                                Interventions positives
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs uppercase tracking-wide text-neutral-500">
                                Total D-
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-red-400">
                                {stats.totalDM}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1">
                                Interventions négatives
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs uppercase tracking-wide text-neutral-500">
                                Efficacité moyenne
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-primary">
                                {stats.moyEff?.toFixed(0)}%
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1">
                                D+ / (D+ + D-)
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Scatter */}
                    <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-primary">
                                D+ vs efficacité
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <ScatterChart
                                    margin={{auto: 0, top: 10, right: 10, bottom: 10}}
                                >
                                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3"/>
                                    <XAxis
                                        type="number"
                                        dataKey="x"
                                        name="D+"
                                        stroke="#6b7280"
                                        tick={{fill: "#6b7280", fontSize: 11}}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        name="Efficacité %"
                                        domain={[0, 100]}
                                        stroke="#6b7280"
                                        tick={{fill: "#6b7280", fontSize: 11}}
                                    />
                                    <ZAxis type="number" dataKey="z" range={[60, 260]}/>
                                    <Tooltip
                                        cursor={{strokeDasharray: "3 3", stroke: "#9ca3af"}}
                                        content={({payload}) => {
                                            if (!payload?.[0]) return null;
                                            const p = payload[0].payload;
                                            return (
                                                <div
                                                    className="bg-white border border-neutral-200 rounded px-3 py-2 text-[11px] text-neutral-900 shadow">
                                                    <p className="font-semibold text-primary">{p.nom}</p>
                                                    <p>D+ : {p.x}</p>
                                                    <p>Efficacité : {p.y}%</p>
                                                </div>
                                            );
                                        }}
                                    />
                                    <ReferenceLine
                                        x={data.length ? stats.totalDP / data.length : 0}
                                        stroke="#9ca3af"
                                        strokeDasharray="3 3"
                                        label={{
                                            value: "Moy D+",
                                            fill: "#6b7280",
                                            fontSize: 10,
                                        }}
                                    />
                                    <ReferenceLine
                                        y={stats.moyEff}
                                        stroke="#9ca3af"
                                        strokeDasharray="3 3"
                                        label={{
                                            value: "Moy Eff",
                                            fill: "#6b7280",
                                            fontSize: 10,
                                        }}
                                    />
                                    <Scatter data={scatterData} fill="rgb(37 99 235)"/>{/* primary-600 par ex */}
                                </ScatterChart>
                            </ResponsiveContainer>
                            <div className="text-[11px] text-neutral-500 mt-2 space-y-1">
                                <p>Haut-droite : volume + efficacité</p>
                                <p>Haut-gauche : efficaces mais peu sollicitées</p>
                                <p>Bas-droite : fort volume mais faible efficacité</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base text-primary">
                                Répartition globale par type d&apos;action
                            </CardTitle>
                            <p className="text-xs text-neutral-500 mt-1">
                                Pourcentage de chaque type d&apos;action sur l&apos;ensemble des D+ / D-
                            </p>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={380}>
                                <BarChart
                                    data={globalTypesData}
                                    layout="horizontal" // horizontal = barres verticales
                                    margin={{auto: 10, top: 10, right: 10, bottom: 10}}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                                    {/* X = catégories */}
                                    <XAxis
                                        type="category"
                                        dataKey="label"
                                        tick={{fill: "#6b7280", fontSize: 10}}
                                        angle={-35}
                                        textAnchor="end"
                                        height={80}
                                        interval={0} // force l’affichage de tous les labels
                                    />
                                    {/* Y = pourcentage */}
                                    <YAxis
                                        type="number"
                                        domain={[0, "auto"]}
                                        tickFormatter={(v) => `${v}%`}
                                        tick={{fill: "#6b7280", fontSize: 11}}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, "Part"]}
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            borderColor: "#e5e7eb",
                                            fontSize: 11,
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="rgb(37 99 235)" // primary-600
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>


                </div>


                {/* Tableau + filtres */}
                <Card className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-primary">
                                Tableau
                            </CardTitle>
                            <button
                                onClick={() => setFilterEff(null)}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                Réinitialiser filtres
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span className="flex items-center gap-1 text-neutral-500">
                <Filter className="w-3 h-3"/>
                Filtre efficacité
              </span>
                            <button
                                onClick={() => setFilterEff("high")}
                                className={`px-3 py-1 rounded-full ${
                                    filterEff === "high"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-neutral-100 text-neutral-800"
                                }`}
                            >
                                Eff ≥70%
                            </button>
                            <button
                                onClick={() => setFilterEff("mid")}
                                className={`px-3 py-1 rounded-full ${
                                    filterEff === "mid"
                                        ? "bg-amber-500 text-white"
                                        : "bg-neutral-100 text-neutral-800"
                                }`}
                            >
                                Eff 50–70%
                            </button>
                            <button
                                onClick={() => setFilterEff("low")}
                                className={`px-3 py-1 rounded-full ${
                                    filterEff === "low"
                                        ? "bg-red-400 text-white"
                                        : "bg-neutral-100 text-neutral-800"
                                }`}
                            >
                                Eff &lt;50%
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                            <thead className="bg-neutral-100 text-neutral-700">
                            <tr>
                                <th
                                    className="text-left p-2 cursor-pointer hover:bg-neutral-200"
                                    onClick={() => handleSort("nom")}
                                >
                                    Joueuse ⇅
                                </th>
                                <th
                                    className="text-center p-2 cursor-pointer hover:bg-neutral-200"
                                    onClick={() => handleSort("dplus")}
                                >
                                    D+ ⇅
                                </th>
                                <th
                                    className="text-center p-2 cursor-pointer hover:bg-neutral-200"
                                    onClick={() => handleSort("dmoins")}
                                >
                                    D- ⇅
                                </th>
                                <th
                                    className="text-center p-2 cursor-pointer hover:bg-neutral-200"
                                    onClick={() => handleSort("pourcentage")}
                                >
                                    Eff % ⇅
                                </th>
                                <th className="text-center p-2">Répartition D+/D-</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((j, i) => {
                                const total = (j.dplus ?? 0) + (j.dmoins ?? 0);
                                const pctDP = total > 0 ? ((j.dplus ?? 0) / total) * 100 : 0;
                                const isLow = (j.pourcentage ?? 0) < 40;

                                return (
                                    <tr
                                        key={i}
                                        onClick={() => handleRowClick(j)}
                                        className={[
                                            "border-b border-neutral-200 cursor-pointer",
                                            isLow ? "" : "hover:bg-neutral-50",
                                            selectedJoueuse && selectedJoueuse.nom === j.nom
                                                ? "ring-1 ring-primary/40 bg-primary/5"
                                                : "",
                                        ].join(" ")}
                                    >
                                        <td className="p-2 font-medium">
                                            {j.nom}
                                        </td>
                                        <td className="text-center p-2 text-emerald-700 font-semibold">
                                            {j.dplus}
                                        </td>
                                        <td className="text-center p-2 text-red-400 font-semibold">
                                            {j.dmoins}
                                        </td>
                                        <td className="text-center p-2">
          <span
              className={`px-2 py-1 rounded-full text-[11px] font-semibold ${getEffColor(
                  j.pourcentage
              )}`}
          >
            {j.pourcentage?.toFixed(0)}%
          </span>
                                        </td>
                                        <td className="p-2">
                                            <div className="flex items-center justify-center">
                                                <div className="w-24 h-3 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500"
                                                        style={{width: `${pctDP}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>

                        </table>
                    </CardContent>
                </Card>

                {/* Graphiques */}


                {/* Radar joueuse sélectionnée */}
                {selectedJoueuse && (
                    <Card className="bg-white border border-primary/30 rounded-xl shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                    Profil de {selectedJoueuse.nom}
                                </CardTitle>
                                <button
                                    className="text-sm text-neutral-500 hover:underline"
                                    onClick={() => setSelectedJoueuse(null)}
                                >
                                    ✕ Fermer
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="#e5e7eb"/>
                                        <PolarAngleAxis
                                            dataKey="metric"
                                            tick={{fill: "#4b5563", fontSize: 11}}
                                        />
                                        <PolarRadiusAxis
                                            domain={[0, 100]}
                                            tick={{fill: "#9ca3af", fontSize: 10}}
                                            stroke="#d1d5db"
                                        />
                                        <Radar
                                            name={selectedJoueuse.nom}
                                            dataKey="value"
                                            stroke="rgb(37 99 235)"   // primary‑600
                                            fill="rgb(37 99 235)"
                                            fillOpacity={0.25}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 text-sm">
                                    <h3 className="font-semibold text-base mb-3 text-primary">
                                        Statistiques détaillées
                                    </h3>
                                    <p>
                                        <strong>D+ :</strong> {selectedJoueuse.dplus} |{" "}
                                        <strong>D- :</strong> {selectedJoueuse.dmoins}
                                    </p>
                                    <p>
                                        <strong>Efficacité :</strong>{" "}
                                        <span className="text-lg font-bold text-primary">
                      {selectedJoueuse.pourcentage?.toFixed(0)}%
                    </span>
                                    </p>
                                    <hr className="my-2 border-neutral-200"/>
                                    <p>
                                        <strong>M inv+ :</strong> {selectedJoueuse.minvPlus} |{" "}
                                        <strong>Contre :</strong> {selectedJoueuse.contre}
                                    </p>
                                    <p>
                                        <strong>Duel gagné :</strong>{" "}
                                        {selectedJoueuse.duelGagne} | <strong>Repli+ :</strong>{" "}
                                        {selectedJoueuse.repliPlus}
                                    </p>
                                    <p>
                                        <strong>Ench taches :</strong>{" "}
                                        {selectedJoueuse.enchTachesEtRep}
                                    </p>
                                    <hr className="my-2 border-neutral-200"/>
                                    <p className="text-red-400">
                                        <strong>M inv- :</strong> {selectedJoueuse.minvMoins} |{" "}
                                        <strong>Duel perdu :</strong>{" "}
                                        {selectedJoueuse.duelPerdu}
                                    </p>
                                    <p className="text-red-400">
                                        <strong>Pb gesti :</strong>{" "}
                                        {selectedJoueuse.pbGestionPvt} |{" "}
                                        <strong>Repli- :</strong> {selectedJoueuse.repliMoins}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
