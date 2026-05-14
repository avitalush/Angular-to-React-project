import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Box, Chip } from "@mui/material";
import type { Task, TaskStatus } from "../../enum/TaskStatus";
import { TaskCard } from "./TaskCard";

type ColumnProps = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

const columnColors: Record<TaskStatus, string> = {
  todo: "#e3f2fd",
  "in-progress": "#fff3e0",
  review: "#f3e5f5",
  done: "#e8f5e9",
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
        p: 2,
        backgroundColor: columnColors[status],
        minHeight: 500,
        display: "flex",
        flexDirection: "column",
        border: isOver ? "2px dashed #1976d2" : "2px solid transparent",
        transition: "border 0.2s",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip label={tasks.length} size="small" color="primary" />
      </Box>

      <Box ref={setNodeRef} sx={{ flex: 1 }}>
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
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">No tasks</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
