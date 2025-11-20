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
import { useAlerts } from "../context/AlertProvider.jsx";
import TransitionOverlay from "../components/TransitionOverlay.jsx";

function Connexion({reload}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // États pour gérer les transitions
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const navigate = useNavigate();
    const { addSuccess } = useAlerts();

    const loginHandler = async (e) => {
        e.preventDefault();
        let response = await Login(email, password, setError);

        if (response === true) {
            // 1. Commence la transition du formulaire
            setIsTransitioning(true);

            // 2. Après 400ms, affiche l'overlay noir
            setTimeout(() => {
                setShowOverlay(true);
            }, 400);

            // 3. Après 800ms total, navigue vers le dashboard
            setTimeout(() => {
                // Marque que l'utilisateur vient de se connecter
                sessionStorage.setItem('justLoggedIn', 'true');

                reload();
                addSuccess("Connexion");
                navigate("/DashBoard");
            }, 1200);
        }
    }

    return (
        <>
            <div className="relative h-screen w-full overflow-hidden">
                {/* Image de fond floutée */}
                <div
                    className={cn(
                        "absolute inset-0 bg-cover bg-center blur-sm scale-110 transition-all duration-700",
                        isTransitioning && "blur-md opacity-50"
                    )}
                    style={{
                        backgroundImage: `url('https://sambre-avesnois-handball.fr/wp-content/uploads/2024/10/20241019-SAMBRE-AVESNOIS-vs-MERIGNAC-060.jpg')`,
                    }}
                />

                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Contenu de la page avec animation */}
                <div
                    className={cn(
                        "relative flex flex-col gap-6 h-screen justify-center items-center transition-all duration-700 ease-in-out",
                        isTransitioning && "opacity-0 scale-90"
                    )}
                >
                    <Card
                        style={{ width: '350px' }}
                        className="backdrop-blur-md bg-white/95 shadow-2xl"
                    >
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
                                                className="pr-10"
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
                                    <div className="flex flex-col gap-3">
                                        <Button type="submit">
                                            Connexion
                                        </Button>
                                    </div>
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertCircleIcon />
                                            <AlertTitle>Identifiant ou mot de passe incorrect !</AlertTitle>
                                        </Alert>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Overlay de transition */}
            <TransitionOverlay isActive={showOverlay} />
        </>
    );
}

export default Connexion;
