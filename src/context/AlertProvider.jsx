import { createContext, useCallback, useContext, useState } from "react";
import AlertContainer from "../components/AlertContainer";

const AlertContext = createContext();

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlerts doit être utilisé dans un AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const addAlert = useCallback((alert) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newAlert = {
            ...alert,
            id,
            duration: alert.duration ?? 5000,
            persistent: alert.persistent ?? false,
        };

        setAlerts(prev => [...prev, newAlert]);

        if (!newAlert.persistent && newAlert.duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, newAlert.duration);
        }
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    const clearAllAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    const addSuccess = useCallback((message, options = {}) => {
        addAlert({ ...options, type: 'success', message });
    }, [addAlert]);

    const addError = useCallback((message, options = {}) => {
        addAlert({ ...options, type: 'error', message });
    }, [addAlert]);


    const addWarning = useCallback((message, options = {}) => {
        addAlert({ ...options, type: 'warning', message });
    }, [addAlert]);


    const addInfo = useCallback((message, options = {}) => {
        addAlert({ ...options, type: 'info', message });
    }, [addAlert]);

    const value = {
        alerts,
        addAlert,
        removeAlert,
        clearAllAlerts,
        addSuccess,
        addError,
        addWarning,
        addInfo,
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
            <AlertContainer />
        </AlertContext.Provider>
    );
};