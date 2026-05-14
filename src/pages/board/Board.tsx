import React, { useState, useCallback } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Container } from "@mui/material";
import type { Task } from "../../enum/TaskStatus";
import { useTaskService } from "../../contexts";
import { BoardHeader } from "./components/BoardHeader";
import { BoardColumns } from "./components/BoardColumns";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "../../components/TaskForm";
import { useTaskFilter } from "./hooks/useTaskFilter";
import { useBoardDragDrop } from "./hooks/useBoardDragDrop";
import { COLUMN_ORDER } from "./constants/boardConstants";
import styles from "./Board.style";

export const Board: React.FC = () => {
  const { tasks, deleteTask, updateTaskStatus, reorderTasks } =
    useTaskService();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Custom hooks
  const { tasksByStatus, totalTaskCount } = useTaskFilter({
    tasks,
    searchQuery,
    filterPriority,
  });

  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDrop({
    tasks,
    updateTaskStatus,
    reorderTasks,
  });

  // Event handlers
  const handleDeleteTask = useCallback(
    (task: Task) => {
      deleteTask(task.id);
    },
    [deleteTask],
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  }, []);

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, []);

  const handleCloseTaskForm = useCallback(() => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  }, []);

  return (
    <Box sx={styles.root}>
      <Container maxWidth="xl">
        <BoardHeader
          totalTaskCount={totalTaskCount}
          columnsCount={COLUMN_ORDER.length}
          searchQuery={searchQuery}
          filterPriority={filterPriority}
          onSearchChange={setSearchQuery}
          onPriorityChange={setFilterPriority}
          onAddTask={handleAddTask}
        />

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <BoardColumns
            tasksByStatus={tasksByStatus}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />

          <DragOverlay>
            {activeTask ? (
              <Box sx={styles.dragOverlayCard}>
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>

        {isTaskFormOpen && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseTaskForm}
            onSaved={handleCloseTaskForm}
          />
        )}
      </Container>
    </Box>
  );
};
