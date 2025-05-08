"use client";

import { useLoadingStore, useProjectStore } from "@/states/store";
import { ProjectInterface } from "@/utils/types";
import { ProjectCard } from "./ProjectCard";

export const ProjectsHome = () => {
  const { projects } = useProjectStore();
  const { loading } = useLoadingStore();
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="text-sm text-muted-foreground">Projects</div>

      {loading || projects.length === 0 ? (
        <div className="w-full h-[30vh] md:h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
          {loading ? "Loading..." : "No Projects..."}
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-4">
          {projects.map((item: ProjectInterface) => (
            <ProjectCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
