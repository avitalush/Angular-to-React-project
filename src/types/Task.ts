export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  tags: string[];
};

export type Project = {
  id: string;
  name: string;
  color: string;
};

export type ActivityEvent = {
  id: string;
  type: "created" | "updated" | "moved" | "completed";
  taskId: string;
  taskTitle: string;
  actor: string;
  timestamp: Date;
  detail: string;
};

export type StatsSnapshot = {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  completionRate: number;
};
