"use client";

import React from "react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "@/modules/home/ui/AppSidebar";
import { usePathname, notFound } from "next/navigation";
import { Button } from "react-day-picker";

const SidebarComponent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
};

export default SidebarComponent;
