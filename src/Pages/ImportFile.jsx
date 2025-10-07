import axios from "axios";
import {useState} from "react";
import {Button} from "@/components/ui/button"
import {useAlerts} from "@/context/AlertProvider.jsx";
import {Loader2Icon} from "lucide-react"


const ImportFile = () => {

    const {addSuccess, addError, addWarning, addInfo} = useAlerts();
    const [file, setFile] = useState(null);
    const [nomMatch, setNomMatch] = useState(null);
    const [adversaireName, setAadversaireName] = useState(null);
    const [dateMatch, setDateMatch] = useState(null);
    const [win, setWin] = useState(null);
    const [load, setLoad] = useState(false);

    const handleSubmit = (e) => {

        setLoad(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("nameM", nomMatch);
        formData.append("nameA", adversaireName);
        formData.append("date", dateMatch);
        formData.append("win", win);

        axios.post("http://localhost:8080/data/import", formData, {
            withCredentials: true,
            headers: {"Content-Type": "multipart/form-data"}
        }).then(res => {
            setLoad(false);
            addSuccess("Import successfully");
        }).catch(err => {
            setLoad(false);
            addError("erreur lors de l'import");
        })
    }


    const handleChangeFile = (e) => {
        const importFile = e.target.files[0];
        setFile(importFile)
        console.log("change file")
    }

    const handleMatchName = (e) => {
        const matchName = e.target.value;
        setNomMatch(matchName)
        console.log("change name")
    }

    const handleAdversaireName = (e) => {
        const adversaireName = e.target.value;
        setAadversaireName(adversaireName)
        console.log("change name")
    }

    const handleMatchDate = (e) => {
        const matchDate = e.target.value;
        setDateMatch(matchDate)
        console.log("change date")
    }

    const handleWin = (e) => {
        const win = e.target.checked;
        setWin(win)
        console.log("change win")
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary)]">
                Importer un fichier
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md mx-auto p-6
             bg-[var(--color-card)] shadow-lg rounded-2xl"
            >
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-primary)] mb-1">
                        Nom de l'import
                    </label>
                    <input
                        required
                        type="text"
                        onChange={handleMatchName}
                        className="border border-[var(--color-border)]
                 bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-primary)] mb-1">
                        Nom Adversaire
                    </label>
                    <input
                        required
                        type="text"
                        onChange={handleAdversaireName}
                        className="border border-[var(--color-border)]
                 bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-primary)] mb-1">
                        Date du match
                    </label>
                    <input
                        required
                        type="date"
                        onChange={handleMatchDate}
                        className="border border-[var(--color-border)]
                 bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-primary)] mb-1">
                        Victoire
                    </label>
                    <input
                    type="checkbox"
                    onChange={handleWin}
                    className="border border-[var(--color-border)]"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-[var(--color-primary)] mb-1">
                        Fichier
                    </label>
                    <input
                        required
                        type="file"
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
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-ring)]
               text-[var(--color-primary-foreground)] font-medium py-2 px-4
               rounded-xl flex items-center justify-center gap-2 disabled:opacity-50
               shadow-lg shadow-[var(--color-ring)]/40"
                >
                    {load ? <Loader2Icon className="animate-spin" /> : "Importer"}
                </Button>
            </form>


        </>
    )

}

export default ImportFile;