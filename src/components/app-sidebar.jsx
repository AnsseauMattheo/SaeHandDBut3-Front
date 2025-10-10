"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Banana,
    Beer,
    Home,
    MapIcon,
    UserPlus,
    FileUp,
    FileX,
    Users,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail, SidebarTrigger,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Accueil",
            url : "/DashBoard",
            icon: Home
        },
        {
            title: "Carte des tirs",
            url: "/DashBoard/StatTir",
            icon: MapIcon,
            isActive: true,
        },
        {
            title: "Importer",
            url: "/DashBoard/import",
            icon: FileUp,
        },
        {
            title: "Ajouter utilisateur",
            url: "/DashBoard/ajout-utilisateur",
            icon: UserPlus,
        },
        {
            title: "Supprimer import",
            url: "/DashBoard/supImport",
            icon: FileX,
        },
        {
            title: "Joueuses",
            url: "/DashBoard/joueuses",
            icon: Users,
        }
    ],
}

export function AppSidebar({user, logout, ...props}) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTrigger
                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser userinfo={user} logout={logout} />
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}
