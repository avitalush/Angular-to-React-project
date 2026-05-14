# TaskContext - Angular to React Migration ✅

## 📋 Overview

This Context is a **1:1 migration** of the Angular `TaskService` to React, preserving all functionality and data structures.

## 🔄 Angular → React Mapping

| Angular Concept                       | React Implementation                    | Notes                           |
| ------------------------------------- | --------------------------------------- | ------------------------------- |
| `signal<Task[]>`                      | `useState<Task[]>`                      | With localStorage persistence   |
| `computed(() => stats)`               | `useMemo(() => stats, [tasks])`         | Auto-recomputes on task changes |
| `computed(() => tasksByStatus)`       | `useMemo(() => tasksByStatus, [tasks])` | Grouped tasks by status         |
| `effect(() => save)`                  | `useEffect(() => save, [tasks])`        | Auto-saves to localStorage      |
| `_tasks.update(fn)`                   | `setTasks(prevTasks => fn(prevTasks))`  | Immutable updates               |
| `@Injectable({ providedIn: 'root' })` | `TaskProvider` Context                  | Global state                    |
| Service injection                     | `useTaskService()` hook                 | Get context anywhere            |

## 🚀 Usage

### 1. Wrap your app with the Provider

```tsx
import { TaskProvider } from "./contexts";

function App() {
  return (
    <TaskProvider>
      <Board />
    </TaskProvider>
  );
}
```

### 2. Use the hook in any component

```tsx
import { useTaskService } from "./contexts";

function Board() {
  const {
    tasks, // All tasks (Task[])
    stats, // Computed statistics (StatsSnapshot)
    tasksByStatus, // Tasks grouped by status (Record<TaskStatus, Task[]>)
    getById, // Get task by id
    addTask, // Add new task
    updateTask, // Update task
    moveTask, // Move task to different status
    deleteTask, // Delete task
    reorderInColumn, // Reorder within column
    reorderTasks, // Bulk reorder
  } = useTaskService();

  return (
    <div>
      <h1>Total Tasks: {stats.total}</h1>
      <p>Completion: {stats.completionRate}%</p>
      <p>Overdue: {stats.overdue}</p>
    </div>
  );
}
```

## 📊 Features

### ✅ Real-time Statistics

The `stats` object is automatically computed whenever tasks change:

```tsx
const { stats } = useTaskService();

console.log(stats);
// {
//   total: 20,
//   todo: 5,
//   inProgress: 7,
//   review: 3,
//   done: 5,
//   overdue: 2,
//   completionRate: 25
// }
```

### ✅ LocalStorage Persistence

Tasks are automatically saved to localStorage on every change and loaded on app start.

```tsx
// Automatically persisted - no manual save needed!
addTask({ title: 'New Task', ... });
```

### ✅ 20 Realistic Seed Tasks

If no tasks exist in localStorage, 20 realistic tasks are generated:

- Diverse titles (authentication, bugs, features, etc.)
- Random statuses, priorities, and assignees
- Realistic created/updated/due dates
- Tags like 'bug', 'feature', 'security', etc.

### ✅ Tasks Grouped by Status

```tsx
const { tasksByStatus } = useTaskService();

// {
//   'todo': [task1, task2, ...],
//   'in-progress': [task3, task4, ...],
//   'review': [task5, ...],
//   'done': [task6, task7, ...]
// }
```

## 🎯 API Methods

### `getById(id: string): Task | undefined`

Find a task by ID.

```tsx
const task = getById("task-123");
if (task) {
  console.log(task.title);
}
```

### `addTask(partial): Task`

Creates a new task with auto-generated ID and timestamps.

```tsx
const newTask = addTask({
  title: "Implement feature X",
  description: "Add new feature",
  status: "todo",
  priority: "high",
  assignee: "Alice Kim",
  projectId: "p1",
  dueDate: new Date("2026-12-31"),
  tags: ["feature", "ux"],
});
// Returns the created task with id, createdAt, updatedAt
```

### `updateTask(id, changes): void`

Updates a task partially (immutable).

```tsx
updateTask("task-123", {
  title: "Updated Title",
  priority: "critical",
  tags: ["urgent", "bug"],
});
// Only specified fields are updated
// updatedAt is automatically set
```

### `moveTask(id, newStatus): void`

Moves a task to a different column (changes status).

```tsx
moveTask("task-123", "done");
// Equivalent to: updateTask('task-123', { status: 'done' })
```

### `deleteTask(id): void`

Removes a task.

```tsx
deleteTask("task-123");
```

### `reorderInColumn(status, fromIndex, toIndex): void`

Reorders tasks within a column (for drag-and-drop).

```tsx
// After dragging in 'todo' column from position 0 to position 3
reorderInColumn("todo", 0, 3);
```

### `reorderTasks(newTasks): void`

Bulk update task order (advanced use).

```tsx
const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
reorderTasks(reorderedTasks);
```

## 📦 Data Types

```typescript
type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee: string; // One of ASSIGNEES
  projectId: string; // One of PROJECTS.id
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  tags: string[];
};

type StatsSnapshot = {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  completionRate: number; // Percentage (0-100)
};
```

## 🎨 Constants

```typescript
import { ASSIGNEES, PROJECTS } from "./enum/TaskStatus";

ASSIGNEES = [
  "Alice Kim",
  "Bob Chen",
  "Carol Davis",
  "Dan Harris",
  "Eve Martinez",
];

PROJECTS = [
  { id: "p1", name: "Frontend Revamp", color: "#6366f1" },
  { id: "p2", name: "API Gateway", color: "#f59e0b" },
  { id: "p3", name: "Mobile App", color: "#10b981" },
  { id: "p4", name: "DevOps", color: "#ef4444" },
];
```

## ⚡ Performance

- ✅ `useMemo` prevents unnecessary stats/tasksByStatus recalculation
- ✅ `useCallback` prevents function recreation on every render
- ✅ Only components using specific values re-render when they change
- ✅ localStorage operations are optimized with try/catch

## 🔍 Why This Architecture?

Perfect mirror of Angular's service pattern:

1. **Single Source of Truth**: Context provides one shared state (like Angular's singleton)
2. **Computed Values**: `useMemo` = Angular's `computed()`
3. **Reactive Updates**: `useEffect` = Angular's `effect()`
4. **Clean API**: Custom hook = Angular's dependency injection

## 🧪 Example: Building a Dashboard

```tsx
function Dashboard() {
  const { stats, tasks, moveTask } = useTaskService();

  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
  );

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Done" value={stats.done} />
        <StatCard title="Completion" value={`${stats.completionRate}%`} />
        <StatCard title="Overdue" value={stats.overdue} color="red" />
      </div>

      <div className="overdue-section">
        <h2>⚠️ Overdue Tasks ({overdueTasks.length})</h2>
        {overdueTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMarkDone={() => moveTask(task.id, "done")}
          />
        ))}
      </div>
    </div>
  );
}
```

## 🎉 Ready to Use!

The Context is fully implemented with all Angular service features:

- ✅ 20 realistic seed tasks
- ✅ LocalStorage persistence
- ✅ Real-time statistics
- ✅ Drag-and-drop support
- ✅ Full CRUD operations
- ✅ Type-safe API
- ✅ Performance optimized
