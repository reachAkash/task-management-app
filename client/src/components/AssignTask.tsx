"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/axios/axiosInstance";
// import { assignTaskRoute } from "@/axios/apiRoutes"; // your backend POST route
import { useProjectStore, useTaskStore, useMemberStore } from "@/states/store"; // adjust accordingly

interface AssignTaskProps {
  onClose: () => void;
}

const AssignTaskModal = ({ onClose }: AssignTaskProps) => {
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const { projects } = useProjectStore();
  const { tasks } = useTaskStore(); // assumes you filter tasks by selected project
  const { members } = useMemberStore(); // assumes this includes members of the selected project

  //   const handleAssign = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!projectId || !taskId || !userId) return;

  //     setLoading(true);
  //     try {
  //       const { data } = await axiosInstance.post(assignTaskRoute, {
  //         projectId,
  //         taskId,
  //         userId,
  //       });
  //       toast.success(data.message || "Task assigned successfully");
  //       onClose();
  //     } catch (err: any) {
  //       toast.error(err?.response?.data?.message || "Failed to assign task");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <form className="space-y-4 max-w-md">
      {/* Project Select */}
      <div className="space-y-1">
        <Label>Select Project</Label>
        <Select
          value={projectId}
          onValueChange={(val) => {
            setProjectId(val);
            setTaskId(""); // reset when project changes
            setUserId("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project: any) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Select - appears after project is selected */}
      {projectId && (
        <div className="space-y-1">
          <Label>Select Task</Label>
          <Select
            value={taskId}
            onValueChange={(val) => {
              setTaskId(val);
              setUserId("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a task" />
            </SelectTrigger>
            <SelectContent>
              {tasks
                .filter((task: any) => task.projectId === projectId)
                .map((task: any) => (
                  <SelectItem key={task._id} value={task._id}>
                    {task.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* User Select - appears after task is selected */}
      {taskId && (
        <div className="space-y-1">
          <Label>Select User</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a user" />
            </SelectTrigger>
            <SelectContent>
              {members
                .filter((member: any) => member.projects?.includes(projectId))
                .map((member: any) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!projectId || !taskId || !userId || loading}
        className="w-full"
      >
        {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        Assign Task
      </Button>
    </form>
  );
};

export default AssignTaskModal;
