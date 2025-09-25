import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const AlertComponent = ({ alert, onRemove }) => {
    const getAlertConfig = (type) => {
        switch (type) {
            case 'success':
                return {
                    className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
                    icon: CheckCircle,
                };
            case 'error':
                return {
                    className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
                    icon: AlertCircle,
                };
            case 'warning':
                return {
                    className: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
                    icon: AlertTriangle,
                };
            case 'info':
                return {
                    className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
                    icon: Info,
                };
            default:
                return {
                    className: '',
                    icon: Info,
                };
        }
    };

    const config = getAlertConfig(alert.type);
    const IconComponent = config.icon;

    return (
        <Alert className={`relative flex pr-12 transition-all duration-300 ease-in-out ${config.className}`}>
            <div className="flex items-start gap-2">
                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    {alert.title && <AlertTitle className="mb-1">{alert.title}</AlertTitle>}
                    <AlertDescription>{alert.message}</AlertDescription>
                </div>
            </div>
            <button
                onClick={() => onRemove(alert.id)}
                className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
            </button>
        </Alert>
    );
};

export default AlertComponent;