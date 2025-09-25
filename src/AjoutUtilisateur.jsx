import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useEffect, useState} from "react"
import {useAlerts} from "@/context/AlertProvider.jsx";
import axios from "axios"

export default function CreationCompte() {
    const {addSuccess, addError} = useAlerts();

    const [roles, setRoles] = useState([])
    const [role, setRole] = useState("")
    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [load, setLoad] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:8080/roles")
            .then(res => setRoles(res.data))
            .catch(err => addError("Impossible de charger les rôles"));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoad(true)

        const formData = new FormData()
        formData.append("role", role)
        formData.append("nom", nom)
        formData.append("prenom", prenom)
        formData.append("email", email)
        formData.append("password", password)

        axios.post("http://localhost:8080/ajout/utilisateur", formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            setLoad(false);
            addSuccess("Utilisateur ajouté avec succès !");
            addSuccess(res.data);
        }).catch(err => {
            setLoad(false);
            addError("Erreur lors de l'ajout de l'utilisateur");
            addSuccess(err.data);
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-50 to-purple-100 p-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                Créer un compte
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col w-full h-full max-w-4xl text-gray-800 shadow-2xl rounded-3xl p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="role">Rôle</Label>
                        <select
                            id="role"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">-- Choisir un rôle --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="nom">Nom</Label>
                        <Input id="nom" type="text" value={nom} onChange={e => setNom(e.target.value)} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input id="prenom" type="text" value={prenom} onChange={e => setPrenom(e.target.value)} />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <Button type="submit" disabled={load}
                        className="w-full bg-gradient-to-r from-pink-700 to-blue-900 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 border-white">
                    {load ? "Création en cours..." : "Créer le compte"}
                </Button>
            </form>
        </div>
    )
}
