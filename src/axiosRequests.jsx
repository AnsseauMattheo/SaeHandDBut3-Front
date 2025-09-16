import axios from 'axios';


export async function Login(email, password, setError) {
    console.log("Login called with:", email, password); // 🐞 Debug

    try {
        const response = await axios.post('http://localhost:8080/auth/login',
            {
                email,
                password
            },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        
        console.log("response : ", response.data);
        return true; 
        
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.response);
        
        
        setError(true);

        return false; // Échec
    }
}

export async function getBut(email, password, setError) {}
