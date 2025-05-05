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
import { deleteProjectRoute } from "@/axios/apiRoutes";
import { TaskInterface, UserInterface } from "@/utils/types";
import { useMemberStore, useUserStore } from "@/states/store";
import { use } from "react";

const statusColors: Record<string, string> = {
  "not started": "bg-gray-300 text-gray-800",
  "in progress": "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
};

const priorityColor: Record<string, string> = {
  high: "bg-red-500 text-white",
  low: "bg-amber-300 text-white",
};

const statusOptions = ["not started", "progress", "completed"];

export const TaskCard = ({ item }: { item: TaskInterface }) => {
  const { user } = useUserStore();
  const { members } = useMemberStore();
  console.log(members);
  console.log(user);
  const handleDelete = async (id: string) => {
    try {
      const data = await axiosInstance.delete(`${deleteProjectRoute}/${id}`);
      toast.success(data.data.message);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleAssign = (name: string) => {
    toast.success(`Task assigned to ${name}`);
  };
  const handleStatusChange = (status: string) => {
    toast.success(`Status changed to "${status}"`);
  };

  console.log(item);

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
            {" "}
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
            {user.role === "admin" && (
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
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {user.role === "admin" && (
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
        <div className="flex -space-x-2">
          <Avatar className="w-6 h-6 border-2 border-white">
            <AvatarImage src="/userLogo.jpeg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>{JSON.stringify(item.assignedTo)}</div>
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
