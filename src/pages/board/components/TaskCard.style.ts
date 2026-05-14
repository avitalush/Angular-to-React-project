import type { SxProps } from "@mui/material";

export const priorityColors: Record<string, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
  critical: "#9c27b0",
};

const card: SxProps = {
  mb: 1.5,
  cursor: "grab",
  position: "relative",
  minHeight: "180px",
  maxHeight: "220px",
  "&:hover": {
    boxShadow: 3,
    "& .task-actions": {
      opacity: 1,
    },
  },
};

const cardContent: SxProps = {
  p: 2,
  "&:last-child": { pb: 2 },
};

const mainContainer: SxProps = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
};

const dragHandle: SxProps = {
  cursor: "grab",
  mt: 0.5,
};

const contentBox: SxProps = {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
};

const title: SxProps = {
  fontWeight: 600,
  mb: 0.5,
  cursor: "pointer",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "&:hover": {
    color: "primary.main",
    textDecoration: "underline",
  },
};

const description: SxProps = {
  mb: 1,
  fontSize: "0.875rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  cursor: "help",
};

const metadataStack: SxProps = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 0.5,
};

const priorityChip: SxProps = {
  color: "white",
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "22px",
};

const projectChip: SxProps = {
  color: "white",
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "22px",
};

const assigneeChip: SxProps = {
  fontSize: "0.75rem",
  height: "22px",
};

const dueDate: SxProps = {
  fontSize: "0.75rem",
};

const tagsStack: SxProps = {
  display: "flex",
  flexDirection: "row",
  gap: 0.5,
  mt: 1,
  flexWrap: "wrap",
  maxHeight: "44px",
  overflow: "hidden",
};

const tagChip: SxProps = {
  backgroundColor: "#e3f2fd",
  fontSize: "0.65rem",
  height: "18px",
  "& .MuiChip-label": {
    px: 0.75,
  },
};

const actionsContainer: SxProps = {
  opacity: 0,
  transition: "opacity 0.2s ease",
  display: "flex",
  gap: 0.5,
};

const editButton: SxProps = {
  "&:hover": {
    backgroundColor: "action.hover",
  },
};

const deleteButton: SxProps = {
  "&:hover": {
    backgroundColor: "#450a0a",
    color: "#f87171",
  },
};

export default {
  card,
  cardContent,
  mainContainer,
  dragHandle,
  contentBox,
  title,
  description,
  metadataStack,
  priorityChip,
  projectChip,
  assigneeChip,
  dueDate,
  tagsStack,
  tagChip,
  actionsContainer,
  editButton,
  deleteButton,
};
