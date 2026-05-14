import type { FC, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs from "dayjs";
import type { StatsSnapshot, Task, TaskStatus } from "../enum/TaskStatus";
import type { TaskContextType } from "../types/TaskContext";
import {
  ASSIGNEES,
  PROJECTS,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from "../enum/TaskStatus";
import { generateId, randomFrom } from "../utils/helpers";
import { STORAGE_KEY } from "../constants/storageConstants";
import { TAG_POOL, TASK_TITLES } from "../constants/seedData";

const seedTasks = (): Task[] => {
  const now = new Date();

  return TASK_TITLES.map((title: string, i: number) => {
    const createdAt = dayjs(now)
      .subtract(20 - i, "days")
      .toDate();
    const dueDays = Math.floor(Math.random() * 30) - 5;
    return {
      id: generateId(),
      title,
      description: `This task covers the work needed for: ${title.toLowerCase()}. Acceptance criteria are defined in the linked spec doc.`,
      status: randomFrom(TASK_STATUSES),
      priority: randomFrom(TASK_PRIORITIES),
      assignee: randomFrom(ASSIGNEES),
      projectId: randomFrom(PROJECTS).id,
      createdAt,
      updatedAt: dayjs(createdAt)
        .add(Math.random() * 5, "days")
        .toDate(),
      dueDate: dayjs(now).add(dueDays, "days").toDate(),
      tags: [randomFrom(TAG_POOL), randomFrom(TAG_POOL)].filter(
        (v, i, a) => a.indexOf(v) === i,
      ),
    };
  });
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        return parsed.map((t) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        }));
      }
    } catch (error) {
      console.warn("Failed to load tasks from localStorage:", error);
    }
    return seedTasks();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn("Failed to persist tasks to localStorage:", error);
    }
  }, [tasks]);

  const taskStatistics = useMemo((): StatsSnapshot => {
    const now = new Date();
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    return {
      total,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done,
      overdue: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done",
      ).length,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    };
  }, [tasks]);

  const tasksByStatus = useMemo((): Record<TaskStatus, Task[]> => {
    return tasks.reduce(
      (map, task) => {
        map[task.status].push(task);
        return map;
      },
      {
        todo: [],
        "in-progress": [],
        review: [],
        done: [],
      } as Record<TaskStatus, Task[]>,
    );
  }, [tasks]);

  const getById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((t) => t.id === id);
    },
    [tasks],
  );

  const addTask = useCallback(
    (partial: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
      const now = new Date();
      const task: Task = {
        ...partial,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prevTasks) => [...prevTasks, task]);
      return task;
    },
    [],
  );

  const updateTask = useCallback(
    (id: string, changes: Partial<Omit<Task, "id" | "createdAt">>): void => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === id ? { ...t, ...changes, updatedAt: new Date() } : t,
        ),
      );
    },
    [],
  );

  const moveTask = useCallback(
    (id: string, newStatus: TaskStatus): void => {
      updateTask(id, { status: newStatus });
    },
    [updateTask],
  );

  const deleteTask = useCallback((id: string): void => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  }, []);

  const reorderInColumn = useCallback(
    (status: TaskStatus, previousIndex: number, currentIndex: number): void => {
      setTasks((prevTasks) => {
        const columnTasks = prevTasks.filter((t) => t.status === status);
        const otherTasks = prevTasks.filter((t) => t.status !== status);
        const [moved] = columnTasks.splice(previousIndex, 1);
        columnTasks.splice(currentIndex, 0, moved);
        return [...otherTasks, ...columnTasks];
      });
    },
    [],
  );

  const reorderTasks = useCallback((newTasks: Task[]): void => {
    setTasks(newTasks);
  }, []);

  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus): void => {
      moveTask(id, status);
    },
    [moveTask],
  );

  const value = useMemo(
    () => ({
      tasks,
      stats: taskStatistics,
      tasksByStatus,
      getById,
      addTask,
      updateTask,
      moveTask,
      deleteTask,
      reorderInColumn,
      reorderTasks,
      updateTaskStatus,
    }),
    [
      tasks,
      taskStatistics,
      tasksByStatus,
      getById,
      addTask,
      updateTask,
      moveTask,
      deleteTask,
      reorderInColumn,
      reorderTasks,
      updateTaskStatus,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskService = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskService must be used within TaskProvider");
  }
  return context;
};
