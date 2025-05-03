"use client";

import * as React from "react";
import {
  AudioWaveform,
  Calendar1Icon,
  Command,
  FilesIcon,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  LucidePersonStanding,
  Map,
  PieChart,
  Router,
} from "lucide-react";

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
import {
  getProjectsRoute,
  getUserDataRoute,
  refreshTokenRoute,
} from "@/axios/apiRoutes";
import useUserStore from "@/states/store";
import { Button } from "@/components/ui/button";
import { ProjectInterface } from "@/types/project.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { user, setUser } = useUserStore();
  const [projects, setProjects] = React.useState<ProjectInterface[]>();

  const refreshToken = async () => {
    try {
      const data = await axiosInstance.post(refreshTokenRoute);
      if (data.status == 200) {
        getProjectsData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Session expired! Please Log in.");
      router.push("/login");
    }
  };

  const getProjectsData = async () => {
    console.log("inside 1st func");
    setLoading(true);
    try {
      const data = await axiosInstance.get(`${getProjectsRoute}/`);
      console.log(data.data);
      setProjects(data.data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token expired. Trying refresh...");
        await refreshToken();
      } else {
        console.error("Other error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(user);

  React.useEffect(() => {
    getProjectsData();
  }, []);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain projects={projects} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
