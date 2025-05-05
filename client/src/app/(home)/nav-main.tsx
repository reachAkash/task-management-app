"use client";

import {
  ChevronRight,
  FilesIcon,
  LucidePersonStanding,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { v4 as uuidv4 } from "uuid";
import { ProjectInterface, UserInterface } from "@/utils/types";

interface NavMainProps {
  projects?: ProjectInterface[];
  users?: UserInterface[];
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export function NavMain({ projects = [], users = [] }: NavMainProps) {
  const navMainData: NavItem[] = [
    {
      title: "Projects",
      url: "#",
      isActive: true,
      icon: FilesIcon,
      items: projects.map((project) => ({
        title: project?.name,
        url: `/projects/${project?._id}`,
      })),
    },
    {
      title: "Members",
      url: "#",
      icon: LucidePersonStanding,
      items: users.map((user) => ({
        title: user?.name,
        url: "#", // Replace with actual member URL if needed
      })),
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {navMainData.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item?.title}>
                  {item?.icon && <item.icon />}
                  <span>{item?.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item?.items && item?.items?.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item?.items?.map((subItem) => (
                      <SidebarMenuSubItem key={uuidv4()}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem?.url}>
                            <span>{subItem?.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
