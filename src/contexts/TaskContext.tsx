import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import type { FC, ReactNode } from "react";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  StatsSnapshot,
} from "../enum/TaskStatus";
import { ASSIGNEES, PROJECTS } from "../enum/TaskStatus";
import { generateId, randomFrom } from "../utils";

const STORAGE_KEY = "pm_tasks";

// ========== Seed Data (exact copy from Angular) ==========

const seedTasks = (): Task[] => {
  const statuses: TaskStatus[] = ["todo", "in-progress", "review", "done"];
  const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];
  const tagPool = [
    "bug",
    "feature",
    "docs",
    "refactor",
    "test",
    "ux",
    "perf",
    "security",
  ];

  const titles = [
    "Implement user authentication flow",
    "Fix pagination bug on dashboard",
    "Refactor API response caching",
    "Add unit tests for payment module",
    "Design new onboarding screens",
    "Migrate database to PostgreSQL",
    "Set up CI/CD pipeline",
    "Resolve memory leak in worker service",
    "Update API documentation",
    "Implement dark mode support",
    "Add CSV export feature",
    "Fix broken layout on mobile",
    "Code review for PR #241",
    "Performance audit on search endpoint",
    "Write E2E tests for checkout flow",
    "Integrate third-party analytics SDK",
    "Sync translations for 5 locales",
    "Harden input validation across forms",
    "Investigate flaky test in CI",
    "Deploy hotfix to staging",
  ];

  const now = new Date();

  return titles.map((title, i) => {
    const createdAt = new Date(now.getTime() - (20 - i) * 24 * 60 * 60 * 1000);
    const dueDays = Math.floor(Math.random() * 30) - 5;
    return {
      id: generateId(),
      title,
      description: `This task covers the work needed for: ${title.toLowerCase()}. Acceptance criteria are defined in the linked spec doc.`,
      status: randomFrom(statuses),
      priority: randomFrom(priorities),
      assignee: randomFrom(ASSIGNEES),
      projectId: randomFrom(PROJECTS).id,
      createdAt,
      updatedAt: new Date(
        createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000,
      ),
      dueDate: new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000),
      tags: [randomFrom(tagPool), randomFrom(tagPool)].filter(
        (v, i, a) => a.indexOf(v) === i,
      ),
    };
  });
};

// ========== Context Type ==========

type TaskContextType = {
  // Angular: readonly tasks = this._tasks.asReadonly()
  // React: direct state access (already readonly via const)
  tasks: Task[];

  // Angular: readonly stats = computed(...)
  // React: useMemo for derived state
  stats: StatsSnapshot;

  // Angular: readonly tasksByStatus = computed(...)
  // React: useMemo for derived state
  tasksByStatus: Record<TaskStatus, Task[]>;

  // Methods (same as Angular service)
  getById: (id: string) => Task | undefined;
  addTask: (partial: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (
    id: string,
    changes: Partial<Omit<Task, "id" | "createdAt">>,
  ) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  reorderInColumn: (
    status: TaskStatus,
    previousIndex: number,
    currentIndex: number,
  ) => void;
  reorderTasks: (newTasks: Task[]) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ========== Provider Component ==========
// Angular: @Injectable({ providedIn: 'root' })
// React: Context Provider wrapping the app

export const TaskProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Angular: private readonly _tasks = signal<Task[]>(this.loadFromStorage())
  // React: useState with initial load from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        // Deserialize dates
        return parsed.map((t) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        }));
      }
    } catch {
      // ignore
    }
    return seedTasks();
  });

  // Angular: effect(() => { this.saveToStorage(this._tasks()); })
  // React: useEffect watching tasks state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Angular: readonly stats = computed(() => { ... })
  // React: useMemo for derived state (recomputes only when tasks change)
  const stats = useMemo((): StatsSnapshot => {
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

  // Angular: readonly tasksByStatus = computed(() => { ... })
  // React: useMemo for derived state
  const tasksByStatus = useMemo((): Record<TaskStatus, Task[]> => {
    const taskStatusMap: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    for (const task of tasks) {
      taskStatusMap[task.status].push(task);
    }
    return taskStatusMap;
  }, [tasks]);

  // ========== Methods (same signatures as Angular service) ==========

  // getById(id: string): Task | undefined
  const getById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((t) => t.id === id);
    },
    [tasks],
  );

  // addTask(partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task
  // Angular: this._tasks.update(tasks => [...tasks, task])
  // React: functional setState
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

  // updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): void
  // Angular: this._tasks.update(tasks => tasks.map(...))
  // React: functional setState with immutable update
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

  // moveTask(id: string, newStatus: TaskStatus): void
  const moveTask = useCallback(
    (id: string, newStatus: TaskStatus): void => {
      updateTask(id, { status: newStatus });
    },
    [updateTask],
  );

  // delesk(id: string): void
  // Angular: this._tasks.update(tasks => tasks.filter(...))
  // React: functional setState with filter
  const deleteTask = useCallback((id: string): void => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  }, []);

  // reorderInColumn(status: TaskStatus, previousIndex: number, currentIndex: number): void
  // Used for drag-and-drop reordering within a column
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

  // reorderTasks for drag and drop compatibility
  const reorderTasks = useCallback((newTasks: Task[]): void => {
    setTasks(newTasks);
  }, []);

  // Legacy method for compatibility - maps to moveTask
  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus): void => {
      moveTask(id, status);
    },
    [moveTask],
  );

  const value = useMemo(
    () => ({
      tasks,
      stats,
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
      stats,
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

// ========== Custom Hook (replaces Angular DI) ==========
// Angular: constructor(private taskService: TaskService) {}
// React: const taskService = useTaskService()

export const useTaskService = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskService must be used within TaskProvider");
  }
  return context;
};
