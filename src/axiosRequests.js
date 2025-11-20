import axios from 'axios';

export async function Login(email, password, setError) {
    console.log("Login called with:", email, password);

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

        console.log("response : ", response.data);
        return true;

    } catch (error) {
        console.error("Erreur lors de la requête : ", error.response);
        setError(true);
        return false;
    }
}

export async function getLastMatch() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/lastMatch`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.response);
        return false;
    }
}

// Récupère les insights basés sur les 3 derniers matchs
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


// Récupère les stats de possessions par phase de jeu pour les 3 derniers matchs
export const getPossessionsByPhase = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/possessionsByPhase`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des possessions par phase:", error);
        throw error;
    }
};

// Récupère le classement complet des zones fortes
export const getZonesRanking = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/zonesRanking`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du classement des zones:", error);
        return [];
    }
};

// Récupère le top des joueuses
export const getTopPlayers = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/topPlayers`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du top joueuses:", error);
        return [];
    }
};

