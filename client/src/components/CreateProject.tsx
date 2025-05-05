"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { createProjectRoute } from "@/axios/apiRoutes";
import { Loader2Icon } from "lucide-react";
import { useProjectStore } from "@/states/store";
import { ProjectInterface } from "@/utils/types";

interface CreateProjectProps {
  onClose: () => void;
}

const CreateProject = ({ onClose }: CreateProjectProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { projects, setProjects } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim() == "" || description.trim() == "") {
      toast.error("Valid details required!");
      return;
    }
    setLoading(true);
    try {
      const data = await axiosInstance.post(createProjectRoute, {
        projectName,
        description,
      });
      toast.success(data.data.message || "Project created!");
      setProjects([...projects, data.data.data]);
      setProjectName("");
      setDescription("");
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
        <Label htmlFor="projectName" className="text-sm">
          Project Name
        </Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project"
          rows={30}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2Icon className="animate-spin" />}Create Project
      </Button>
    </form>
  );
};

export default CreateProject;
