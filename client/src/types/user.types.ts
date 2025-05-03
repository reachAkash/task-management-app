import { ProjectInterface } from "./project.types";
import { TaskInterface } from "./task.types";

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  isVerified: boolean;
  projects: ProjectInterface[]; // Array of Project _id references
  tasks: TaskInterface[]; // Array of Task _id references
  createdAt: string;
  updatedAt: string;
}
