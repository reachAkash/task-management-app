import { TaskInterface } from "@/utils/types";
import { TaskCard } from "./TaskCard";
import { useTaskStore, useUserStore } from "@/states/store";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export const TasksSection = () => {
  const { user } = useUserStore();
  const { tasks } = useTaskStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tasks]);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground mb-1">
          {user?.role === "admin" ? "All Tasks" : "My Tasks"}
        </div>
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="w-full h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
          No Tasks...
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((item: TaskInterface) => (
            <TaskCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
