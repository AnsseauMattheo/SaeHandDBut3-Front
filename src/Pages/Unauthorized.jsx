import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md">
                <CardContent className="p-8 text-center">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
                    <p className="text-neutral-600 mb-6">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                    </p>
                    <Button asChild>
                        <Link to="/DashBoard">Retour au tableau de bord</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
