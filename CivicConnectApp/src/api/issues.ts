import { API_CONFIG } from "./config";

export interface Issue {
  id: number;
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
      id: Number(issue.id),
      category: (issue.category || "").toLowerCase(),
      title: issue.category
        ? `${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue #${issue.id}`
        : "Untitled Issue",
      location: `Lat ${issue.latitude?.toFixed(4)}, Lng ${issue.longitude?.toFixed(4)}`,
    })) as Issue[];
  } catch (error) {
    console.error("fetchIssues error:", error);
    throw error;
  }
};

export const updateIssueStatus = async (
  id: number | string,
  status: string,
  priority: string,
) => {
  const numId = Number(id);
  if (isNaN(numId) || numId <= 0 || id === "undefined") {
    console.error("Invalid issue id:", id);
    throw new Error("Issue ID is required and must be a valid positive number");
  }

  console.log("Updating issue:", { id: numId, status, priority });

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues/${numId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      priority,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update failed:", errorText);
    throw new Error(`Failed to update issue ${numId}: ${response.status}`);
  }

  return response.json();
};

export const getIssueById = async (
  id: number | string,
): Promise<Issue | null> => {
  const numId = Number(id);
  if (isNaN(numId) || numId <= 0 || id === "undefined") {
    console.error("Invalid issue id for getIssueById:", id);
    return null;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues/${numId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("getIssueById error:", error);
    return null;
  }
};
