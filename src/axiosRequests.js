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

export async function getInsights() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/insights`, {
            withCredentials: true
        });

        return response.data;

    } catch (error) {
        console.error("Erreur lors de la récupération des insights:", error);
        // Retourne un tableau vide en cas d'erreur pour éviter les crashs
        return [];
    }
}


export const getPossessionsByPhase = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/possessionsByPhase`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des possessions par phase:", error);
        throw error;
    }
};

export const getZonesRanking = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/zonesRanking`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du classement des zones:", error);
        return [];
    }
};

export const getTopPlayers = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/topPlayers`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du top joueuses:", error);
        return [];
    }
};
