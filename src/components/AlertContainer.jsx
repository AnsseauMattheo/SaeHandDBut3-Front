import { useAlerts } from "../context/AlertProvider";
import AlertComponent from "./AlertComponent";

const AlertContainer = () => {
  const { alerts, removeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="animate-in slide-in-from-right-full duration-300"
        >
          <AlertComponent alert={alert} onRemove={removeAlert} />
        </div>
      ))}
    </div>
  );
};

export default AlertContainer