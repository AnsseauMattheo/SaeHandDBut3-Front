import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props:
 * - title: titre de la section (ex: "Attaque", "Grand Espace")
 * - data: array de lignes (chacune avec type, but, s7mSanctions, arret, etc.)
 * - showAttendusSaison: boolean (affiche ou non la colonne "Attendus")
 */
export default function StatsTable({ title, data, showAttendusSaison = true, colorHeader = "bg-blue-50" }) {
    if (!data || data.length === 0) return null;

    const hasTotal = data.some(row => row.type?.toLowerCase().includes("total"));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-s border-collapse">
                    <thead>
                    <tr className={`border-b ${colorHeader}`}>
                        <th className="text-left py-2 px-2 font-semibold min-w-[120px]">Type</th>
                        <th className="text-center px-2">But</th>
                        <th className="text-center px-2">7m</th>
                        <th className="text-center px-2">Arrêt</th>
                        <th className="text-center px-2">HC</th>
                        <th className="text-center px-2">PdeB</th>
                        <th className="text-center px-2">Tir Raté NC</th>
                        <th className="text-center px-2">Arrêt NC</th>
                        <th className="text-center px-2">Neut contre</th>
                        <th className="text-center px-2">Efficacité</th>
                        {showAttendusSaison && <th className="text-center px-2">Attendus</th>}
                        <th className="text-center px-2">Ballons</th>
                        <th className="text-center px-2">%</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, i) => {
                        const isTotal = row.type?.toLowerCase().includes("total");
                        return (
                            <tr
                                key={i}
                                className={`border-b hover:bg-gray-50 ${isTotal ? "bg-blue-50 font-semibold" : ""}`}
                            >
                                <td className="py-2 px-2 min-w-[120px]">{row.type}</td>
                                <td className="text-center px-2">{row.but ?? 0}</td>
                                <td className="text-center px-2">{row.s7mSanctions ?? 0}</td>
                                <td className="text-center px-2">{row.arret ?? 0}</td>
                                <td className="text-center px-2">{row.hc ?? 0}</td>
                                <td className="text-center px-2">{row.pdb ?? 0}</td>
                                <td className="text-center px-2">{row.tirRateNC ?? 0}</td>
                                <td className="text-center px-2">{row.arretNC ?? 0}</td>
                                <td className="text-center px-2">{row.neutContre ?? 0}</td>
                                <td className="text-center px-2 font-semibold text-blue-600">
                                    {row.efficacite != null ? `${row.efficacite.toFixed(1)}%` : "-"}
                                </td>
                                {showAttendusSaison && (
                                    <td className="text-center px-2">{row.attendusSaison ?? "-"}</td>
                                )}
                                <td className="text-center px-2">{row.nbBallonsResultat ?? 0}</td>
                                <td className="text-center px-2">{row.pctPhasesGlobales?.toFixed(1) ?? 0}%</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
