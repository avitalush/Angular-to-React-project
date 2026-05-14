import { z } from "zod";
import type { Task } from "../enum/TaskStatus";
import { TASK_STATUSES, TASK_PRIORITIES } from "../enum/TaskStatus";

// Custom Zod refinements matching Angular validators

const noWhitespaceString = z.string().refine((val) => val.trim().length > 0, {
  message: "Cannot be only whitespace",
});

const validDateString = z.string().refine(
  (val) => {
    if (!val) return true; // Empty is ok (optional)
    const date = new Date(val);
    return !Number.isNaN(date.getTime());
  },
  { message: "Please enter a valid date" },
);

// Main Task Form Schema
export const taskFormSchema = z.object({
  title: noWhitespaceString
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters"),

  status: z.enum(TASK_STATUSES),

  priority: z.enum(TASK_PRIORITIES),

  assignee: z.string().min(1, "Assignee is required"),

  projectId: z.string().min(1, "Project is required"),

  dueDate: validDateString,

  tags: z.string(), // Comma-separated string
});

// Infer TypeScript type from schema
export type TaskFormData = z.infer<typeof taskFormSchema>;

// Helper to convert Task to form data
export const taskToFormData = (task: Task): TaskFormData => {
  return {
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    projectId: task.projectId,
    dueDate: task.dueDate ? toInputDate(task.dueDate) : "",
    tags: task.tags?.join(", ") || "",
  };
};

// Helper to format Date for input[type="date"]
const toInputDate = (date: Date): string => {
  if (!(date instanceof Date)) date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
