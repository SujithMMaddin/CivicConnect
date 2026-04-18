const API_BASE_URL = "http://localhost:8080";

export interface Issue {
  id: string;
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

export async function fetchUserDetails(
  userIds: string[],
): Promise<Record<string, { name: string; email: string }>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  console.log("Fetching user details for IDs:", uniqueIds);

  if (uniqueIds.length === 0) {
    console.log("No user IDs to fetch");
    return {};
  }

  try {
    const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    console.log("SUPABASE_URL:", SUPABASE_URL);
    console.log("SERVICE_ROLE_KEY exists:", !!SERVICE_ROLE_KEY);

    const results: Record<string, { name: string; email: string }> = {};

    await Promise.all(
      uniqueIds.map(async (userId) => {
        try {
          const url = `${SUPABASE_URL}/auth/v1/admin/users/${userId}`;
          console.log("Fetching:", url);

          const res = await fetch(url, {
            headers: {
              apikey: SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            },
          });

          console.log("Response status:", res.status);
          const data = await res.json();
          console.log("User data:", JSON.stringify(data));

          if (data && data.id) {
            results[userId] = {
              name:
                data.user_metadata?.full_name ||
                data.user_metadata?.name ||
                data.email?.split("@")[0] ||
                "Unknown",
              email: data.email || "Unknown",
            };
          }
        } catch (err) {
          console.error("Error fetching user:", userId, err);
        }
      }),
    );

    console.log("Final results:", JSON.stringify(results));
    return results;
  } catch (err) {
    console.error("fetchUserDetails error:", err);
    return {};
  }
}

export async function fetchIssueById(id: string): Promise<Issue | null> {
  if (!id || id === "undefined" || isNaN(Number(id))) {
    console.error("Invalid ID for fetchIssueById:", id);
    return null;
  }
  const response = await fetch(`${API_BASE_URL}/api/issues/${Number(id)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch issue ${id}: ${response.statusText}`);
  }
  return response.json();
}

export async function updateIssueStatus(
  id: string,
  status: Issue["status"],
): Promise<void> {
  if (!id || id === "undefined" || isNaN(Number(id))) {
    console.error("Invalid ID for updateIssueStatus:", id);
    throw new Error("Invalid issue ID");
  }
  const response = await fetch(`${API_BASE_URL}/api/issues/${Number(id)}`, {
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
