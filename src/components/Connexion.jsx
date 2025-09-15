import React from "react";
import { Login } from '../axiosRequests.jsx';
import { Button } from "./ui/button.jsx";
import { cn } from "../lib/utils.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx";
import { Label } from "./ui/label.jsx";
import { Input } from "./ui/input.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { AlertProvider, useAlerts } from "../context/AlertProvider.jsx";


function Connexion() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState(false);
    const navigate = useNavigate();

    const { addSuccess, addError, addWarning, addInfo } = useAlerts();

    const loginHandler = async (e) => {
        e.preventDefault()
        console.log("password :", password);
        let response = await Login(email, password, setError);
        console.log(response)
        if (response === true) {
            addSuccess("Succès depuis le composant 1!" )
            navigate("/DashBoard")
        }

    }

    return (
        <>
            <div className={cn("flex flex-col gap-6")}>
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
                                    <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                                    <div className="flex items-center">
                                        <a
                                            href="#"
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