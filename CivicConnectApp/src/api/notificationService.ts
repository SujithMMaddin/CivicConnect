import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchIssues } from "./issues";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (err) {
    console.error("Notification permission error:", err);
    return false;
  }
};

// Check if user's issues have changed status since last check
export const checkIssueStatusChanges = async (
  userId: string,
): Promise<void> => {
  try {
    const notificationsEnabled = await AsyncStorage.getItem(
      "notifications_enabled",
    );
    if (notificationsEnabled === "false") return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    const allIssues = await fetchIssues(true);
    const myIssues = allIssues.filter((i: any) => i.userId === userId);

    // Load previously stored statuses
    const storedRaw = await AsyncStorage.getItem("issue_statuses");
    const storedStatuses: Record<string, string> = storedRaw
      ? JSON.parse(storedRaw)
      : {};

    const newStatuses: Record<string, string> = {};
    const changedIssues: Array<{
      id: string;
      category: string;
      oldStatus: string;
      newStatus: string;
    }> = [];

    for (const issue of myIssues) {
      const id = issue.id.toString();
      newStatuses[id] = issue.status;
      if (storedStatuses[id] && storedStatuses[id] !== issue.status) {
        changedIssues.push({
          id,
          category: issue.category,
          oldStatus: storedStatuses[id],
          newStatus: issue.status,
        });
      }
    }

    // Save new statuses
    await AsyncStorage.setItem("issue_statuses", JSON.stringify(newStatuses));

    // Fire notifications for changed issues
    for (const changed of changedIssues) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Issue Status Updated",
          body: `Your ${changed.category} issue has been updated to "${changed.newStatus}"`,
          data: { issueId: changed.id },
        },
        trigger: null, // immediate
      });
    }
  } catch (err) {
    console.error("Check issue status error:", err);
  }
};

// Check for nearby new issues
export const checkNearbyIssues = async (
  userLat: number,
  userLng: number,
  radiusKm: number = 2,
): Promise<void> => {
  try {
    const notificationsEnabled = await AsyncStorage.getItem(
      "notifications_enabled",
    );
    if (notificationsEnabled === "false") return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    const allIssues = await fetchIssues(true);

    // Load previously seen issue IDs
    const seenRaw = await AsyncStorage.getItem("seen_issue_ids");
    const seenIds: string[] = seenRaw ? JSON.parse(seenRaw) : [];

    const newNearbyIssues = allIssues.filter((issue: any) => {
      const id = issue.id.toString();
      if (seenIds.includes(id)) return false;
      if (!issue.latitude || !issue.longitude) return false;

      // Haversine distance
      const R = 6371;
      const dLat = ((issue.latitude - userLat) * Math.PI) / 180;
      const dLng = ((issue.longitude - userLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLat * Math.PI) / 180) *
          Math.cos((issue.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusKm;
    });

    if (newNearbyIssues.length > 0) {
      // Update seen IDs
      const allIds = allIssues.map((i: any) => i.id.toString());
      await AsyncStorage.setItem("seen_issue_ids", JSON.stringify(allIds));

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Issues Near You",
          body: `${newNearbyIssues.length} new civic issue${newNearbyIssues.length > 1 ? "s" : ""} reported within ${radiusKm}km of your location`,
          data: { type: "nearby" },
        },
        trigger: null,
      });
    } else {
      // Just update seen IDs without notification
      const allIds = allIssues.map((i: any) => i.id.toString());
      await AsyncStorage.setItem("seen_issue_ids", JSON.stringify(allIds));
    }
  } catch (err) {
    console.error("Check nearby issues error:", err);
  }
};
