import { Issue } from "../api/issues";

export interface Stats {
  successRate?: number; // Added for convenience, but computed in screens
  totalIssues: number;
  pendingIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  highPriorityIssues: number;
}

export const HIGH_PRIORITY_CATEGORIES = ["pothole", "water"];

export const calculateStats = (issues: Issue[]): Stats => {
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(
    (issue) => issue.status === "Pending",
  ).length;
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "In Progress",
  ).length;
  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved",
  ).length;
  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === "High",
  ).length;

  return {
    totalIssues,
    pendingIssues,
    inProgressIssues,
    resolvedIssues,
    highPriorityIssues,
  };
};
