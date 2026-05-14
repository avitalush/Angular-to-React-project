import React from "react";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, DragIndicator } from "@mui/icons-material";
import type { Task } from "../../../../enum/TaskStatus";
import { PROJECTS } from "../../../../enum/TaskStatus";
import styles, { priorityColors } from "./TaskCard.style";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
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

  const project = PROJECTS.find((p) => p.id === task.projectId);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const isCompleted = task.status === "done";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(task);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(task);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/tasks/${task.id}`);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="task-card"
      sx={{
        ...styles.card,
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isCompleted ? 0.75 : 1,
        backgroundColor: isCompleted ? "#f5f5f5" : "white",
        borderLeft: isCompleted ? "3px solid #9e9e9e" : "none",
      }}
    >
      <CardContent sx={styles.cardContent}>
        {" "}
        <Box sx={styles.mainContainer}>
          <Box {...attributes} {...listeners} sx={styles.dragHandle}>
            <DragIndicator fontSize="small" color="action" />
          </Box>

          <Box sx={styles.contentBox}>
            <Box sx={{ display: "flex", gap: 0.5, mb: 2.5 }}>
              <Chip
                label={task.priority}
                size="small"
                sx={{
                  ...styles.priorityChip,
                  backgroundColor: priorityColors[task.priority],
                  opacity: isCompleted ? 0.5 : 1,
                }}
              />
              {project && (
                <Chip
                  label={project.name}
                  size="small"
                  sx={{
                    ...styles.projectChip,
                    backgroundColor: project.color,
                    opacity: isCompleted ? 0.5 : 1,
                  }}
                />
              )}
            </Box>

            <Tooltip title={task.title} arrow placement="top">
              <Typography
                variant="subtitle2"
                onClick={handleTitleClick}
                sx={{
                  ...styles.title,
                  textDecoration: isCompleted ? "line-through" : "none",
                  color: isCompleted ? "text.disabled" : "text.primary",
                  mb: 2.5,
                }}
              >
                {task.title}
              </Typography>
            </Tooltip>

            <Box
              sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2.5 }}
            >
              <Chip
                label={task.assignee}
                size="small"
                variant="outlined"
                sx={{
                  ...styles.assigneeChip,
                  opacity: isCompleted ? 0.5 : 1,
                }}
              />
              {task.dueDate && (
                <Typography
                  variant="caption"
                  sx={{
                    ...styles.dueDate,
                    color: isCompleted
                      ? "text.disabled"
                      : isOverdue
                        ? "#ef4444"
                        : "text.secondary",
                    fontWeight: isOverdue ? 600 : 400,
                  }}
                >
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            {task.tags.length > 0 && (
              <Box sx={styles.tagsStack}>
                {task.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="filled"
                    sx={{
                      ...styles.tagChip,
                      opacity: isCompleted ? 0.5 : 1,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box className="task-actions" sx={styles.actionsContainer}>
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={styles.editButton}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              sx={styles.deleteButton}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
