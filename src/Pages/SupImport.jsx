import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/context/AlertProvider.jsx";
import { Trash2, BarChart3 } from "lucide-react";

// Import des composants Dialog de shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";


const SupImport = () => {
  const { addSuccess, addError } = useAlerts();
  const [matchs, setMatchs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/match/getAll`).then((res) => {
      setMatchs(res.data);
    });
  }, []);

  const confirmDelete = (match) => {
    setSelectedMatch(match);
    setOpenModal(true);
  };

  const handleDelete = () => {
    if (!selectedMatch) return;
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/match/deleteMatch?id=${selectedMatch.mid}`)
      .then(() => {
        addSuccess("Match supprimé avec succès");
        setMatchs((prev) => prev.filter((m) => m.mid !== selectedMatch.mid));
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

  return (
    <div className="flex-1 w-full overflow-y-auto p-4">
      {matchs && matchs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Nom de l'import</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Adversaire</th>
                <th className="px-4 py-2">Victoire</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matchs.map((match) => (
                <tr
                  key={match.mid}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{match.nomImport}</td>
                  <td className="px-4 py-2">
                    {new Date(match.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{match.adversaire}</td>
                  <td className="px-4 py-2">
                    {match.win ? (
                      <span className="text-green-600 font-semibold">Oui</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                      <Link
                          to={`/dashboard/match/${match.mid}/statistiques`}
                          className="inline-flex items-center px-2 py-1 rounded text-primary hover:bg-primary/10 transition"
                          title="Voir la page stats enclenchements"
                      >
                          <BarChart3 size={18} className="mr-1" />
                          Stats
                      </Link>
                    <button
                      onClick={() => confirmDelete(match)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Aucun match disponible.</p>
      )}

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
