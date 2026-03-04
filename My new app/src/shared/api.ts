const API_BASE_URL = "http://localhost:8080";

export interface Issue {
  issueId: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  imageUrls?: string[];
}

export async function fetchIssues(): Promise<Issue[]> {
  const response = await fetch(`${API_BASE_URL}/api/issues`);
  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchIssueById(id: string): Promise<Issue> {
  const response = await fetch(`${API_BASE_URL}/api/issues/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch issue ${id}: ${response.statusText}`);
  }
  return response.json();
}

export async function updateIssueStatus(
  id: string,
  status: Issue["status"],
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/issues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update issue ${id}: ${response.statusText}`);
  }
}
