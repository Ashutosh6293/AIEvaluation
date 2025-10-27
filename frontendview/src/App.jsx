import { BrowserRouter, Routes, Route } from "react-router-dom";
import Assessment from "./pages/Assessment";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
