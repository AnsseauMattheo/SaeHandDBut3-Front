import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Loader2, Check } from "lucide-react";

export default function AttenduInput({ id, initialValue, onSaved }) {
    const [value, setValue] = useState(initialValue);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        if (value === initialValue) {
            if (timer) clearTimeout(timer);
            setSaving(false);
            return;
        }

        setSaving(true);
        setSuccess(false);

        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            fetch(`${import.meta.env.VITE_SERVER_URL}/stats/setAttendu?id=${id}&attendu=${value}`, { method: "POST", credentials: "include" })
                .then(() => {
                    setSaving(false);

                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 2000);

                    if (onSaved) onSaved(value);
                })
                .catch(() => setSaving(false));
        }, 2000);

        setTimer(newTimer);
        return () => clearTimeout(newTimer);
    }, [value]);

    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                step={0.1}
                min={0}
                max={100}
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="w-20"
            />

            {saving && (
                <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
            )}

            {!saving && success && (
                <Check className="w-4 h-4 text-green-600" />
            )}
        </div>
    );
}
