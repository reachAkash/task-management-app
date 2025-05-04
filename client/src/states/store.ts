// store.ts
import { ProjectInterface, UserInterface } from "@/utils/types";
import { create } from "zustand";

// Define the type for the state and actions
interface UserStore {
  user: any;
  setUser: (newUser: any) => void;
}

interface ProjectStore {
  projects: ProjectInterface[] | [];
  setProjects: (newProject: any) => void;
}

// Create the store using Zustand's create function

export const useUserStore = create<UserStore>((set) => ({
  user: {},
  setUser: (newUser) => set({ user: newUser }), // Function to update the state
}));

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (newProject) => set({ projects: newProject }), // Function to update the state
}));
