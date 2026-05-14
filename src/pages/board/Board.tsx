import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Box, Container } from "@mui/material";
import { useCallback, useState, type FC } from "react";
import { TaskForm } from "../../components/TaskForm";
import { useTaskService } from "../../contexts/TaskContext";
import type { Task } from "../../enum/TaskStatus";
import styles from "./Board.style";
import { BoardColumns } from "./components/board-columns/BoardColumns";
import { BoardHeader } from "./components/board-header/BoardHeader";
import { TaskCard } from "./components/task-card/TaskCard";
import { COLUMN_ORDER } from "./constants/boardConstants";
import { useBoardDragDrop } from "./hooks/useBoardDragDrop";
import { useTaskFilter } from "./hooks/useTaskFilter";

export const Board: FC = () => {
  const { tasks, deleteTask, updateTaskStatus, reorderTasks } =
    useTaskService();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
