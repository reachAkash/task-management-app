import { UserInterface } from "./user.types";

export interface TaskInterface {
  _id: string; // MongoDB ObjectId for the task
  title: string; // Title of the task
  description: string; // Description of the task
  assignedTo: UserInterface[]; // Array of user IDs the task is assigned to
  projectId: string; // ID of the project this task belongs to
  status: "not started" | "in progress" | "completed"; // Status of the task
  createdAt: string; // Timestamp when the task was created
  updatedAt: string; // Timestamp when the task was last updated
  __v: number; // Version key from MongoDB
}
