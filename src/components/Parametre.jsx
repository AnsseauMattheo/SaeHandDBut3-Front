import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAlerts } from '@/context/AlertProvider.jsx';
import axios from 'axios';

export function ParametreDialog({ isOpen, onClose }) {
    const { addSuccess, addError } = useAlerts();
    const [nomSaison, setNomSaison] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        if (!nomSaison) {
            addError("Veuillez entrer un nom de saison");
            return;
        }

        setLoading(true);

        // Utilisation de URLSearchParams pour @RequestParam
        const params = new URLSearchParams();
        params.append('nom', nomSaison);

        axios.post(
            `${import.meta.env.VITE_SERVER_URL}/saisons/addSaison`,
            params,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
            .then((response) => {
                console.log("Saison ajoutée:", response.data);
                addSuccess('Saison ajoutée avec succès');
                setNomSaison('');
                onClose();
            })
            .catch(error => {
                console.error("Erreur complète:", error);
                console.error("Réponse:", error.response);
                addError("Erreur lors de l'ajout de la saison");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleClose = () => {
        setNomSaison('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle saison</DialogTitle>
                    <DialogDescription>
                        Entrez le nom de la saison au format YYYY-YYYY+1 (ex: 2027-2028)
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="nomSaison">Nom de la saison</Label>
                    <br/>
                    <Input
                        id="nomSaison"
                        type="text"
                        value={nomSaison}
                        onChange={(e) => setNomSaison(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && nomSaison) {
                                handleSave();
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button onClick={handleSave} disabled={loading || !nomSaison}>
                        {loading ? "Ajout en cours..." : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
