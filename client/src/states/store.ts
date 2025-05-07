import { getSingleUserRoute, getTasksRoute } from "@/axios/apiRoutes";
import { axiosInstance } from "@/axios/axiosInstance";
import { ProjectInterface, TaskInterface, UserInterface } from "@/utils/types";
import { create } from "zustand";

// ---------------------- USER STORE ----------------------
interface UserStore {
  user: UserInterface | null | undefined;
  setUser: (newUser: UserInterface) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
  fetchUser: async () => {
    try {
      const res = await axiosInstance.get(`${getSingleUserRoute}/`);
      set({ user: res.data.data });
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  },
}));

// ---------------------- PROJECT STORE ----------------------
interface ProjectStore {
  projects: ProjectInterface[];
  setProjects: (newProjects: ProjectInterface[]) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  setProjects: (newProjects) => set({ projects: newProjects }),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project._id !== id),
    })),
}));

// ---------------------- TASK STORE ----------------------
interface TaskStore {
  tasks: TaskInterface[];
  setTasks: (newTasks: TaskInterface[]) => void;
  removeTask: (id: string) => void;
  fetchAllTasks: (projectId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (newTasks) => set({ tasks: newTasks }),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),
  fetchAllTasks: async (projectId: string) => {
    try {
      const res = await axiosInstance.get(`${getTasksRoute}/${projectId}`);
      set({ tasks: res.data.data });
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  },
}));

// ---------------------- MEMBER STORE ----------------------
interface MemberStore {
  members: UserInterface[]; // better to type this
  setMembers: (newMembers: UserInterface[]) => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  setMembers: (newMembers) => set({ members: newMembers }),
}));
