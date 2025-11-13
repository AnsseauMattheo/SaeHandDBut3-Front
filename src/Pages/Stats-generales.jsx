import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import GrandEspace from "@/components/Grand-espace.jsx";
import StatsTable from "@/components/StatsTable";

export default function StatsGenerales() {
    const { matchId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/stats/match/${matchId}/grandespace`, { credentials: "include" })
            .then(r => r.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [matchId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
            </div>
        );
    }
    if (!data) return <div className="text-sm text-gray-500">Aucune donnée disponible.</div>;

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Statistiques générales — Match {matchId}</h1>

            {/* Graphes Grand Espace (tu passes les données en prop) */}
            <GrandEspace data={data} />

            {/* Tableau Attaque */}
            {data.attaque && <StatsTable title="Attaque" data={data.attaque} showAttendusSaison colorHeader={"bg-blue-50"}/>}

            {/* Tableau Grand Espace */}
            {data.grandEspace && <StatsTable title="Grand Espace" data={data.grandEspace} showAttendusSaison colorHeader={"bg-green-50"}/>}

            {/* Tableau Repli */}
            {data.repli && <StatsTable title="Repli" data={data.repli} showAttendusSaison colorHeader={"bg-purple-50"}/>}

            {/* Tableau Défense */}
            {data.defense && <StatsTable title="Défense" data={data.defense} showAttendusSaison colorHeader={"bg-red-50"}/>}
        </div>
    );
}
