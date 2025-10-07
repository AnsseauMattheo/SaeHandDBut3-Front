import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useAlerts } from "@/context/AlertProvider.jsx";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export default function CreationCompte() {
    const { addSuccess, addError } = useAlerts();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState(undefined);
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [affectation, setAffectation] = useState("");
    const [load, setLoad] = useState(false);
    const [activationLink, setActivationLink] = useState(""); // Pour créer un compte

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const resRoles = await axios.get("http://localhost:8080/roles/getAll");
                setRoles(resRoles.data);
                console.log(resRoles.data);

                if (token) {
                    // Mode activation : remplir les champs mais ne pas montrer le QR code
                    const resData = await axios.get(
                        `http://localhost:8080/ajout/activation-data?token=${token}`
                    );
                    setNom(resData.data.username || "");
                    setEmail(resData.data.email || "");
                    setRole(resData.data.roleId?.toString() || undefined);
                    if (resData.data.affectationId) {
                        setAffectation(resData.data.affectationId.toString());
                    }
                }
            } catch (err) {
                addError("Impossible de charger les rôles ou les données d'activation");
                console.error(err);
            }
        };
        fetchRoles();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);

        try {
            if (!token) {

                const formData = new FormData();
                if (role) formData.append("role", parseInt(role));
                formData.append("nom", nom);
                formData.append("email", email);
                formData.append("password", password);
                if (affectation) formData.append("affectation", parseInt(affectation));

                const res = await axios.post("http://localhost:8080/ajout/utilisateur", formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                });

                setLoad(false);
                addSuccess("Utilisateur ajouté avec succès !");
                addSuccess(res.data);

                setActivationLink(res.data);

            } else {
                const formData = new FormData();
                formData.append("token", token);
                formData.append("password", password);
                const res = axios.post("http://localhost:8080/ajout/activation", formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setLoad(false);
                addSuccess("Compte activé avec succès !");
                console.log(res.data);
            }

        } catch (err) {
            setLoad(false);
            addError("Erreur lors de l'ajout de l'utilisateur");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-50 to-purple-100 p-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                {token ? "Activer mon compte" : "Créer un compte"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-4xl text-gray-800 shadow-2xl rounded-3xl p-8 space-y-6 bg-white"
            >
                <div className="flex flex-col md:flex-row md:space-x-4">
                    {/* Select Rôle */}
                    <div className="flex-1">
                        <Label htmlFor="role">Rôle</Label>
                        <Select
                            value={role}
                            onValueChange={setRole}
                            disabled={!!token} // non modifiable si activation
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-- Choisir un rôle --" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={r.id.toString()}>
                                        {r.role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nom utilisateur */}
                    <div className="flex-1">
                        <Label htmlFor="Utilisateur">Utilisateur</Label>
                        <Input
                            id="Utilisateur"
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            disabled={!!token}
                        />
                    </div>
                </div>

                {/* Affectation */}
                {role === "2" && (
                    <div className="flex-1 mt-4">
                        <Label htmlFor="Affectation">Affectation</Label>
                        <Select
                            value={affectation}
                            onValueChange={setAffectation}
                            disabled={!!token} // non modifiable si activation
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-- Choisir une affectation --" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Gardienne</SelectItem>
                                <SelectItem value="2">Défenseuse</SelectItem>
                                <SelectItem value="3">Attaquante</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Email */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!!token} // non modifiable si activation
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                {/* Bouton */}
                <Button
                    type="submit"
                    disabled={load}
                    className="w-full bg-gradient-to-r from-pink-700 to-blue-900 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 border-white"
                >
                    {load
                        ? "Création en cours..."
                        : token
                            ? "Activer mon compte"
                            : "Créer le compte"}
                </Button>
            </form>

            {/* QR Code et lien : uniquement si création */}
            {!token && activationLink && (
                <div className="mt-8 flex flex-col items-center bg-white p-4 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Lien d’activation (QR Code)</h3>
                    <QRCodeSVG value={activationLink} size={200} />
                    <p className="mt-2 text-gray-700 break-all">{activationLink}</p>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(activationLink);
                            addSuccess("Lien copié dans le presse-papier !");
                        }}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Copier le lien
                    </Button>
                </div>
            )}
        </div>
    );
}
