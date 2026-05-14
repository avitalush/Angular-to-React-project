import type { SxProps } from "@mui/material";
import type { TaskStatus } from "../../../enum/TaskStatus";

export const columnColors: Record<TaskStatus, string> = {
  todo: "#e3f2fd",
  "in-progress": "#fff3e0",
  review: "#f3e5f5",
  done: "#e8f5e9",
};

const paper: SxProps = {
  p: 2,
  height: "calc(100vh - 200px)",
  display: "flex",
  flexDirection: "column",
  transition: "border 0.2s",
};

const header: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const title: SxProps = {
  fontWeight: 600,
};

const tasksContainer: SxProps = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  pr: 0.5,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#bdbdbd",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#9e9e9e",
  },
};

const emptyState: SxProps = {
  textAlign: "center",
  py: 4,
  color: "text.secondary",
};

export default {
  paper,
  header,
  title,
  tasksContainer,
  emptyState,
};
