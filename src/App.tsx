import { Routes, Route } from "react-router-dom";
import { TaskProvider } from "./contexts";
import { Board } from "./pages/board/Board";

const App = () => {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route
          path="/tasks/:id"
          element={<div>Task Detail Page (Not Implemented)</div>}
        />
      </Routes>
    </TaskProvider>
  );
};

export default App;
