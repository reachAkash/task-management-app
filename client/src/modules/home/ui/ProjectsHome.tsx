import { useProjectStore } from "@/states/store";
import { ProjectInterface } from "@/utils/types";
import { ProjectCard } from "./ProjectCard";
import { v4 } from "uuid";

export const ProjectsHome = () => {
  const { projects } = useProjectStore();

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="text-sm text-muted-foreground">Projects</div>
      {projects.length === 0 && (
        <div className="w-full h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
          Loading Projects...
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.length !== 0 &&
          projects?.map((item: ProjectInterface) => (
            <ProjectCard key={v4()} item={item} />
          ))}
      </div>
    </div>
  );
};
