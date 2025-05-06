"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { inviteToProjectRoute } from "@/axios/apiRoutes";
import { Loader2Icon } from "lucide-react";
import { useMemberStore, useProjectStore } from "@/states/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTaskProps {
  onClose: () => void;
}

const CreateTask = ({ onClose }: CreateTaskProps) => {
  const [userId, setUserId] = useState(""); // separate state for user
  const [projectId, setProjectId] = useState(""); // separate state for project
  const [loading, setLoading] = useState(false);

  const { projects } = useProjectStore();
  const { members } = useMemberStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !projectId) {
      toast.error("Please select both user and project");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(inviteToProjectRoute, {
        userId,
        projectId,
      });
      toast.success(data.message || "User invited!");
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId" className="text-sm">
          Select User
        </Label>
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger className="w-full" id="userId">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {members.map((member: any) => (
              <SelectItem key={member._id} value={member._id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectId" className="text-sm">
          Select Project
        </Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-full" id="projectId">
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {projects.map((project: any) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Invite
      </Button>
    </form>
  );
};

export default CreateTask;
