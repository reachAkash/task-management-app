"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios/axiosInstance";
import { toast } from "sonner";
import { updateTaskRoute } from "@/axios/apiRoutes";
import { Loader2Icon } from "lucide-react";
import { useProjectStore, useTaskStore } from "@/states/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectInterface } from "@/utils/types";
import { useParams } from "next/navigation";
import { priorityOptions, statusOptions } from "@/utils/constants";

interface UpdateTaskProps {
  onClose: () => void;
  taskId: string;
}

const UpdateTask = ({ onClose, taskId }: UpdateTaskProps) => {
  const { projectId: paramsProjectId } = useParams() as { projectId: string };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { projects } = useProjectStore();
  const { fetchAllTasks } = useTaskStore();
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const nullifyState = () => {
    setTitle("");
    setDescription("");
    setProjectId("");
    setPriority("");
    setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() &&
      !description.trim() &&
      !projectId.trim() &&
      !status &&
      !priority
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`${updateTaskRoute}/${taskId}`, {
        title,
        description,
        deadline,
        priority: priority.toLowerCase(),
        status: status.toLowerCase(),
      });
      console.log(data);
      toast.success(data.message || "Task updated!");
      nullifyState();
      setDeadline(undefined);
      fetchAllTasks(projectId);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProjectId(paramsProjectId);
  }, [paramsProjectId]);

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
        />
      </div>

      {!paramsProjectId && (
        <div className="space-y-2">
          <Label htmlFor="projectId" className="text-sm">
            Select Project
          </Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-full" id="projectId">
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {projects.map((project: ProjectInterface) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Deadline */}
      <div className="space-y-2">
        <Label htmlFor="deadline" className="text-sm">
          Deadline
        </Label>
        <Input
          id="deadline"
          type="date"
          value={deadline ? deadline.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setDeadline(e.target.value ? new Date(e.target.value) : undefined)
          }
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm">
          Priority
        </Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm">
          Status
        </Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
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
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Create Task
      </Button>
    </form>
  );
};

export default UpdateTask;
