import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import Connexion from "./Connexion.jsx";
import {Children} from "react";
import App from "@/App.jsx";
import {Outlet} from "react-router";

export default function DashBoard( { user, logout } ) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} logout={logout} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <Outlet />
                    </div>
                </header>
            </SidebarInset>
        </SidebarProvider>
    )
}
