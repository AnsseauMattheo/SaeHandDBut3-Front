import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit2, Ellipsis, Pen, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx';
import axios from 'axios';

export default function Joueuses() {
  const [joueuses, setJoueuses] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJoueuse, setSelectedJoueuse] = useState(null);
  const [selectedAffectation, setSelectedAffectation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(selectedAffectation);
  }, [selectedAffectation]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/JoueusesParAffectation `, {
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

    if (!selectedJoueuse || !selectedAffectation) return;

    const nouvelleAffectation = affectations.find(a => a.id.toString() === selectedAffectation);
    if (!nouvelleAffectation) return;

    const updatedJoueuses = { ...joueuses };

    Object.keys(updatedJoueuses).forEach(affectName => {
      updatedJoueuses[affectName] = updatedJoueuses[affectName].filter(
        j => j.id !== selectedJoueuse.id
      );
    });

    const joueuseModifiee = {
      ...selectedJoueuse,
      affectation: nouvelleAffectation
    };

    if (updatedJoueuses[nouvelleAffectation.affectation]) {
      updatedJoueuses[nouvelleAffectation.affectation].push(joueuseModifiee);
    } else {
      updatedJoueuses[nouvelleAffectation.affectation] = [joueuseModifiee];
    }

    setJoueuses(updatedJoueuses);

    axios.put(`${import.meta.env.VITE_SERVER_URL}/joueuses/${selectedJoueuse.id}/affectation`, {
      affectationId: parseInt(selectedAffectation)
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
      .then(() => console.log('Affectation mise à jour avec succès'))
      .catch(error => console.error("Erreur lors de la mise à jour :", error));

    setIsDialogOpen(false);
    setSelectedJoueuse(null);
    setSelectedAffectation('');

    console.log(joueuses)

  };

  console.log(joueuses)
  return (
    <div className="container mx-auto p-6">
      <div className="p-2 sm:p-3 lg:p-4">
        <Accordion
          type="multiple"
          className="w-full"
        >
          {Object.keys(joueuses).map((key, index) => (
            <AccordionItem value={key} key={index}>
              <AccordionTrigger className="text-xs sm:text-sm">{key} ({joueuses[key]?.length})</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {joueuses[key].map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => navigate(`/dashboard/joueuse/${tag.id}`)}
                      className="relative border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
                    >

                      <button
                        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleEdit(tag); }}
                      >                                
                      <Pencil className='w-4 h-4 text-gray-600' />
                      </button>

                      <div className="flex flex-col items-center gap-3 mb-3">
                        {tag.photo ? (
                          <img
                            src={tag.photo}
                            alt={tag.nom}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                            {tag.nom
                              .split(' ')
                              .map(n => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                      </div>


                      <div className="text-center mb-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {tag.nom}
                        </h3>
                      </div>

                      {tag.affectation && (
                        <div className="text-center">
                          <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {tag.affectation.affectation}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la position</DialogTitle>
            <DialogDescription>
              Choisissez une position pour {selectedJoueuse?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAffectation} onValueChange={setSelectedAffectation}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une position" />
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