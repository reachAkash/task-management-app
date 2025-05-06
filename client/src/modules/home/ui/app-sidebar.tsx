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
import { axiosInstance } from "@/axios/axiosInstance";
import { getSingleUserRoute, refreshTokenRoute } from "@/axios/apiRoutes";
import { useProjectStore, useUserStore } from "@/states/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { users } = useUsers();
  const { user, setUser } = useUserStore();
  const { projects, setProjects } = useProjectStore();

  const refreshToken = async () => {
    try {
      const data = await axiosInstance.post(refreshTokenRoute);
      if (data.status == 200) {
        getUserData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Session expired! Please Log in.");
      router.push("/login");
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get(`${getSingleUserRoute}/`);
      const userData = data?.data;
      setUser(userData);
      console.log(userData);
      setProjects(userData?.projects || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token expired. Trying refresh...");
        await refreshToken();
      } else {
        console.error("Other error:", err);
      }
    } finally {
    }
  };

  React.useEffect(() => {
    getUserData();
  }, []);

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
