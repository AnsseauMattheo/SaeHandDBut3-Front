import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button"

const ImportFile = () => {

    const [file, setFile] = useState(null);
    const [nomMatch, setNomMatch] = useState(null);
    const [dateMatch, setDateMatch] = useState(null);

    const handleSubmit = (e) => {

        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", nomMatch);
        formData.append("date", dateMatch);

        axios.post("http://localhost:8080/data/import", formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
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
        const matchDate = e.target.date;
        setDateMatch(matchDate)
        console.log("change date")
    }

    return (
        <>
            <h1>Importer un fichier</h1>
            <form onSubmit={handleSubmit}>
                <label>Nom du match</label><input type="text" onChange={handleMatchName}></input>
                <label>Date du match</label><input type="date" onChange={handleMatchDate}></input>{/*ou type string si le type pose pbm avec la bdd*/}
                <input type="file" onChange={handleChangeFile}></input>
                <Button>Button</Button>
            </form>
        </>
    )

}

export default ImportFile;