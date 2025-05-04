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

export interface ProjectInterface {
  _id: string; // The project's unique identifier (ObjectId in MongoDB, stored as string)
  name: string; // The name of the project
  description: string; // The description of the project
  tasks: TaskInterface[]; // Array of task IDs associated with the project
  members: UserInterface[]; // Array of user IDs representing the members of the project
  createdBy: UserInterface; // User ID of the person who created the project
  createdAt: string; // Timestamp when the project was created
  updatedAt: string; // Timestamp when the project was last updated
}

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
