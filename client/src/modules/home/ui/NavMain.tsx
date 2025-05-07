"use client";

import {
  ChevronRight,
  CrownIcon,
  FilesIcon,
  LucidePersonStanding,
  Trash2,
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
import { useUserStore } from "@/states/store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { deleteUserRoute } from "@/axios/apiRoutes";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers"; // Using your hook

interface NavMainProps {
  projects?: ProjectInterface[];
}

interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url?: string; role?: string; id?: string }[];
}

export function NavMain({ projects = [] }: NavMainProps) {
  const { user } = useUserStore();
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [open, setOpen] = useState(false);

  // ✅ Get users and loading state from the hook
  const { users, setUsers } = useUsers();

  // Compute navMainData dynamically from the hook
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
      icon: LucidePersonStanding,
      items: users.map((user) => ({
        title: user?.name,
        role: user?.role,
        id: user?._id,
      })),
    },
  ];

  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      console.error("User ID is required");
      return;
    }

    try {
      const { data } = await axiosInstance.post(deleteUserRoute, {
        userId,
      });
      console.log(data);
      toast.success(data.message);
      const updatedUsers = users.filter((u) => u._id !== userId);
      setUsers(updatedUsers);
      setSelectedUser(null);
      setOpen(false);
    } catch (error: any) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <SidebarGroup>
      <ResponsiveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Are you sure!"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="font-semibold">{`Remove ${selectedUser?.name} from organization`}</div>
          <Button
            onClick={() =>
              selectedUser?._id && handleDeleteUser(selectedUser._id)
            }
            variant="destructive"
          >
            Remove
          </Button>
        </div>
      </ResponsiveModal>

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
                          <div
                            className={cn(
                              `flex items-center gap-2 p-2 rounded-md ${
                                subItem.role === "admin" &&
                                "bg-amber-300 text-muted-foreground"
                              }`
                            )}
                          >
                            {subItem.role === "admin" && (
                              <span className="flex items-center gap-1">
                                <CrownIcon className="size-4 text-orange-800" />
                              </span>
                            )}

                            <span className="flex-1 truncate">
                              {subItem.title}
                            </span>

                            {subItem.id === user?._id && (
                              <span className="text-[9px] text-gray-500">
                                (You)
                              </span>
                            )}

                            {subItem.role === "user" &&
                              subItem.id !== user?._id && (
                                <Trash2
                                  onClick={() => {
                                    setOpen(true);
                                    const foundUser = users.find(
                                      (u) => u._id === subItem.id
                                    );
                                    setSelectedUser(foundUser ?? null);
                                  }}
                                  className="cursor-pointer text-red-500 hover:text-red-600"
                                />
                              )}
                          </div>
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
