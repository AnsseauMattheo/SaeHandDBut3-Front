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
import {useEffect, useRef, useState} from "react";
import { useAlerts } from "@/context/AlertProvider.jsx";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react"

import ImportPhoto from "@/components/ImportPhoto.jsx";
import * as res from "react-router"; // chemin selon ton projet


export default function CreationCompte() {
    const {addSuccess, addError} = useAlerts();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState(undefined);
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [joueuses, setJoueuses] = useState([]);
    const [joueuseSelectionnee, setJoueuseSelectionnee] = useState("");
    const [load, setLoad] = useState(false);
    const [activationLink, setActivationLink] = useState("");

    console.log('joueuses:', joueuseSelectionnee);

    useEffect(() => {
        const fetchRolesAndJoueuses = async () => {
            try {
                const resRoles = await axios.get(`${import.meta.env.VITE_SERVER_URL}/roles/getAll`);
                setRoles(resRoles.data);
                const resJoueuses = await axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/getJoueuses`);
                setJoueuses(resJoueuses.data || []);
            } catch (err) {
                addError("Impossible de charger les rôles ou les joueuses");
                console.error(err);
            }
        };
        fetchRolesAndJoueuses();
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchActivationData = async () => {
            try {
                const resData = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/ajout/activation-data?token=${token}`
                );

                setNom(resData.data.username || "");
                setEmail(resData.data.email || "");
                setRole(resData.data.roleId?.toString() || "");
                setJoueuseSelectionnee(resData.data.joueuse || "");
    const avatarRef = useRef(null);

        useEffect(() => {
            const fetchRolesAndJoueuses = async () => {
                try {
                    const resRoles = await axios.get(`${import.meta.env.VITE_SERVER_URL}/roles/getAll`);
                    setRoles(resRoles.data);
                    const resJoueuses = await axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/getJoueuses`);
                    setJoueuses(resJoueuses.data || []);
                } catch (err) {
                    addError("Impossible de charger les rôles ou les joueuses");
                    console.error(err);
                }
            };
            fetchRolesAndJoueuses();
        }, []);

        useEffect(() => {
            if (!token) return;

            const fetchActivationData = async () => {
                try {
                    const resData = await axios.get(
                        `${import.meta.env.VITE_SERVER_URL}/ajout/activation-data?token=${token}`
                    );

                    setNom(resData.data.username || "");
                    setEmail(resData.data.email || "");
                    setRole(resData.data.roleId?.toString() || "");
                    setJoueuseSelectionnee(resData.data.joueuse || "");

                    if (token) {
                        const resData = await axios.get(
                            `${import.meta.env.VITE_SERVER_URL}/ajout/activation-data?token=${token}`
                        );
                        setNom(resData.data.username || "");
                        setEmail(resData.data.email || "");
                        setRole(resData.data.roleId?.toString() || undefined);
                        setJoueuseSelectionnee(res.data.joueuse || "");
                    }

                } catch (err) {
                    addError("Impossible de charger les données d'activation");
                    console.error(err);
                }
            };

            fetchActivationData();
        }, [token, joueuses]);


        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoad(true);

            if (token && password !== confirmPassword) {
                setLoad(false);
                addError("Les mots de passe ne correspondent pas !");
                return;
            }

            try {

                const formData = new FormData();

                // Image en base64
                const base64Image = avatarRef.current?.getBase64();
                formData.append("imageProfilBase64", base64Image);

                if (!token) {

                    if (role) formData.append("role", parseInt(role));
                    formData.append("nom", nom);
                    formData.append("email", email);
                    formData.append("password", password);
                    if (joueuseSelectionnee) formData.append("joueuse", joueuseSelectionnee);

                    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/ajout/utilisateur`, formData, {
                        withCredentials: true,
                        headers: {"Content-Type": "multipart/form-data"},
                    });

                    setLoad(false);
                    addSuccess("Utilisateur ajouté avec succès !");
                    addSuccess(res.data);

                    setActivationLink(res.data);

                } else {
                    const formData = new FormData();
                    formData.append("token", token);
                    formData.append("password", password);
                    const res = axios.post(`${import.meta.env.VITE_SERVER_URL}/ajout/activation`, formData, {
                        withCredentials: true,
                        headers: {"Content-Type": "multipart/form-data"},
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

        } catch (err) {
            setLoad(false);
            addError("Erreur lors de l'ajout de l'utilisateur");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full p-8">
            <h2 className="text-4xl text-gray-800 mb-8">
                {token ? "Activer mon compte" : "Créer un compte"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-4xl text-gray-800 shadow-2xl rounded-3xl p-8 space-y-6 bg-white"
            >
                <div className="flex flex-col md:flex-row md:space-x-4">
                    {/* Select Rôle */}
                    <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700 py-2" htmlFor="role">Rôle</Label>
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
                        <Label className="text-sm font-medium text-gray-700 py-2" htmlFor="Utilisateur">Utilisateur</Label>
                        <Input
                            id="Utilisateur"
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            disabled={!!token}
                        />
                    </div>
                </div>

                {/* Joueuse */}
                {role && roles.find(r => r.id.toString() === role)?.role === "Joueuse" && (
                    <div className="flex-1 mt-4">
                        <Label className="text-sm font-medium text-gray-700 py-2" htmlFor="joueuse">Joueuse</Label>
                        <Select
                            value={joueuseSelectionnee || ""}
                            onValueChange={val => setJoueuseSelectionnee(val)}
                            disabled={!!token}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="-- Choisir une joueuse --" />
                            </SelectTrigger>
                            <SelectContent>
                                {joueuses.map((j) => (
                                    <SelectItem key={j.id} value={j.nom} selected={(!token && joueuseSelectionnee === j.nom) }>
                                        {j.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}


                {/* Email */}
                <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                        <Label  className="text-sm font-medium text-gray-700 py-2" htmlFor="email">Email</Label>
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
                {token && (
                    <>
                        <div>
                            <Label className="text-sm font-medium text-gray-700 py-2" htmlFor="password">Mot de passe</Label>
        return (
            <div className="flex flex-col items-center justify-center w-full p-8">
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
                                    <SelectValue placeholder="-- Choisir un rôle --"/>
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

                        <div>
                            <Label className="text-sm font-medium text-gray-700 py-2" htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                    {/* Joueuse */}
                    {role && roles.find(r => r.id.toString() === role)?.role === "Joueuse" && (
                        <div className="flex-1 mt-4">
                            <Label htmlFor="joueuse">Joueuse</Label>
                            <Select
                                value={joueuseSelectionnee || ""}
                                onValueChange={val => setJoueuseSelectionnee(val)}
                                disabled={!!token}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Choisir une joueuse --"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {joueuses.map((j) => (
                                        <SelectItem key={j.id} value={j.nom}
                                                    selected={(!token && joueuseSelectionnee === j.nom)}>
                                            {j.nom}
                                        </SelectItem>
                                    ))}
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

                {/* Bouton */}
                <Button
                    type="submit"
                    disabled={load}
                    className="w-full bg-primary hover:primary-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 border-white"
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
                    {/* Password */}
                    {token && (
                        <>
                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}

                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}

                                />
                            </div>
                        </>
                    )}

                    <ImportPhoto ref={avatarRef}/>


                    {/* Bouton */}
                    <Button
                        type="submit"
                        disabled={load}
                        className="w-full bg-gradient-to-r from-pink-700 to-blue-900 hover:from-pink-800 hover:to-blue-950 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 border-white"
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
                        <QRCodeSVG value={activationLink} size={200}/>
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
