import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminDashboard from "@/react-app/pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
