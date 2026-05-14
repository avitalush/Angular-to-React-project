import React from "react";
import { Box } from "@mui/material";
import type { Task, TaskStatus } from "../../../enum/TaskStatus";
import { Column } from "../column/Column";
import { COLUMN_ORDER, COLUMN_LABELS } from "../../../constants/boardConstants";
import styles from "./BoardColumns.style";

type BoardColumnsProps = {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
};

export const BoardColumns: React.FC<BoardColumnsProps> = ({
  tasksByStatus,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Box sx={styles.container}>
      {COLUMN_ORDER.map((status) => (
        <Box key={status} sx={styles.columnWrapper}>
          <Column
            status={status}
            title={COLUMN_LABELS[status]}
            tasks={tasksByStatus[status]}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </Box>
      ))}
    </Box>
  );
};
