import { z } from "zod";
import dayjs from "dayjs";
import type { Task } from "../enum/TaskStatus";
import { TASK_STATUSES, TASK_PRIORITIES } from "../enum/TaskStatus";

const noWhitespaceString = z
  .string()
  .min(1, "This field is required")
  .refine((val) => val.trim().length > 0, {
    message: "Cannot be only whitespace",
  });

const validDateString = z.string().refine(
  (val) => {
    if (!val) return true;
    const date = new Date(val);
    return !Number.isNaN(date.getTime());
  },
  { message: "Please enter a valid date" },
);

export const taskFormSchema = z.object({
  title: noWhitespaceString
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),

  description: z.string().max(500, "Description cannot exceed 500 characters"),

  status: z.enum(TASK_STATUSES),

  priority: z.enum(TASK_PRIORITIES),

  assignee: z.string().min(1, "Assignee is required"),

  projectId: z.string().min(1, "Project is required"),

  dueDate: validDateString,

  tags: z.string(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export const taskToFormData = (task: Task): TaskFormData => {
  return {
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    projectId: task.projectId,
    dueDate: task.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : "",
    tags: task.tags?.join(", ") || "",
  };
};
