# Board Structure

## 📁 Directory Organization

```
board/
├── components/          # UI Components
│   ├── BoardHeader.tsx      # Header with title and stats
│   ├── BoardFilters.tsx     # Search and priority filters
│   ├── BoardColumns.tsx     # Columns container
│   ├── Column.tsx           # Single column component
│   └── TaskCard.tsx         # Task card component
│
├── hooks/              # Custom Hooks
│   ├── useTaskFilter.ts     # Filter and organize tasks
│   └── useBoardDragDrop.ts  # Drag & drop logic
│
├── constants/          # Constants & Config
│   └── boardConstants.ts    # Column labels, priorities, etc.
│
├── Board.tsx           # Main board component (clean & simple)
└── index.ts            # Public exports
```

## 🎯 Key Features

### Separation of Concerns

- **Components**: Pure UI components
- **Hooks**: Business logic
- **Constants**: Configuration

### Clean Code

- Each component has a single responsibility
- Custom hooks extract complex logic
- Constants are centralized

### Easy to Maintain

- Clear folder structure
- Small, focused files
- Easy to test and extend
