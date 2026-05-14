import type { Task, TaskStatus, StatsSnapshot } from "../enum/TaskStatus";

export type TaskContextType = {
  tasks: Task[];

  stats: StatsSnapshot;

  tasksByStatus: Record<TaskStatus, Task[]>;

  getById: (id: string) => Task | undefined;
  addTask: (partial: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (
    id: string,
    changes: Partial<Omit<Task, "id" | "createdAt">>,
  ) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  reorderInColumn: (
    status: TaskStatus,
    previousIndex: number,
    currentIndex: number,
  ) => void;
  reorderTasks: (newTasks: Task[]) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
};
