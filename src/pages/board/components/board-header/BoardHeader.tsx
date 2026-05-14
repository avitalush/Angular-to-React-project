import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { BoardFilters } from "../board-filters/BoardFilters";
import styles from "./BoardHeader.style";

type BoardHeaderProps = {
  totalTaskCount: number;
  columnsCount: number;
  searchQuery: string;
  filterPriority: string;
  onSearchChange: (query: string) => void;
  onPriorityChange: (priority: string) => void;
  onAddTask: () => void;
};

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  totalTaskCount,
  columnsCount,
  searchQuery,
  filterPriority,
  onSearchChange,
  onPriorityChange,
  onAddTask,
}) => {
  return (
    <Paper sx={styles.paper}>
      <Box sx={styles.container}>
        <Box>
          <Typography variant="h4" sx={styles.title} gutterBottom>
            Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalTaskCount} tasks across {columnsCount} columns
          </Typography>
        </Box>

        <Box sx={styles.actionsBox}>
          <BoardFilters
            searchQuery={searchQuery}
            filterPriority={filterPriority}
            onSearchChange={onSearchChange}
            onPriorityChange={onPriorityChange}
          />

          <Button variant="contained" startIcon={<Add />} onClick={onAddTask}>
            Add Task
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
