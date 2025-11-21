import React, {useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {Login} from '../axiosRequests.js';
import {Button} from "../components/ui/button.jsx";
import {cn} from "../lib/utils.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.jsx";
import {Label} from "../components/ui/label.jsx";
import {Input} from "../components/ui/input.jsx";
import {Alert, AlertTitle} from "../components/ui/alert.jsx";
import {AlertCircleIcon, Eye, EyeOff} from "lucide-react";
import {useNavigate} from "react-router";
import {useAlerts} from "../context/AlertProvider.jsx";
import TransitionOverlay from "../components/TransitionOverlay.jsx";
import MdpOublie from "../components/MdpOublie.jsx";

function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const navigate = useNavigate();
    const {addSuccess, addError} = useAlerts();
    const {fetchUserInfo} = useAuth();
    const [IsMDPOpen, setIsMDPOpen] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();
        setError(false);
        setLoading(true);

        try {
            const success = await Login(email, password, setError);

            if (success) {
                const userData = await fetchUserInfo();

                setIsTransitioning(true);

                setTimeout(() => {
                    setShowOverlay(true);
                }, 0);

                setTimeout(() => {
                    sessionStorage.setItem('justLoggedIn', 'true');
                    addSuccess("Connexion réussie");

                    if (userData?.role?.role === 'Joueuse' && userData?.joueuse?.id) {
                        navigate(`/DashBoard/joueuse/${userData.joueuse.id}`);
                    } else {
                        navigate("/DashBoard");
                    }
                }, 0);
            } else {
                setError(true);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError(true);
            addError("Erreur lors de la connexion");
            setLoading(false);
        }
    }

    const HandleMDP = () => {
        // setIsMDPOpen(true);
    }

    return (
        <>
            <div className="relative h-screen w-full overflow-hidden">
                {/* Image de fond floutée */}
                <div
                    className={cn(
                        "absolute inset-0 bg-cover bg-center blur-xs scale-110 transition-all duration-700",
                        isTransitioning && "blur-md opacity-20"
                    )}
                    style={{
                        backgroundImage: `url('https://sambre-avesnois-handball.fr/wp-content/uploads/2024/10/20241019-SAMBRE-AVESNOIS-vs-MERIGNAC-060.jpg')`,
                    }}
                />

                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/40"/>

                {/* Contenu de la page avec animation */}
                <div
                    className={cn(
                        "relative flex flex-col gap-6 h-screen justify-center items-center transition-all duration-700 ease-in-out",
                        isTransitioning && "opacity-0 scale-90"
                    )}
                >
                    {IsMDPOpen ? (
                        <MdpOublie
                            isOpen={IsMDPOpen}
                            onClose={() => setIsMDPOpen(false)}
                        />
                    ) : (
                        <Card
                            style={{width: '350px'}}
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={loading}
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
                                                    value={password}
                                                    required
                                                    className="pr-10"
                                                    placeholder="Mot de passe"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500"/> :
                                                        <Eye className="h-5 w-5 text-gray-500"/>}
                                                </button>
                                            </div>
                                            <div className="flex items-center">
                                                <a onClick={HandleMDP}
                                                   className="cursor-pointer text-blue-300 hover:underline">
                                                    Mot de passe oublié ?
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button type="submit" disabled={loading}>
                                                {loading ? "Connexion..." : "Connexion"}
                                            </Button>
                                        </div>
                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertCircleIcon/>
                                                <AlertTitle>Identifiant ou mot de passe incorrect !</AlertTitle>
                                            </Alert>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>


            {/* Overlay de transition */}
            <TransitionOverlay isActive={showOverlay}/>
        </>
    );
}

export default Connexion;
