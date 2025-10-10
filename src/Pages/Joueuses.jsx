import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

export default function Joueuses() {
  const [joueuses, setJoueuses] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJoueuse, setSelectedJoueuse] = useState(null);
  const [selectedAffectation, setSelectedAffectation] = useState('');

  useEffect(() => {
    console.log(selectedAffectation);
  }, [selectedAffectation]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/getJoueuses`, {
      withCredentials: true
    })
      .then(response => {
        setJoueuses(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des joueuses :", error);
      });

    // Récupération des affectations
    axios.get(`${import.meta.env.VITE_SERVER_URL}/affectations/getAffectations`, {
      withCredentials: true
    })
      .then(response => {
        setAffectations(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des affectations :", error);
      });
  }, []);

  const handleEdit = (joueuse) => {
    setSelectedJoueuse(joueuse);
    setSelectedAffectation(joueuse.affectation?.id?.toString() || '');
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedJoueuse || !selectedAffectation) return;

    // Mettre à jour localement
    const updatedJoueuses = joueuses.map(j => 
      j.id === selectedJoueuse.id 
        ? { 
            ...j, 
            affectation: affectations.find(a => a.id.toString() === selectedAffectation) 
          }
        : j
    );
    setJoueuses(updatedJoueuses);

    axios.put(`${import.meta.env.VITE_SERVER_URL}/joueuses/${selectedJoueuse.id}/affectation`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
        affectationId: parseInt(selectedAffectation)
      
    })
      .then(() => {
        console.log('Affectation mise à jour avec succès');
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour :", error);
      });

    setIsDialogOpen(false);
    setSelectedJoueuse(null);
    setSelectedAffectation('');
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Liste des Joueuses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {joueuses.length > 0 ? (
              joueuses.map((joueuse) => (
                <div
                  key={joueuse.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(joueuse)}
                      className="shrink-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <span className="font-semibold text-lg">{joueuse.nom}</span>
                    </div>
                    <div className="min-w-[120px] text-right">
                      {joueuse.affectation ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {joueuse.affectation.affectation}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Non affectée</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune joueuse trouvée.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'affectation</DialogTitle>
            <DialogDescription>
              Choisissez une affectation pour {selectedJoueuse?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAffectation} onValueChange={setSelectedAffectation}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une affectation" />
              </SelectTrigger>
              <SelectContent>
                {affectations.map((affectation) => (
                  <SelectItem key={affectation.id} value={affectation.id.toString()}>
                    {affectation.affectation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}