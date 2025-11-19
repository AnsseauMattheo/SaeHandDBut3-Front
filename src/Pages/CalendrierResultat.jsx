import Classement from '@/components/Classement';
import ProchainsMatchs from '@/components/ProchainsMatchs';
import Resultats from '@/components/Resultats';

export default function Competition() {
    const MON_EQUIPE_ID = "1949487";

    return (
        <div className="container mx-auto p-4 space-y-6 max-w-7xl">
            <div className="space-y-6">
                <Resultats equipeId={MON_EQUIPE_ID} />
                <ProchainsMatchs equipeId={MON_EQUIPE_ID} />
            </div>

            <div className="w-full">
                <Classement />
            </div>
        </div>
    );
}
