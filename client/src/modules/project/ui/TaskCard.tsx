import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis, Paperclip, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/axios/axiosInstance";
import {
  assignTaskRoute,
  deleteTaskRoute,
  updateTaskRoute,
} from "@/axios/apiRoutes";
import { TaskInterface, UserInterface } from "@/utils/types";
import { useMemberStore, useTaskStore, useUserStore } from "@/states/store";

const statusColors: Record<string, string> = {
  "not started": "bg-gray-300 text-gray-800",
  "in progress": "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
};

const priorityColor: Record<string, string> = {
  high: "bg-red-500 text-white",
  low: "bg-amber-300 text-white",
};

const statusOptions = ["Not started", "In progress", "Completed"];
const priorityOptions = ["High", "Low"];

export const TaskCard = ({ item }: { item: TaskInterface }) => {
  const { user } = useUserStore();
  const { members } = useMemberStore();
  const { tasks, removeTask } = useTaskStore();
  const fetchAllTasks = useTaskStore((state) => state.fetchAllTasks);

  console.log(tasks);

  const handleDelete = async (id: string) => {
    try {
      const data = await axiosInstance.delete(`${deleteTaskRoute}/${id}`);
      toast.success(data.data.message);
      removeTask(id);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleAssign = async (userId: string) => {
    try {
      const res = await axiosInstance.post(assignTaskRoute, {
        taskId: item._id,
        userId,
        projectId: item.projectId, // Ensure item contains `projectId`
      });
      console.log(res.data.data);
      await fetchAllTasks(item.projectId);
      toast.success(res.data.message || "Task assigned successfully");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to assign task. Try again."
      );
    }
  };

  const handleTaskUpdate = async (
    field: "status" | "priority",
    value: string
  ) => {
    try {
      const data = await axiosInstance.put(`${updateTaskRoute}/${item._id}`, {
        [field]: value.toLowerCase(),
      });
      toast.success(data.data.message);
      await fetchAllTasks(item.projectId);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Card className="p-4 bg-white border rounded-xl shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
              priorityColor[item?.priority?.toLowerCase()] ||
              "bg-gray-200 text-gray-700"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {item?.priority}
          </div>

          {/* Status Badge */}
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
              statusColors[item?.status?.toLowerCase()] ||
              "bg-gray-200 text-gray-700"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {item?.status}
          </div>
        </div>

        {/* Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="size-5 text-muted-foreground cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {"role" in user && user.role === "admin" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Assign Task</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40">
                  {members?.map((user: UserInterface) => (
                    <DropdownMenuItem
                      key={user?._id}
                      onClick={() => handleAssign(user?._id)}
                    >
                      {user?.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Modify Status */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Modify Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {statusOptions
                  .filter(
                    (status) =>
                      status.toLowerCase() !== item.status?.toLowerCase()
                  )
                  .map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleTaskUpdate("status", status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Modify Priority */}
            {"role" in user && user.role === "admin" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Modify Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40">
                  {priorityOptions
                    .filter(
                      (priority) =>
                        priority.toLowerCase() !== item.priority?.toLowerCase()
                    )
                    .map((priority) => (
                      <DropdownMenuItem
                        key={priority}
                        onClick={() => handleTaskUpdate("priority", priority)}
                      >
                        {priority}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {"role" in user && user.role === "admin" && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item._id);
                }}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title + Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {item?.description?.split(" ").slice(0, 8).join(" ")}
          {item?.description?.split(" ").length > 8 && "..."}
        </p>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-2">
        {/* Avatar Group */}
        <div className="flex space-x-2">
          <Avatar className="w-6 h-6 border-2 border-white">
            <AvatarImage src="/userLogo.jpeg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>{item?.assignedTo?.name}</div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-4 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <Paperclip className="w-4 h-4" />
            <span>8</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>16</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
