import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"

export default function DashBoard({ user, logout }) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} logout={logout} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-10">
                    <div className="flex items-center gap-2 px-4">
                        {/* Bouton trigger visible uniquement sur mobile */}
                        <SidebarTrigger className="lg:hidden h-8 w-8">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </SidebarTrigger>

                        {/* Separator caché sur desktop */}
                        <Separator orientation="vertical" className="lg:hidden mr-2 h-4" />

                        <h1 className="text-base sm:text-lg font-semibold">Dashboard</h1>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-5">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
