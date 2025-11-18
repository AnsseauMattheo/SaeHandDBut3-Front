import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Crosshair, BarChart2, Activity } from "lucide-react";

export default function StatistiquesMatchMain() {
    const { matchId } = useParams();

    const sections = [
        {
            id: "generales",
            title: "Statistiques générales",
            description: "Utilisation du ballon, efficacité par phase de jeu...",
            icon: Shield,
            to: `generales`,
        },
        {
            id: "defense",
            title: "Analyse défensive",
            description: "D+, D-, efficacité, profils joueuses et types d'intervention.",
            icon: Shield,
            to: `analyse-defensive`,
        },
        {
            id: "enclenchements",
            title: "Enclenchements",
            description: "Volume, réussite par enclenchement, par joueuse et par type.",
            icon: BarChart2,
            to: `enclenchements`,
        },
        {
            id: "gardiens",
            title: "Analyse gardien de but",
            description: "Arrêts, zones de tir, efficacité sur chaque secteur.",
            icon: Activity,
            to: `analyse-gb`,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <header className="flex flex-col gap-1 border-b border-neutral-200 pb-3 mb-2">
                <h1 className="text-2xl font-semibold text-primary">
                    Statistiques match {matchId}
                </h1>
                <p className="text-sm text-neutral-500">
                    Choisir la vue pour analyser le match en détail.
                </p>
            </header>

            {/* Grid de cartes de navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sections.map((s) => {
                    const Icon = s.icon;
                    return (
                        <Link key={s.id} to={s.to} className="group">
                            <Card className="h-full bg-white border border-neutral-200 rounded-xl shadow-sm transition-transform transition-shadow group-hover:-translate-y-0.5 group-hover:shadow-md">
                                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-sm font-semibold text-neutral-900">
                                        {s.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-neutral-500">
                                        {s.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
