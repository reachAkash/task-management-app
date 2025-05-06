"use client";

import * as React from "react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useProjectStore, useUserStore } from "@/states/store";
import { useUsers } from "@/hooks/useUsers";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { users } = useUsers();
  const { user } = useUserStore();
  const { projects } = useProjectStore();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={projects} users={users} />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
