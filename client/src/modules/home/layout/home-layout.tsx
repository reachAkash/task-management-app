"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClipboardList, Package } from "lucide-react";
import React, { useState } from "react";
import CreateProject from "@/components/CreateProject";
import CreateTask from "@/components/CreateTask";
import InviteTeam from "@/components/InviteTeam";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { promoteToAdminRoute } from "@/axios/apiRoutes";
import { useUserStore } from "@/states/store";
import { toast } from "sonner";
import { useFetchUserData } from "@/hooks/useFetchUserData";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "project" | "task" | "team" | "coming soon" | null
  >(null);
  const { user, fetchUser } = useUserStore();
  const { getUserData } = useFetchUserData();

  const handlePromoteAdmin = async () => {
    try {
      const data = await axiosInstance.put(promoteToAdminRoute, {
        userId: user?._id,
      });
      fetchUser();
      toast.success(data.data.message || "Promoted to Admin successfully");
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  React.useEffect(() => {
    getUserData();
  }, []);

  return (
    <SidebarInset>
      <ResponsiveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          modalType === "project"
            ? "Create Project"
            : modalType === "task"
            ? "Create Task"
            : modalType === "team"
            ? "Invite Team"
            : "coming soon"
        }
      >
        {modalType === "project" && (
          <CreateProject onClose={() => setOpen(false)} />
        )}
        {modalType === "task" && <CreateTask onClose={() => setOpen(false)} />}
        {modalType === "team" && <InviteTeam onClose={() => setOpen(false)} />}
        {modalType === "coming soon" && <p>Dummy modal here!</p>}
      </ResponsiveModal>
      <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {user?.role !== "admin" && (
          <div className="px-4">
            <Button onClick={handlePromoteAdmin}>Become Admin</Button>
          </div>
        )}
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-sm text-muted-foreground">Dashboard</div>
        <div className="flex flex-wrap gap-4">
          <div
            onClick={() => {
              setModalType("project");
              setOpen(true);
            }}
            className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.8rem)] xl:w-[calc(25%-0.8rem)] flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Package className="size-4" />
            </div>
            <div>
              <div className="font-semibold">Create Project</div>
              <div className="text-sm text-muted-foreground">
                Organize task to your project
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setModalType("task");
              setOpen(true);
            }}
            className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.8rem)] xl:w-[calc(25%-0.8rem)] flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <div className="font-semibold">Create Task</div>
              <div className="text-sm text-muted-foreground">
                Organize task to your project
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setModalType("team");
              setOpen(true);
            }}
            className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.8rem)] xl:w-[calc(25%-0.8rem)] flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <div className="font-semibold">Invite Team</div>
              <div className="text-sm text-muted-foreground overflow-hidden truncate">
                Invite team to your project
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              setModalType("coming soon");
              setOpen(true);
            }}
            className="w-full hidden md:block md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.8rem)] xl:w-[calc(25%-0.8rem)] px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <div className="font-semibold">Dummy Data</div>
              <div className="text-sm text-muted-foreground">
                Dummy text here!
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </SidebarInset>
  );
};

export default HomeLayout;
