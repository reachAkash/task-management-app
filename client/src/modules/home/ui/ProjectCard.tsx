import { Ellipsis } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useProjectStore } from "@/states/store";
import { ProjectInterface } from "@/utils/types";
import { toast } from "sonner";
import { axiosInstance } from "@/axios/axiosInstance";
import { deleteProjectRoute } from "@/axios/apiRoutes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useState } from "react";

interface ProjectCardProps {
  item: ProjectInterface;
}

export const ProjectCard = ({ item }: ProjectCardProps) => {
  const { removeProject } = useProjectStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const data = await axiosInstance.delete(`${deleteProjectRoute}/${id}`);
      toast.success(data.data.message);
      removeProject(id);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={`/projects/${item?._id}`}
      className="w-full sm:w-[48%] lg:w-[30%] xl:w-[32%] 2xl:w-[32%] flex-grow-0"
    >
      <Card className="h-full min-h-[180px] hover:bg-gray-50/60 transition-colors duration-300 cursor-pointer flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-base truncate max-w-[80%]">
            {item?.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="size-5 text-muted-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onClick={(e) => e.stopPropagation()}
              align="start"
            >
              <DropdownMenuItem
                disabled={loading}
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  e.preventDefault();
                  handleDelete(item._id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="clamp-3">
            {item?.description?.split(" ").slice(0, 10).join(" ")}
            {item?.description?.split(" ").length > 8 && "..."}
          </CardDescription>
        </CardContent>

        <CardFooter className="mt-auto pt-2">
          <div className="w-full text-sm text-muted-foreground flex items-center justify-end gap-2">
            <Avatar className="h-5 w-5 rounded-full">
              <AvatarImage src="/userLogo.jpeg" alt={item?.createdBy?.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            {item?.createdBy?.name}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
