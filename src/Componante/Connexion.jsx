import React from "react";
import { Login } from '../axiosRequests';

function Connexion() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const loginHandler = () => {
        Login(email, password);
    }

    return (
        <div>
            <label>Connexion</label>
            <form onSubmit={loginHandler}>
                <input id={"email"} type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                <input id={"password"} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Connexion</button>
            </form>
        </div>
    )

}

export default Connexion;