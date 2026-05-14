import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Box, Chip } from "@mui/material";
import type { Task, TaskStatus } from "../../../enum/TaskStatus";
import { TaskCard } from "./TaskCard";
import styles, { columnColors } from "./Column.style";

type ColumnProps = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

export const Column: React.FC<ColumnProps> = ({
  status,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Paper
      sx={{
        ...styles.paper,
        backgroundColor: columnColors[status],
        border: isOver ? "2px dashed #1976d2" : "2px solid transparent",
      }}
    >
      <Box sx={styles.header}>
        <Typography variant="h6" sx={styles.title}>
          {title}
        </Typography>
        <Chip label={tasks.length} size="small" color="primary" />
      </Box>

      <Box ref={setNodeRef} sx={styles.tasksContainer}>
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <Box sx={styles.emptyState}>
            <Typography variant="body2">No tasks</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
