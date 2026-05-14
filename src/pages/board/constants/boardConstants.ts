import type { TaskStatus } from "../../../enum/TaskStatus";

export const COLUMN_ORDER: TaskStatus[] = [
  "todo",
  "in-progress",
  "review",
  "done",
];

export const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_OPTIONS = [
  { value: "", label: "All priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;
