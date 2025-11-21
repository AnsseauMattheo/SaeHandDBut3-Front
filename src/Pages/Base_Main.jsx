import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Outlet, useLocation, matchPath } from "react-router-dom"
import { Menu } from "lucide-react"
import { useEffect } from "react"

import PropTypes from 'prop-types';

DashBoard.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    logout: PropTypes.func.isRequired,
};

export default function DashBoard({ user, logout }) {
    const location = useLocation();

    const pageTitles = {
        "/DashBoard": "Tableau de bord",
        "/DashBoard/StatTir": "Carte des tirs",
        "/DashBoard/import": "Importer un match",
        "/DashBoard/supImport": "Matchs importés",
        "/DashBoard/ajout-utilisateur": "Ajouter utilisateur",
        "/DashBoard/joueuses": "Joueuses",
        "/Dashboard/match/:id/enclenchements": "Statistiques d'Enclenchements",
        "/Dashboard/match/:id/statsgenerales": "Statistiques Générales",
        "/Dashboard/joueuse/:id" : "Statistiques joueuse",
        "/Dashboard/match/:id/statistiques" : "Statistiques du match",
        "/Dashboard/match/:id/statistiques/generales": "Statistiques générales",
        "/Dashboard/match/:id/statistiques/analyse-defensive": "Statistiques défensives",
        "/Dashboard/match/:id/statistiques/enclenchements": "Statistiques enclenchements",
        "/Dashboard/match/:id/statistiques/analyse-gb": "Statistiques gardien de but",
        "/Dashboard/calendrier-resultat": "Calendrier et résultats",
        "/Dashboard/match/stats-avancees": "Statistiques avancées",

    };

    const getPageTitle = (pathname) => {
        for (const [pattern, title] of Object.entries(pageTitles)) {
            const match = matchPath(pattern, pathname);
            if (match) {
                return title;
            }
        }
        return "Dashboard";
    };

    const name = getPageTitle(location.pathname);

    useEffect(() => {
        document.title = `SAE501 - ${name}`;
    }, [name]);

    return (
        <SidebarProvider>
            <AppSidebar user={user} logout={logout} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-10">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="lg:hidden h-8 w-8">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </SidebarTrigger>

                        <Separator orientation="vertical" className="lg:hidden mr-2 h-4" />

                        <h1 className="text-xl text-primary">{name}</h1>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-5">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
