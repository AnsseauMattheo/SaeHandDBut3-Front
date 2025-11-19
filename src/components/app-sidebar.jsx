"use client"

import * as React from "react"
import {
    Home,
    MapIcon,
    UserPlus,
    FileUp,
    FileX,
    Users,
    Calendar,
    List
    SearchCode,
    TrendingUp,
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

const data = {
    navMain: [
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
            isActive: true,
        },
        {
            title: "Matchs importés",
            url: "/DashBoard/supImport",
            icon: List,
        },
        {
            title: "Importer un match",
            url: "/DashBoard/import",
            icon: FileUp,
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
        {
            title: "Statistiques Avancées",
            url: "/DashBoard/match/stats-avancees",
            icon: TrendingUp,
        },
        {
            title: "Comparateur",
            url: "/DashBoard/comparateur", 
            icon: SearchCode,
        },


    ],
}

export function AppSidebar({ user, logout, ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/* Bouton trigger visible uniquement sur desktop (lg et plus) */}
                <SidebarTrigger className="hidden lg:flex bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 items-center justify-center rounded-lg" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser userinfo={user} logout={logout} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
