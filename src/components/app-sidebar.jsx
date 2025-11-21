"use client"

import * as React from "react"
import {
    Home,
    MapIcon,
    UserPlus,
    FileUp,
    Users,
    Calendar,
    List,
    SearchCode,
    TrendingUp,
    UserCircle,
    GitCompare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

export function AppSidebar({ user, logout, ...props }) {
    const { isCoach, isJoueuse } = useAuth();

    const coachItems = [
        {
            title: "Accueil",
            url: "/DashBoard",
            icon: Home
        },
        {
            title: "Joueuses",
            url: "/DashBoard/joueuses",
            icon: Users,
        },
        {
            title: "Carte des tirs",
            url: "/DashBoard/StatTir",
            icon: MapIcon,
        },
        {
            title: "Matchs importés",
            url: "/DashBoard/supImport",
            icon: List,
        },
        {
            title: "Statistiques Avancées",
            url: "/DashBoard/match/stats-avancees",
            icon: TrendingUp,
        },
        {
            title: "Importer un match",
            url: "/DashBoard/import",
            icon: FileUp,
        },

        {
            title: "Comparateur",
            url: "/DashBoard/comparateur",
            icon: GitCompare,
        },
        {
            title: "Classements et résultats",
            url: "/DashBoard/calendrier-resultat",
            icon: Calendar,
        },
        {
            title: "Ajouter utilisateur",
            url: "/DashBoard/ajout-utilisateur",
            icon: UserPlus,
        },
    ];

    const joueuseItems = user?.joueuse?.id ? [
        {
            title: "Mon Profil",
            url: `/DashBoard/joueuse/${user.joueuse.id}`,
            icon: UserCircle,
        },
        {
            title: "Carte des tirs",
            url: "/DashBoard/StatTir",
            icon: MapIcon,
        },
        {
            title: "Classements et résultats",
            url: "/DashBoard/calendrier-resultat",
            icon: Calendar,
        },
    ] : [
        {
            title: "Carte des tirs",
            url: "/DashBoard/StatTir",
            icon: MapIcon,
        },
        {
            title: "Classements et résultats",
            url: "/DashBoard/calendrier-resultat",
            icon: Calendar,
        },
    ];

    let navItems = [];

    if (isCoach()) {
        navItems = coachItems;
    } else if (isJoueuse()) {
        navItems = joueuseItems;
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTrigger className="hidden lg:flex bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 items-center justify-center rounded-lg" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser userinfo={user} logout={logout} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
