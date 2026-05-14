import { Routes, Route } from "react-router-dom";
import { Board } from "./pages/board/Board";
import { TaskProvider } from "./contexts/TaskContext";
import { Box } from "@mui/material";

const App = () => {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route
          path="/tasks/:id"
          element={<Box>Task Detail Page (Not Implemented)</Box>}
        />
      </Routes>
    </TaskProvider>
  );
};

export default App;
