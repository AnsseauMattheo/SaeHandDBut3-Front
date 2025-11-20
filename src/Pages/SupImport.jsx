import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/context/AlertProvider.jsx";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';

const SupImport = () => {
    const { addSuccess, addError } = useAlerts();
    const [matchsParSaison, setMatchsParSaison] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    useEffect(() => {
        // Appel de la nouvelle route backend qui retourne les matchs groupés par saison
        axios.get(`${import.meta.env.VITE_SERVER_URL}/match/getMatchParSaisons`, {
            withCredentials: true
        }).then((res) => {
            console.log("Matchs par saison:", res.data);
            setMatchsParSaison(res.data);
        }).catch(err => {
            console.error("Erreur lors du chargement des matchs:", err);
            addError("Erreur lors du chargement des matchs");
        });
    }, []);

    const confirmDelete = (match, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedMatch(match);
        setOpenModal(true);
    };

    const handleDelete = () => {
        if (!selectedMatch) return;
        axios
            .post(`${import.meta.env.VITE_SERVER_URL}/match/deleteMatch?id=${selectedMatch.mid}`, {}, {
                withCredentials: true
            })
            .then(() => {
                addSuccess("Match supprimé avec succès");

                // Mettre à jour l'état local en supprimant le match
                const updatedMatchs = { ...matchsParSaison };
                Object.keys(updatedMatchs).forEach(saison => {
                    updatedMatchs[saison] = updatedMatchs[saison].filter(
                        m => m.mid !== selectedMatch.mid
                    );
                    // Supprimer la saison si elle est vide
                    if (updatedMatchs[saison].length === 0) {
                        delete updatedMatchs[saison];
                    }
                });
                setMatchsParSaison(updatedMatchs);
            })
            .catch((err) => {
                console.error(err);
                addError("Erreur lors de la suppression");
            })
            .finally(() => {
                setOpenModal(false);
                setSelectedMatch(null);
            });
    };

    // Calculer le nombre total de matchs
    const totalMatches = Object.values(matchsParSaison).reduce(
        (acc, matches) => acc + matches.length,
        0
    );

    return (
        <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                        Matchs importés
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalMatches} match{totalMatches > 1 ? 's' : ''} au total
                    </p>
                </div>

                {totalMatches > 0 ? (
                    <Accordion
                        type="multiple"
                        className="w-full space-y-3"
                        defaultValue={Object.keys(matchsParSaison)[0] ? [Object.keys(matchsParSaison)[0]] : []}
                    >
                        {Object.keys(matchsParSaison).map((saison, index) => (
                            <AccordionItem
                                value={saison}
                                key={index}
                                className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold hover:no-underline">
                                    <div className="flex items-center justify-between w-full pr-2">
                                        <span className="text-gray-900">Saison {saison}</span>
                                        <span className="text-xs sm:text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {matchsParSaison[saison].length} match{matchsParSaison[saison].length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 sm:px-6 pb-4 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                        {matchsParSaison[saison].map((match) => (
                                            <Link
                                                key={match.mid}
                                                to={`/dashboard/match/${match.mid}/statistiques`}
                                                className={`relative bg-white rounded-xl shadow-sm border-2 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 block group ${
                                                    match.win ? "border-green-400 hover:border-green-500" : "border-red-400 hover:border-red-500"
                                                }`}
                                            >
                                                {/* Bouton supprimer en haut à droite */}
                                                <button
                                                    onClick={(e) => confirmDelete(match, e)}
                                                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors z-10 opacity-0 group-hover:opacity-100"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>

                                                {/* En-tête avec le titre et la date */}
                                                <div className="text-center mb-3 sm:mb-4">
                                                    <p className="text-xs text-gray-500 mb-1 truncate px-6">
                                                        {match.nomImport}
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                                                        {new Date(match.date).toLocaleDateString("fr-FR", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Score du match */}
                                                <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 py-3 sm:py-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm sm:text-base font-bold text-gray-800 text-center">
                                                            SAHB
                                                        </span>
                                                        <span className="mt-1 sm:mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
                                                            {match.butsMis}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-center text-xl sm:text-2xl font-light text-gray-300">
                                                        -
                                                    </div>

                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm sm:text-base font-bold text-gray-800 text-center truncate max-w-full px-1">
                                                            {match.adversaire}
                                                        </span>
                                                        <span className="mt-1 sm:mt-2 text-xl sm:text-2xl font-extrabold text-gray-900">
                                                            {match.butsEncaisses}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Badge victoire/défaite */}
                                                <div className="text-center mt-3 sm:mt-4">
                                                    {match.win ? (
                                                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                            Victoire
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                                            Défaite
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="max-w-md mx-auto">
                            <p className="text-gray-500 text-lg mb-2">Aucun match disponible</p>
                            <p className="text-gray-400 text-sm">Importez un fichier pour commencer</p>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMATION */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            <span className="font-semibold">{selectedMatch?.nomImport}</span> ?
                            <br />
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SupImport;
