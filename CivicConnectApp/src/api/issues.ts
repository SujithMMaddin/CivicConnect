import { API_CONFIG } from "./config";

export interface Issue {
  id: string;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
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
    return await response.json();
  } catch (error) {
    console.error("fetchIssues error:", error);
    throw error;
  }
};
