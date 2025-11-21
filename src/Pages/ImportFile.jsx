import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {useAlerts} from "@/context/AlertProvider.jsx";
import {Loader2Icon} from "lucide-react"

const ImportFile = () => {
    const {addSuccess, addError, addWarning, addInfo} = useAlerts();
    const [file, setFile] = useState(null);
    const [nomMatch, setNomMatch] = useState("");
    const [adversaireName, setAdversaireName] = useState("");
    const [dateMatch, setDateMatch] = useState("");

    const [load, setLoad] = useState(false);
    const [saisons, setSaisons] = useState([]);
    const [saisonId, setSaisonId] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/saisons/getSaisons`, {
            withCredentials: true
        }).then(res => {
            setSaisons(res.data);
            if (res.data.length > 0) {
                setSaisonId(res.data[0].id);
            }
        }).catch(err => {
            addError("Erreur lors du chargement des saisons");
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoad(true);

        const formData = new FormData();
        formData.append("file", file);

        // Créer l'objet match correspondant à MatchRequest
        const matchData = {
            nom: nomMatch,
            adversaire: adversaireName,
            date: dateMatch,
            saisonId: parseInt(saisonId)
        };

        // Ajouter comme Blob JSON
        formData.append("match", new Blob([JSON.stringify(matchData)], {
            type: 'application/json'
        }));

        axios.post(`${import.meta.env.VITE_SERVER_URL}/data/import`, formData, {
            withCredentials: true,
            headers: {"Content-Type": "multipart/form-data"}
        }).then(res => {
            setLoad(false);
            addSuccess("Import réussi !");
            // Réinitialiser le formulaire
            setFile(null);
            setNomMatch("");
            setAdversaireName("");
            setDateMatch("");
            e.target.reset();
        }).catch(err => {
            setLoad(false);
            console.error(err);
            addError("Erreur lors de l'import");
        })
    }


    const handleChangeFile = (e) => {
        const importFile = e.target.files[0];
        if(nomMatch === ""){
            const nameWithoutExt = importFile.name.replace(/\.[^/.]+$/, "");
            setNomMatch(nameWithoutExt);
        }
        setFile(importFile)

    }

    const handleMatchName = (e) => {
        const matchName = e.target.value;
        setNomMatch(matchName);
    }

    const handleAdversaireName = (e) => {
        const adversaireName = e.target.value;
        setAdversaireName(adversaireName);
    }

    const handleMatchDate = (e) => {
        const matchDate = e.target.value;
        setDateMatch(matchDate);
    }

    const handleSaisonId = (e) => {
        const saisonId = e.target.value;
        setSaisonId(saisonId);
    }

    return (
        <>
            <h1 className="text-4xl mb-6 text-center">
                Importer un fichier
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md mx-auto p-6
                bg-[var(--color-card)] shadow-lg rounded-2xl"
            >
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                        Nom de l'import
                    </label>
                    <input
                        required
                        type="text"
                        value={nomMatch}
                        onChange={handleMatchName}
                        className="border border-[var(--color-border)]
                        bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                        Nom Adversaire
                    </label>
                    <input
                        required
                        type="text"
                        value={adversaireName}
                        onChange={handleAdversaireName}
                        className="border border-[var(--color-border)]
                        bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium  mb-1">
                        Date du match
                    </label>
                    <input
                        required
                        type="date"
                        value={dateMatch}
                        onChange={handleMatchDate}
                        className="border border-[var(--color-border)]
                        bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1">
                        Saison
                    </label>
                    <select
                        onChange={handleSaisonId}
                        value={saisonId || ""}
                        required
                        className="w-full border border-[var(--color-border)]
                        bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    >
                        {saisons.map((saison) => (
                            <option key={saison.id} value={saison.id}>
                                {saison.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                        Fichier Excel
                    </label>
                    <input
                        required
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleChangeFile}
                        className="border border-[var(--color-border)]
                        bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                        file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
                        file:bg-[var(--color-primary)] file:text-[var(--color-primary-foreground)]
                        hover:file:bg-[var(--color-ring)]"
                    />
                </div>

                <Button
                    disabled={load}
                    type="submit"
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-ring)]
                    text-[var(--color-primary-foreground)] font-medium py-2 px-4
                    rounded-xl flex items-center justify-center gap-2 disabled:opacity-50
                    shadow-lg shadow-[var(--color-ring)]/40"
                >
                    {load ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            Import en cours...
                        </>
                    ) : (
                        "Importer"
                    )}
                </Button>
            </form>
        </>
    )
}

export default ImportFile;
