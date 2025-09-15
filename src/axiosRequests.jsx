import axios from 'axios';

export function Login(email, password, setError) {
    console.log("Login called with:", email, password); // 🐞 Debug

    axios.post('http://localhost:8080/auth/login',
        {
            email,
            password
        },
        {
            headers: { 'Content-Type': 'application/json' },
             withCredentials: true
        },
        {
            withCredentials: true

        }

    )
        .then((response) => {
            console.log("response : ", response.data);
            setError(false);
        })
        .catch((error) => {
            console.error("Erreur lors de la requête : ", error.response);
            setError(true);
        });
}
