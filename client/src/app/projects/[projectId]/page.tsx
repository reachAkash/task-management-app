"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/axios/axiosInstance";
import { getOneProjectRoute } from "@/axios/apiRoutes";
import { ProjectInterface } from "@/utils/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Eye, Lock, PersonStanding, UserRound, Users } from "lucide-react";
import TaskTable from "@/modules/project/ui/TaskTable";

const ProjectPage = () => {
  const { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<ProjectInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const getProjectDetails = async () => {
    try {
      const res = await axiosInstance.get(`${getOneProjectRoute}/${projectId}`);
      console.log(res.data.data.tasks);
      setProject(res.data?.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) getProjectDetails();
  }, [projectId]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="w-full">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{project?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="w-full p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <Button variant="destructive">Delete</Button>
        </div>
        <p className="mt-2 text-muted-foreground">{project.description}</p>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <Eye className="size-4" />
              Visibility
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <Lock className="size-4" />
              Private
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <UserRound className="size-4" />
              Created by
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <Lock className="size-4" />
              Private
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <Eye className="size-4" />
              Deadline
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <Lock className="size-4" />
              {new Date().toISOString()}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <Users className="size-4" />
              Teams
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <Lock className="size-4" />
              Private
            </div>
          </div>
        </div>
        <TaskTable />
      </main>
    </div>
  );
};

export default ProjectPage;
