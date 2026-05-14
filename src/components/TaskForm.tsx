import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Task } from "../enum/TaskStatus";
import { ASSIGNEES, PROJECTS } from "../enum/TaskStatus";
import { useTaskService } from "../contexts/TaskContext";
import {
  taskFormSchema,
  type TaskFormData,
  taskToFormData,
} from "../schemas/taskFormSchema";
import {
  TitleField,
  DescriptionField,
  StatusPriorityFields,
  AssigneeProjectFields,
  DueDateField,
  TagsField,
} from "./task-form-fields";
import styles from "./TaskForm.style";

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSaved?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onClose,
  onSaved,
}) => {
  const { addTask, updateTask } = useTaskService();
  const isEdit = !!task;

  // Initialize form with react-hook-form + zod validation
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? taskToFormData(task)
      : {
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          assignee: ASSIGNEES[0],
          projectId: PROJECTS[0].id,
          dueDate: "",
          tags: "",
        },
  });

  const { handleSubmit, reset } = methods;

  // Reset form when task changes (for edit mode)
  useEffect(() => {
    if (task) {
      reset(taskToFormData(task));
    }
  }, [task, reset]);

  // Handle form submission
  const onSubmit = (data: TaskFormData) => {
    // Parse tags from comma-separated string
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

    // Parse due date
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const taskData = {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      projectId: data.projectId,
      dueDate,
      tags,
    };

    if (isEdit && task) {
      // Update existing task
      updateTask(task.id, taskData);
    } else {
      // Create new task
      addTask(taskData);
    }

    onSaved?.();
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Task" : "New Task"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            <Stack spacing={2}>
              <TitleField />
              <DescriptionField />
              <StatusPriorityFields />
              <AssigneeProjectFields />
              <DueDateField />
              <TagsField />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Save Changes" : "Create Task"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
