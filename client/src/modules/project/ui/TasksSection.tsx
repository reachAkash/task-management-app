import { TaskInterface } from "@/utils/types";
import { TaskCard } from "./TaskCard";

interface TasksSectionProps {
  tasks: TaskInterface[];
}

export const TasksSection = ({ tasks }: TasksSectionProps) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="text-sm text-muted-foreground">Tasks</div>
      {tasks.length === 0 && (
        <div className="w-full h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
          No Tasks...
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tasks?.map((item: TaskInterface) => (
          <TaskCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};
