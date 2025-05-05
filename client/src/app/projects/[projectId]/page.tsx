"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/axios/axiosInstance";
import { getOneProjectRoute, deleteProjectRoute } from "@/axios/apiRoutes";
import { ProjectInterface, UserInterface } from "@/utils/types";
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
import {
  ChevronsLeft,
  Eye,
  GripVertical,
  Lock,
  TimerOff,
  UserRound,
  Users,
} from "lucide-react";
import { TasksSection } from "@/modules/project/ui/TasksSection";
import { useMemberStore, useTaskStore } from "@/states/store";
import { toast } from "sonner";
import Link from "next/link";

const ProjectPage = () => {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [project, setProject] = useState<ProjectInterface | null>(null);
  const { members, setMembers } = useMemberStore();
  const [loading, setLoading] = useState(true);
  const { tasks, setTasks } = useTaskStore();

  const getProjectDetails = async () => {
    try {
      const res = await axiosInstance.get(`${getOneProjectRoute}/${projectId}`);
      setMembers(res?.data?.data?.members);
      setProject(res?.data?.data);
      setTasks(res?.data?.data?.tasks);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await axiosInstance.delete(
        `${deleteProjectRoute}/${projectId}`
      );
      router.push("/");
      toast.success(response.data.message || "Project deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const deadline = () => {
    if (project && project.createdAt) {
      const newDate = new Date(project.createdAt);
      newDate.setDate(newDate.getDate() + 10); // Add 10 days

      const formattedDate = newDate.toISOString().split("T")[0]; // Format the date to "YYYY-MM-DD"
      return formattedDate; // Return the formatted date
    } else {
      return null; // Return null if project or createdAt is null
    }
  };

  useEffect(() => {
    if (projectId) getProjectDetails();
  }, [projectId]);

  if (loading)
    return (
      <div className="w-screen h-screen text-sm text-muted-foreground flex items-center justify-center">
        Loading project...
      </div>
    );
  if (!project)
    return (
      <div className="w-screen h-screen  text-sm text-muted-foreground flex flex-col gap-2 items-center justify-center">
        Project not found.
        <Button>
          <Link href="/">Home</Link>
        </Button>
      </div>
    );

  return (
    <div className="w-full">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Projects</BreadcrumbLink>
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
          <Button
            onClick={() => handleDeleteProject(projectId)}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">{project.description}</p>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <Eye className="size-4" />
              Visibility
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <GripVertical className="size-4" />
              Private
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <UserRound className="size-4" />
              Created by
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <GripVertical className="size-4" />
              {project?.createdBy?.name}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <TimerOff className="size-4" />
              Deadline
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <GripVertical className="size-4" />
              {deadline()}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-fit flex items-center text-sm gap-2 rounded-full px-2 py-1">
              <Users className="size-4" />
              Teams
            </div>
            <div className="w-fit bg-rose-100 text-rose-500 flex items-center text-sm gap-2 border rounded-full px-4 py-1">
              <ChevronsLeft className="size-4" />
              {members && members.length > 0 ? (
                members.map((member: UserInterface, index: number) => (
                  <span key={member._id}>
                    {member.name}
                    {index < members.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>No members assigned</span>
              )}
            </div>
          </div>
        </div>
        <TasksSection tasks={tasks} />
      </main>
    </div>
  );
};

export default ProjectPage;
