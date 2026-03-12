import { API_CONFIG } from "./config";

export interface Issue {
  id: string;
  title?: string;
  location?: string;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved" | "In-Progress";
  priority: "Low" | "Medium" | "High";
  latitude: number;
  longitude: number;
  imageUrl?: string;
  createdAt: string; // ISO date string
}

export const fetchIssues = async (): Promise<Issue[]> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch issues`);
    }
    const rawIssues = await response.json();
    return rawIssues.map((issue: any) => ({
      ...issue,
      category: (issue.category || "").toLowerCase(),
      title: issue.category
        ? `${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue #${issue.issueId || issue.id}`
        : "Untitled Issue",
      location: `Lat ${issue.latitude?.toFixed(4)}, Lng ${issue.longitude?.toFixed(4)}`,
    })) as Issue[];
  } catch (error) {
    console.error("fetchIssues error:", error);
    throw error;
  }
};
