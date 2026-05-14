import { ASSIGNEES, PROJECTS } from "../enum/TaskStatus";
import type { TaskFormData } from "../schemas/taskFormSchema";

export const DEFAULT_TASK_FORM_VALUES: TaskFormData = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: ASSIGNEES[0],
  projectId: PROJECTS[0].id,
  dueDate: "",
  tags: "",
};
