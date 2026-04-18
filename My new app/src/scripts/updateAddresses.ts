const BACKEND_URL = "http://localhost:8080";

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "CivicConnect/1.0",
        },
      },
    );
    const data = await res.json();
    if (data && data.display_name) {
      // Return shorter address — road + city + state
      const addr = data.address;
      const parts = [
        addr?.road || addr?.pedestrian || addr?.street,
        addr?.suburb || addr?.neighbourhood,
        addr?.city || addr?.town || addr?.village,
        addr?.state,
      ].filter(Boolean);
      return parts.join(", ") || data.display_name;
    }
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  } catch (err) {
    return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  }
}

async function updateAllAddresses() {
  console.log("Fetching all issues...");

  // Fetch all issues
  const res = await fetch(`${BACKEND_URL}/api/issues`);
  const issues = await res.json();

  console.log(`Found ${issues.length} issues to update`);

  let updated = 0;
  let failed = 0;

  for (const issue of issues) {
    // Skip if already has address
    if (issue.address && !issue.address.startsWith("Lat:")) {
      console.log(`Issue #${issue.id} already has address: ${issue.address}`);
      continue;
    }

    if (!issue.latitude || !issue.longitude) {
      console.log(`Issue #${issue.id} has no coordinates, skipping`);
      continue;
    }

    try {
      console.log(
        `Geocoding issue #${issue.id} at ${issue.latitude}, ${issue.longitude}...`,
      );

      const address = await reverseGeocode(issue.latitude, issue.longitude);
      console.log(`  → ${address}`);

      // Update via backend API
      const updateRes = await fetch(`${BACKEND_URL}/api/issues/${issue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: issue.status,
          priority: issue.priority,
          address: address,
        }),
      });

      if (updateRes.ok) {
        updated++;
        console.log(`  ✅ Updated issue #${issue.id}`);
      } else {
        failed++;
        console.log(`  ❌ Failed to update issue #${issue.id}`);
      }

      // Wait 1 second between requests to respect Nominatim rate limit
      await new Promise((resolve) => setTimeout(resolve, 1100));
    } catch (err) {
      console.error(`Error processing issue #${issue.id}:`, err);
      failed++;
    }
  }

  console.log(`\n✅ Done! Updated: ${updated}, Failed: ${failed}`);
}

updateAllAddresses();
