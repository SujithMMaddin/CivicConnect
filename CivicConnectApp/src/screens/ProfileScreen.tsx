import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { supabase } from "../api/supabase";
import { fetchIssues, type Issue } from "../api/issues";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// --- Reusable Sub-Components ---
const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showSwitch,
  switchValue,
  onSwitchChange,
  isLast,
  destructive,
}: any) => (
  <TouchableOpacity
    style={[styles.settingsItem, isLast && { borderBottomWidth: 0 }]}
    onPress={onPress}
    disabled={showSwitch}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.iconContainer,
        destructive && { backgroundColor: "#FEE2E2" },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? "#EF4444" : "#4B5563"}
      />
    </View>
    <View style={styles.settingsTextContainer}>
      <Text style={[styles.settingsTitle, destructive && { color: "#EF4444" }]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
    </View>
    {showSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
      />
    ) : (
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    )}
  </TouchableOpacity>
);

// --- Main Screen ---
export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setUser(user);
          const allIssues = await fetchIssues();
          const filtered = allIssues.filter((i: any) => i.userId === user?.id);
          setMyIssues(filtered);
        } catch (err) {
          console.error("Profile load error:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, []),
  );

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.navigate("Login");
        },
      },
    ]);
  };

  const totalReports = myIssues.length;
  const resolvedReports = myIssues.filter(
    (i) => i.status === "Resolved",
  ).length;
  const pendingReports = myIssues.filter((i) => i.status === "Pending").length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={40} color="#2563EB" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.user_metadata?.full_name || "Civic User"}
            </Text>
            <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
            <Text style={styles.userRole}>Community Member</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Reported"
            value={totalReports.toString()}
            color="#111827"
          />
          <StatCard
            label="Resolved"
            value={resolvedReports.toString()}
            color="#10B981"
          />
          <StatCard
            label="Pending"
            value={pendingReports.toString()}
            color="#F59E0B"
          />
        </View>

        {/* Account Section */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <SettingsItem
            icon="person-outline"
            title="Personal Information"
            subtitle={user?.email || "No email"}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            subtitle="Password, data settings"
          />
          <SettingsItem
            icon="document-text-outline"
            title="My Reports"
            subtitle={`${totalReports} issues reported`}
            isLast
          />
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push notifications for updates"
            showSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          <SettingsItem
            icon="sunny-outline"
            title="Dark Mode"
            subtitle="Toggle dark theme"
            showSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsItem
            icon="settings-outline"
            title="App Settings"
            subtitle="Language, region"
            isLast
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.sectionCard}>
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and guides"
          />
          <SettingsItem icon="document-outline" title="Terms of Service" />
          <SettingsItem icon="shield-outline" title="Privacy Policy" isLast />
        </View>

        {/* Sign Out */}
        <View style={[styles.sectionCard, { marginTop: 10 }]}>
          <SettingsItem
            icon="log-out-outline"
            title="Sign Out"
            destructive
            isLast
            onPress={handleSignOut}
          />
        </View>

        <Text style={styles.versionText}>CivicConnect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#64748B" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: { fontSize: 13, color: "#6B7280", marginBottom: 2 },
  userRole: { fontSize: 12, color: "#2563EB", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#FFF",
    width: "31%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsTextContainer: { flex: 1 },
  settingsTitle: { fontSize: 15, fontWeight: "500", color: "#111827" },
  settingsSubtitle: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginVertical: 20,
  },
});
