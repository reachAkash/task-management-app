"use client";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClipboardList, Package } from "lucide-react";
import React, { useState } from "react";
import CreateProject from "@/components/CreateProject";
import CreateTask from "@/components/CreateTask";
import { ProjectsHome } from "@/modules/home/ui/ProjectsHome";

const page = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "project" | "task" | "team" | null
  >(null);

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
            : "Invite Team"
        }
      >
        {modalType === "project" && (
          <CreateProject onClose={() => setOpen(false)} />
        )}
        {modalType === "task" && <CreateTask onClose={() => setOpen(false)} />}
      </ResponsiveModal>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-sm text-muted-foreground">Dashboard</div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <div
            onClick={() => {
              setModalType("project");
              setOpen(true);
            }}
            className="flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm"
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
            className="flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm"
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
            className="flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm"
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
              setModalType("team");
              setOpen(true);
            }}
            className="flex px-6 py-4 items-center gap-x-4 border cursor-pointer hover:bg-gray-50/60 transition-all ease-in-out duration-300 rounded-lg shadow-sm"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <div className="font-semibold">Dummy Data</div>
              <div className="text-sm text-muted-foreground">
                Invite team to your project
              </div>
            </div>
          </div>
        </div>
        <ProjectsHome />
      </div>
    </SidebarInset>
  );
};

export default page;
