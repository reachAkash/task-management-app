// TaskBoard.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

const people = [
  { name: "Alice", initials: "AL", color: "bg-blue-500" },
  { name: "Bob", initials: "BO", color: "bg-green-500" },
  { name: "Charlie", initials: "CH", color: "bg-yellow-500" },
];

const initialTasks = [
  {
    id: "1",
    title: "Solutions Pages",
    assignee: people[0],
    dueDate: "March 17 - 09:00AM",
    priority: "Normal Priority",
    status: "not started",
  },
  {
    id: "2",
    title: "Order Flow",
    assignee: people[1],
    dueDate: "March 17 - 09:00AM",
    priority: "High Priority",
    status: "in progress",
  },
  {
    id: "3",
    title: "About Us Illustration",
    assignee: people[2],
    dueDate: "March 17 - 09:00AM",
    priority: "Normal Priority",
    status: "completed",
  },
];

const TaskSection = ({ title, status, tasks, onAssign }: any) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="flex items-center gap-2 mb-3">
      <div
        className={`w-2.5 h-2.5 rounded-full ${
          status === "not started"
            ? "bg-gray-500"
            : status === "in progress"
            ? "bg-yellow-400"
            : "bg-green-500"
        }`}
      />
      <h2 className="font-semibold text-sm capitalize">{title}</h2>
    </div>

    <table className="w-full text-sm">
      <thead>
        <tr className="text-gray-500 border-b text-left">
          <th className="py-2">Name</th>
          <th className="py-2">Assignee</th>
          <th className="py-2">Due Date</th>
          <th className="py-2">Priority</th>
          <th className="py-2 text-right">
            <MoreHorizontal size={16} />
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task: any) => (
          <tr key={task.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{task.title}</td>
            <td className="py-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <div
                      className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center ${task.assignee?.color}`}
                    >
                      {task.assignee?.initials}
                    </div>
                    <span>{task.assignee?.name || "Assign"}</span>
                    <ChevronDown size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandGroup>
                      {people.map((person) => (
                        <CommandItem
                          key={person.name}
                          onSelect={() => onAssign(task.id, person)}
                        >
                          <div
                            className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-2 ${person.color}`}
                          >
                            {person.initials}
                          </div>
                          {person.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </td>
            <td className="py-2">{task.dueDate}</td>
            <td className="py-2">{task.priority}</td>
            <td className="py-2 text-right">
              <MoreHorizontal size={16} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);

  const assignPerson = (taskId: string, person: any) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: person } : t))
    );
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="p-6">
      <TaskSection
        title="Pending"
        status="not started"
        tasks={getTasksByStatus("not started")}
        onAssign={assignPerson}
      />
      <TaskSection
        title="In Progress"
        status="in progress"
        tasks={getTasksByStatus("in progress")}
        onAssign={assignPerson}
      />
      <TaskSection
        title="Completed"
        status="completed"
        tasks={getTasksByStatus("completed")}
        onAssign={assignPerson}
      />
    </div>
  );
}
