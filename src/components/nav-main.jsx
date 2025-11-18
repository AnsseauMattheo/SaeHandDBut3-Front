"use client"

import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";

export function NavMain({ items }) {
    const location = useLocation();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item, index) => {
                    const isActive = location.pathname === item.url;

                    return (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                                className="data-[active=true]:bg-primary data-[active=true]:text-white"
                            >
                                <Link to={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
