import { useMemo } from "react";
import type { Task, TaskStatus } from "../../../enum/TaskStatus";

type UseTaskFilterProps = {
  tasks: Task[];
  searchQuery: string;
  filterPriority: string;
};

export const useTaskFilter = ({
  tasks,
  searchQuery,
  filterPriority,
}: UseTaskFilterProps) => {
  const tasksByStatus = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filterPriority && task.priority !== filterPriority) return false;
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };

    filtered.forEach((task) => {
      map[task.status].push(task);
    });

    return map;
  }, [tasks, searchQuery, filterPriority]);

  const totalTaskCount = useMemo(() => {
    return Object.values(tasksByStatus).reduce(
      (sum, taskList) => sum + taskList.length,
      0,
    );
  }, [tasksByStatus]);

  return { tasksByStatus, totalTaskCount };
};
