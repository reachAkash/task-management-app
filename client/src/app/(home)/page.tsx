import HomeLayout from "@/modules/home/layout/home-layout";
import { ProjectsHome } from "@/modules/home/ui/ProjectsHome";
import React from "react";

const Page = () => {
  return (
    <HomeLayout>
      <ProjectsHome />
    </HomeLayout>
  );
};

export default Page;
