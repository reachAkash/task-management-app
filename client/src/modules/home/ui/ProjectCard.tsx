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

interface ProjectCardProps {
  item: ProjectInterface;
}

export const ProjectCard = ({ item }: ProjectCardProps) => {
  const { projects, setProjects, removeProject } = useProjectStore();

  const handleDelete = async (id: string) => {
    try {
      const data = await axiosInstance.delete(`${deleteProjectRoute}/${id}`);
      toast.success(data.data.message);
      removeProject(id);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <Link href={`/projects/${item?._id}`}>
      <Card
        key={item?._id || JSON.stringify(new Date())}
        className="hover:bg-gray-50/60 transition-colors duration-300 cursor-pointer"
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-base">{item?.name}</CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="size-5 text-muted-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleDelete(item._id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription>
            {item?.description?.split(" ").slice(0, 8).join(" ")}
            {item?.description?.split(" ").length > 8 && " ..."}
          </CardDescription>
          <CardFooter>
            <div className="w-full text-sm text-shadow-muted-foreground flex items-center justify-end gap-2">
              <Avatar className="h-5 w-5 rounded-full">
                <AvatarImage src="/userLogo.jpeg" alt={item?.createdBy?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              {item?.createdBy?.name}
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
};
