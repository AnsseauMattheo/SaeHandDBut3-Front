import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from './AlertProvider.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addSuccess, addError } = useAlerts();

    const fetchUserInfo = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/me`,
                { withCredentials: true }
            );
            setUser(data);
            return data;
        } catch (error) {
            console.error('Erreur auth:', error);
            if (error.response?.status === 400) {
                setUser(null);
                if (location.pathname !== "/Connexion") {
                    navigate("/Connexion");
                    addError("Vous devez être connecté");
                }
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const logout = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
                { withCredentials: true }
            );
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setUser(null);
            addSuccess("Déconnexion !");
            navigate("/Connexion");
        } catch (error) {
            console.error("Erreur logout:", error);
        }
    };

    const isCoach = () => user?.role.role === 'Coach';
    const isJoueuse = () => user?.role.role === 'Joueuse';
    const hasRole = (role) => user?.role.role === role;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            isCoach,
            isJoueuse,
            hasRole,
            fetchUserInfo
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
};
