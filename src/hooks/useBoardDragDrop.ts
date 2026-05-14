import { useState, useCallback } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../../../enum/TaskStatus";
import { COLUMN_ORDER } from "../constants/boardConstants";

type UseBoardDragDropProps = {
  tasks: Task[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  reorderTasks: (tasks: Task[]) => void;
};

export const useBoardDragDrop = ({
  tasks,
  updateTaskStatus,
  reorderTasks,
}: UseBoardDragDropProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) {
        setActiveTask(task);
      }
    },
    [tasks],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (COLUMN_ORDER.includes(overId as TaskStatus)) {
        const newStatus = overId as TaskStatus;
        const task = tasks.find((t) => t.id === activeId);
        if (task && task.status !== newStatus) {
          updateTaskStatus(activeId, newStatus);
        }
      }
    },
    [tasks, updateTaskStatus],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (COLUMN_ORDER.includes(overId as TaskStatus)) {
        const newStatus = overId as TaskStatus;
        updateTaskStatus(activeId, newStatus);
        return;
      }

      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const overTask = tasks.find((t) => t.id === overId);

      if (!activeTaskItem || !overTask) return;

      if (activeTaskItem.status !== overTask.status) {
        updateTaskStatus(activeId, overTask.status);
        return;
      }

      if (activeId !== overId) {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);

        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        reorderTasks(newTasks);
      }
    },
    [tasks, updateTaskStatus, reorderTasks],
  );

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
