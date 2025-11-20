import axios from 'axios';


export async function Login(email, password, setError) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`,
            {
                email,
                password
            },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        return true;

    } catch (error) {
        console.error("Erreur lors de la requête : ", error.response);

        setError(true);

        return false; // Échec
    }
}

export async function getLastMatch() {
    try{
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/lastMatch`);
        return response.data;
    }catch(error){
        console.error("Erreur lors de la requête : ", error.response);
        return false;
    }
}
