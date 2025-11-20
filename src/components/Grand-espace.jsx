import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

export default function GrandEspace({ data }) {
    const [mode, setMode] = useState("pct");

    const ge = data?.grandEspace ?? [];
    const repli = data?.repli ?? [];

    const repliMapLabel = (t) => {
        if (!t) return t;
        const s = t.toLowerCase();
        if (s.includes("transition")) return "Transition";
        if (s.includes("ca mb")) return "CA MB";
        if (s.includes("er")) return "ER";
        if (s.includes("but vide")) return "But vide";
        return `${t} (ADV)`;
    };

    const geData = useMemo(() => {
        if (!ge || ge.length === 0) return [];
        const total = ge.reduce((sum, x) => sum + (x.nbBallonsResultat ?? 0), 0);
        return ge.map(x => ({
            label: x.type,
            nb: x.nbBallonsResultat ?? 0,
            pct: total > 0 ? Math.round((x.nbBallonsResultat / total) * 10000) / 100 : 0,
        })).sort((a,b) => (mode === "pct" ? b.pct - a.pct : b.nb - a.nb));
    }, [ge, mode]);

    const advData = useMemo(() => {
        if (!repli || repli.length === 0) return [];
        const total = repli.reduce((sum, x) => sum + (x.nbBallonsResultat ?? 0), 0);
        return repli.map(x => ({
            label: repliMapLabel(x.type),
            nb: x.nbBallonsResultat ?? 0,
            pct: total > 0 ? Math.round((x.nbBallonsResultat / total) * 10000) / 100 : 0,
        })).sort((a,b) => (mode === "pct" ? b.pct - a.pct : b.nb - a.nb));
    }, [repli, mode]);

    const usePct = mode === "pct";

    const NumberBar = ({ title, color, dataset }) => (
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
            <CardContent className="pt-2">
                <div className="h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataset} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" angle={-20} textAnchor="end" interval={0} height={60}/>
                            <YAxis />
                            <Tooltip formatter={(v, n) => [`${v}`, n === "nb" ? "Ballons" : n]} cursor={false} />
                            <Legend />
                            <Bar dataKey="nb" name="Ballons" fill={color} radius={[4,4,0,0]}>
                                <LabelList dataKey="nb" position="top" className="text-xs" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );

    const PercentBar = ({ title, color, dataset }) => (
        <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
            <CardContent className="pt-2">
                <div className="h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataset} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" angle={-20} textAnchor="end" interval={0} height={60}/>
                            <YAxis tickFormatter={(v)=>`${v}%`} />
                            <Tooltip formatter={(v)=>`${v}%`} />
                            <Legend />
                            <Bar dataKey="pct" name="% phases" fill={color} radius={[4,4,0,0]}>
                                <LabelList dataKey="pct" formatter={(v)=>`${v}%`} position="top" className="text-xs" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Grand Espace</h2>
                <div className="flex items-center gap-2 text-sm">
                    <button className={`px-2 py-1 rounded ${!usePct ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setMode("nb")}>Ballons</button>
                    <button className={`px-2 py-1 rounded ${usePct ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setMode("pct")}>% Phases</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {usePct ? (
                    <>
                        <PercentBar title="Utilisation grand espace" color="#2563eb" dataset={geData.filter((x => !x.label?.toLowerCase().includes("total")))} />
                        <PercentBar title="Utilisation grand espace adversaire" color="#ef4444" dataset={advData.filter((x => !x.label?.toLowerCase().includes("total")))} />
                    </>
                ) : (
                    <>
                        <NumberBar title="Utilisation grand espace" color="#2563eb" dataset={geData.filter((x => !x.label?.toLowerCase().includes("total")))} />
                        <NumberBar title="Utilisation grand espace adversaire" color="#ef4444" dataset={advData.filter((x => !x.label?.toLowerCase().includes("total")))} />
                    </>
                )}
            </div>
        </div>
    );
}
