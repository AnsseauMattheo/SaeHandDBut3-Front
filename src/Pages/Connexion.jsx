import React, {useState} from "react";
import { Login } from '../axiosRequests.js';
import { Button } from "../components/ui/button.jsx";
import { cn } from "../lib/utils.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert.jsx";
import {AlertCircleIcon, Eye, EyeOff} from "lucide-react";
import { useNavigate } from "react-router";
import { AlertProvider, useAlerts } from "../context/AlertProvider.jsx";


function Connexion({reload}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { addSuccess, addError, addWarning, addInfo } = useAlerts();

    const loginHandler = async (e) => {
        e.preventDefault()
        console.log("password :", password);
        let response = await Login(email, password, setError);
        console.log(response)
        if (response === true) {
            reload();
            addSuccess("Connexion")
            navigate("/DashBoard")
        }

    }

        return (
            <>
                <div className={cn("flex flex-col gap-6 h-screen justify-center items-center ")}>
                    <Card style={{ width: '350px' }}>
                        <CardHeader>
                            <CardTitle>Connexion à votre compte</CardTitle>
                            <CardDescription>
                                Entrez votre email ci-dessous pour accéder à votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={loginHandler}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="mail@example.com"
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Mot de passe</Label>
                                        </div>
                                        <div className="relative w-full max-w-sm">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pr-10" // espace pour l’icône
                                                placeholder="Mot de passe"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                            </button>
                                        </div>
                                        <div className="flex items-center">
                                            <a
                                                href="/ForgotPassword"
                                            >
                                                Mot de passe oublié ?
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 ">
                                        <Button type="submit" onClick={loginHandler}>
                                            Connexion
                                        </Button>
                                    </div>
                                    {
                                        error ?
                                            <Alert variant="destructive">
                                                <AlertCircleIcon />
                                                <AlertTitle>Identifiant ou mot de passe incorrect !</AlertTitle>
                                            </Alert> : ""
                                    }
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </>
        )

}

export default Connexion;