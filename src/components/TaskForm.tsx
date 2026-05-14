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
import { useTaskService } from "../contexts/TaskContext";
import { DEFAULT_TASK_FORM_VALUES } from "../constants/taskFormConstants";
import {
  taskFormSchema,
  type TaskFormData,
  taskToFormData,
} from "../schemas/taskFormSchema";

import styles from "./TaskForm.style";
import { TitleField } from "./task-form-fields/TitleField";
import { DescriptionField } from "./task-form-fields/DescriptionField";
import { StatusPriorityFields } from "./task-form-fields/StatusPriorityFields";
import { AssigneeProjectFields } from "./task-form-fields/AssigneeProjectFields";
import { DueDateField } from "./task-form-fields/DueDateField";
import { TagsField } from "./task-form-fields/TagsField";

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

  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task ? taskToFormData(task) : DEFAULT_TASK_FORM_VALUES,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (task) {
      reset(taskToFormData(task));
    }
  }, [task, reset]);

  const onSubmit = (data: TaskFormData) => {
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

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
      updateTask(task.id, taskData);
    } else {
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
