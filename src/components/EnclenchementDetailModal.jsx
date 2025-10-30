import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2} from 'lucide-react';
import axios from 'axios';

export default function EnclenchementDetailModal({isOpen, onClose, enclenchement, type, joueuse, matchId}) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && enclenchement && type) {
            loadDetail();
        }
    }, [isOpen, enclenchement, type, joueuse, matchId]);

    const loadDetail = async () => {
        try {
            setLoading(true);
            const params = {
                enclenchement: enclenchement,
                type: type
            };

            if (joueuse) {
                params.joueuse = joueuse;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/enclenchements/match/${matchId}/detail`,
                {
                    params: params,
                    withCredentials: true
                }
            );
            setDetail(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des détails:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] !w-[80vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Détails: {enclenchement}
                        {type && <span className="text-sm text-gray-500 ml-2">({type})</span>}
                        {joueuse && <span className="text-sm text-blue-600 ml-2">- {joueuse}</span>}
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600"/>
                    </div>
                ) : detail ? (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <Card className="flex-1 min-w-[300px]">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Distribution des résultats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
                                        {Object.entries(detail.resultatDistribution || {})
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([resultat, count], index) => (
                                                <div
                                                    key={`resultat-${resultat}-${index}`}
                                                    className="p-2 bg-gray-50 rounded-lg text-center"
                                                >
                                                    <p className="text-xs text-gray-600 mb-1 truncate">{resultat}</p>
                                                    <p className="text-lg font-bold text-gray-800">{count}</p>
                                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-blue-600 h-1.5 rounded-full"
                                                            style={{
                                                                width: `${(count / detail.totalActions) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        {((count / detail.totalActions) * 100).toFixed(1)}%
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {detail.secteurDistribution && Object.keys(detail.secteurDistribution).length > 0 && (
                                <Card className="flex-1 min-w-[300px]">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Secteurs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
                                            {Object.entries(detail.secteurDistribution)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([secteur, count], index) => (
                                                    <div
                                                        key={`secteur-${secteur}-${index}`}
                                                        className="p-2 bg-green-50 rounded-lg text-center border border-green-200"
                                                    >
                                                        <p className="text-xs text-green-700 mb-1 font-medium truncate">
                                                            {secteur !== "" ? secteur : "?"}
                                                        </p>
                                                        <p className="text-lg font-bold text-green-800">{count}</p>
                                                        <div className="mt-1 w-full bg-green-200 rounded-full h-1.5">
                                                            <div
                                                                className="bg-green-600 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${(count / detail.totalActions) * 100}%`
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-green-600 mt-1">
                                                            {((count / detail.totalActions) * 100).toFixed(1)}%
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
