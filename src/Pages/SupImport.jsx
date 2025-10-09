import axios from "axios";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {useAlerts} from "@/context/AlertProvider.jsx";
import {Loader2Icon} from "lucide-react"
import ListComponent from "../components/ListComponent.jsx";
import { Trash2 } from "lucide-react";

const SupImport = () => {
    const {addSuccess, addError, addWarning, addInfo} = useAlerts();
    const [matchs, setMatchs] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/match/getAll`).then(res => {
            console.log(res.data);
            setMatchs(res.data);
        });
    }, [])

    const handleDelete = (id) => {
        axios.post(`${import.meta.env.VITE_SERVER_URL}/match/deleteMatch?id=${id}`, {

        }).then(res => {
            addSuccess("Delete successfully");
            let index = matchs.findIndex(match => match.mid === id);
            console.log(index);
            if(index > -1) {
                let nmatch = [...matchs];
                nmatch.splice(index, 1);
                setMatchs(nmatch);
            }
        }).catch(err => {
            console.log(err);
        })
    }

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
                                    <button
                                        onClick={() => {handleDelete(match.mid)}}
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
        </div>
    );
}

export default SupImport;