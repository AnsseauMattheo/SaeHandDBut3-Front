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

/**
 * Récupère les insights basés sur les 3 derniers matchs
 */
export async function getInsights() {
    console.log("🔍 [getInsights] Appel API...");
    console.log("🔍 [getInsights] URL:", `${import.meta.env.VITE_SERVER_URL}/match/insights`);

    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/match/insights`, {
            withCredentials: true
        });

        console.log("✅ [getInsights] Réponse reçue:", response);
        console.log("✅ [getInsights] Data:", response.data);
        console.log("✅ [getInsights] Type:", typeof response.data);
        console.log("✅ [getInsights] Longueur:", response.data?.length);

        return response.data;

    } catch (error) {
        console.error("❌ [getInsights] Erreur:", error);
        console.error("❌ [getInsights] Response:", error.response);
        console.error("❌ [getInsights] Status:", error.response?.status);
        console.error("❌ [getInsights] Data:", error.response?.data);

        return [];  // Retourne un tableau vide en cas d'erreur
    }
}
