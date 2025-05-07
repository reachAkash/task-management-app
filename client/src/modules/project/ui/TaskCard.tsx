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
import { Ellipsis, AlertCircle, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/axios/axiosInstance";
import { assignTaskRoute, deleteTaskRoute } from "@/axios/apiRoutes";
import { TaskInterface, UserInterface } from "@/utils/types";
import { useMemberStore, useTaskStore, useUserStore } from "@/states/store";
import { useState } from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import UpdateTask from "@/components/UpdateTask";

const statusColors: Record<string, string> = {
  "not started": "bg-gray-300 text-gray-800",
  "in progress": "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
};

const priorityColor: Record<string, string> = {
  high: "bg-red-500 text-white",
  medium: "bg-purple-500 text-white",
  low: "bg-amber-300 text-white",
};

export const TaskCard = ({ item }: { item: TaskInterface }) => {
  const { user } = useUserStore();
  const { members } = useMemberStore();
  const { removeTask } = useTaskStore();
  const fetchAllTasks = useTaskStore((state) => state.fetchAllTasks);
  const [open, setOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const descriptionWords = item.description?.split(" ") || [];
  const shouldShowToggle = descriptionWords.length > 8;

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
        projectId: item.projectId,
      });
      await fetchAllTasks(item.projectId);
      toast.success(res.data.message || "Task assigned successfully");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to assign task. Try again."
      );
    }
  };

  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let deadlineColor = "text-green-600"; // default future color

    if (daysLeft < 0) {
      deadlineColor = "text-red-600"; // past
    } else if (daysLeft === 0) {
      deadlineColor = "text-red-500"; // due today
    } else if (daysLeft <= 3) {
      deadlineColor = "text-orange-500"; // soon
    } else if (daysLeft <= 7) {
      deadlineColor = "text-amber-500"; // moderate
    }

    return { daysLeft, deadlineDate, deadlineColor };
  };

  const getDisplayedDescription = () => {
    if (showFullDesc) return item.description;
    return (
      descriptionWords.slice(0, 8).join(" ") + (shouldShowToggle ? "..." : "")
    );
  };

  return (
    <>
      {/* Edit Task Modal */}
      <ResponsiveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Update task"
      >
        <UpdateTask onClose={() => setOpen(false)} taskId={item._id} />
      </ResponsiveModal>

      <Card
        onClick={() => setOpen(true)}
        className={`p-4 bg-white border cursor-pointer rounded-xl shadow-sm space-y-3 hover:bg-gray-50/60 transition-all duration-300 group ${
          showFullDesc ? "min-h-fit" : "max-h-[250px]"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                priorityColor[item?.priority?.toLowerCase()] ||
                "bg-gray-200 text-gray-700"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {item?.priority}
            </div>

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

          {user?.role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <Ellipsis className="size-5 text-muted-foreground cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onClick={(e) => e.stopPropagation()}
                align="end"
                className="w-48"
              >
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Assign Task</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    {members?.map((user: UserInterface) => (
                      <DropdownMenuItem
                        key={user?._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssign(user?._id);
                        }}
                      >
                        {user?.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">
            {getDisplayedDescription()}
          </p>
          {shouldShowToggle && (
            <button
              onClick={() => setShowFullDesc((prev) => !prev)}
              className="text-xs text-blue-500 mt-1 hover:underline focus:outline-none"
            >
              {showFullDesc ? "See less..." : "See more..."}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col text-sm text-gray-700">
            <span className="text-xs text-gray-500 mb-1">Assigned to:</span>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-800">
                {item?.assignedTo?.name ? (
                  <span className="text-[12px] font-semibold">
                    {item?.assignedTo?.name}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    none
                  </span>
                )}
              </div>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src="/userLogo.jpeg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            {item.deadline &&
              (() => {
                const { deadlineDate, deadlineColor } = getDeadlineColor(
                  item.deadline
                );
                return (
                  <div className={`text-xs ${deadlineColor}`}>
                    Due: {deadlineDate.toLocaleDateString()}
                  </div>
                );
              })()}

            <div
              onClick={() => setOpen(true)}
              className="bg-primary/10 hidden group-hover:block rounded-full p-2 cursor-pointer"
            >
              <SquarePen className="size-4 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
