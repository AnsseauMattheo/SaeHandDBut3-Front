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

    const loginHandler = () => {
        Login(email, password);
    }

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
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