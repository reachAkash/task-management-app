import { TaskInterface } from "./task.types";
import { UserInterface } from "./user.types";

export interface ProjectInterface {
  _id: string; // The project's unique identifier (ObjectId in MongoDB, stored as string)
  name: string; // The name of the project
  description: string; // The description of the project
  tasks: TaskInterface[]; // Array of task IDs associated with the project
  members: UserInterface[]; // Array of user IDs representing the members of the project
  createdBy: string; // User ID of the person who created the project
  createdAt: string; // Timestamp when the project was created
  updatedAt: string; // Timestamp when the project was last updated
}
