"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { createTaskRoute } from "@/axios/apiRoutes";
import { Loader2Icon } from "lucide-react";
import { useProjectStore } from "@/states/store";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const { projects } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !projectId.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(createTaskRoute, {
        title,
        description,
        projectId,
      });

      toast.success(data.message || "Task created!");
      setTitle("");
      setDescription("");
      setProjectId("");
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
        <Label htmlFor="title" className="text-sm">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
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

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Create Task
      </Button>
    </form>
  );
};

export default CreateTask;
