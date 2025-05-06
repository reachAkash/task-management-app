"use client";
import { AppSidebar } from "../../modules/home/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
