import { ChevronRight } from "lucide-react";

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
import { NavLink } from "react-router";

export function NavMain({
  items
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
          {items.map((item, index) => (
              <SidebarMenuItem key={index}>
                  <NavLink to={item.url}  >
                      <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>

                      </SidebarMenuButton>
                  </NavLink>
              </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
