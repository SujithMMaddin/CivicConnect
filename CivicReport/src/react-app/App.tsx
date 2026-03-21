import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import IssuesPage from "@/react-app/pages/Issues";
import IssueDetailPage from "@/react-app/pages/IssueDetail";
import ReportPage from "@/react-app/pages/Report";
import ProfilePage from "@/react-app/pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
