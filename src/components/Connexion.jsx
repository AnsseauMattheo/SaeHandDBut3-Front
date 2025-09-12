import React from "react";
import {Login} from '../axiosRequests.jsx';
import {Button} from "./ui/button.jsx";
import {cn} from "../lib/utils.js";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.jsx";
import {Label} from "./ui/label.jsx";
import {Input} from "./ui/input.jsx";


function Connexion() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const loginHandler = (e) => {
        e.preventDefault()
        console.log("password :",password);
        Login(email, password);
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle>Connexion à votre compte</CardTitle>
                    <CardDescription>
                        entrez votre email ci-dessous pour accédez à votre compte
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
                                    placeholder="m@example.com"
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
                                <Button type="submit" className="w-full" style={{background: "black"}} onClick={loginHandler}>
                                    Login
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}

export default Connexion;