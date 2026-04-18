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
  createdAt: string;
  address?: string;
}

// ---------- Simple Cache ----------
let cachedIssues: Issue[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const invalidateCache = () => {
  cachedIssues = null;
  cacheTimestamp = 0;
};

export const fetchIssues = async (forceRefresh = false): Promise<Issue[]> => {
  const now = Date.now();

  // Return cache if valid and not forcing refresh
  if (!forceRefresh && cachedIssues && now - cacheTimestamp < CACHE_DURATION) {
    return cachedIssues;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch issues`);
    }
    const rawIssues = await response.json();
    const mapped = rawIssues.map((issue: any) => ({
      ...issue,
      id: Number(issue.id),
      category: (issue.category || "").toLowerCase(),
      title: issue.category
        ? `${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue #${issue.id}`
        : "Untitled Issue",
      location: `Lat ${issue.latitude?.toFixed(4)}, Lng ${issue.longitude?.toFixed(4)}`,
      address: issue.address || null,
    })) as Issue[];

    // Save to cache
    cachedIssues = mapped;
    cacheTimestamp = now;

    return mapped;
  } catch (error) {
    console.error("fetchIssues error:", error);
    // Return stale cache if available during error
    if (cachedIssues) return cachedIssues;
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

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues/${numId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, priority }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update failed:", errorText);
    throw new Error(`Failed to update issue ${numId}: ${response.status}`);
  }

  // Invalidate cache after update
  invalidateCache();
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
