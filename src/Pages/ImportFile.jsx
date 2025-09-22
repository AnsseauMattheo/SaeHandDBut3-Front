import axios from "axios";
import {useState} from "react";
import {Button} from "@/components/ui/button"
import {useAlerts} from "@/context/AlertProvider.jsx";
import {Loader2Icon} from "lucide-react"


const ImportFile = () => {

    const {addSuccess, addError, addWarning, addInfo} = useAlerts();
    const [file, setFile] = useState(null);
    const [nomMatch, setNomMatch] = useState(null);
    const [dateMatch, setDateMatch] = useState(null);
    const [load, setLoad] = useState(false);

    const handleSubmit = (e) => {

        setLoad(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", nomMatch);
        formData.append("date", dateMatch);

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

    const handleMatchDate = (e) => {
        const matchDate = e.target.value;
        setDateMatch(matchDate)
        console.log("change date")
    }

    return (
        <>
            {/*<h1>Importer un fichier</h1>*/}
            {/*<form onSubmit={handleSubmit}>*/}
            {/*    <label>Nom du match</label><input required type="text" onChange={handleMatchName}></input>*/}
            {/*    <label>Date du match</label><input required type="date" onChange={handleMatchDate}></input>/!*ou type string si le type pose pbm avec la bdd*!/*/}
            {/*    <input required type="file" onChange={handleChangeFile}></input>*/}
            {/*    <Button disabled = {load}>*/}
            {/*        {load? <Loader2Icon className="animate-spin" /> : ""}*/}
            {/*        Button*/}
            {/*    </Button>*/}
            {/*</form>*/}

            <h1 className="text-2xl font-bold mb-6 text-center text-fuchsia-600">Importer un fichier</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-[#0a0f1f] shadow-lg rounded-2xl"
            >
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-fuchsia-500 mb-1">Nom du match</label>
                    <input
                        required
                        type="text"
                        onChange={handleMatchName}
                        className="border border-[#1e2a47] bg-[#131a2e] text-white rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-fuchsia-700"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-fuchsia-500 mb-1">Date du match</label>
                    <input
                        required
                        type="date"
                        onChange={handleMatchDate}
                        className="border border-[#1e2a47] bg-[#131a2e] text-white rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-fuchsia-700"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-fuchsia-500 mb-1">Fichier</label>
                    <input
                        required
                        type="file"
                        onChange={handleChangeFile}
                        className="border border-[#1e2a47] bg-[#131a2e] text-white rounded-lg px-3 py-2
                 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
                 file:bg-fuchsia-800 file:text-white hover:file:bg-fuchsia-900"
                    />
                </div>

                <Button
                    disabled={load}
                    className="w-full bg-fuchsia-800 hover:bg-fuchsia-900 text-white font-medium py-2 px-4
               rounded-xl flex items-center justify-center gap-2 disabled:opacity-50
               shadow-lg shadow-fuchsia-900/40"
                >
                    {load ? <Loader2Icon className="animate-spin" /> : "Importer"}
                </Button>
            </form>

        </>
    )

}

export default ImportFile;