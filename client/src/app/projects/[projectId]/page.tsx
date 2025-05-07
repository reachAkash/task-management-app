import ProjectLayout from "@/modules/project/layout/project-layout";
import { TasksSection } from "@/modules/project/ui/TasksSection";
import React from "react";

const page = () => {
  return (
    <ProjectLayout>
      <TasksSection />
    </ProjectLayout>
  );
};

export default page;
