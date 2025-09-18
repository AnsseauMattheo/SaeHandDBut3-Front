import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button"

const ImportFile = () => {

    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {

        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);

        axios.post("http://localhost:8080/data/CSVimport", formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
    }

    const handleChangeFile = (e) => {
        const importFile = e.target.files[0];
        setFile(importFile)
        console.log("change")
    }

    return (
        <>
            <h1>Importer un fichier</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChangeFile}></input>
                <Button>Button</Button>
            </form>
        </>
    )

}

export default ImportFile;