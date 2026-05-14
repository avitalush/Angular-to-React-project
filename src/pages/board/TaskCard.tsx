import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { Delete, Edit, DragIndicator } from "@mui/icons-material";
import type { Task } from "../../enum/TaskStatus";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const priorityColors = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
  critical: "#9c27b0",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 1.5,
        cursor: isDragging ? "grabbing" : "grab",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box {...attributes} {...listeners} sx={{ cursor: "grab", mt: 0.5 }}>
            <DragIndicator fontSize="small" color="action" />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, fontSize: "0.875rem" }}
              >
                {task.description}
              </Typography>
            )}

            <Stack
              sx={{
                direction: "row",
                spacing: 1,
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              <Chip
                label={task.priority}
                size="small"
                sx={{
                  backgroundColor: priorityColors[task.priority],
                  color: "white",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: "22px",
                }}
              />
              <Chip
                label={task.assignee}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem", height: "22px" }}
              />
              {task.dueDate && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              )}
            </Stack>

            {task.tags.length > 0 && (
              <Stack
                sx={{ direction: "row", spacing: 0.5, mt: 1, flexWrap: "wrap" }}
              >
                {task.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="filled"
                    sx={{
                      backgroundColor: "#e3f2fd",
                      fontSize: "0.7rem",
                      height: "20px",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Box>
            <IconButton size="small" onClick={() => onEdit(task)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(task)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
