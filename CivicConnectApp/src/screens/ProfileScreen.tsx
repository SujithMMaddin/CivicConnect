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
import { useTheme } from "../context/ThemeContext";
import { fetchIssues, type Issue } from "../api/issues";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../context/LanguageContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// --- Reusable Sub-Components ---
const StatCard = ({
  label,
  value,
  color,
  cardBg,
  cardBorder,
}: {
  label: string;
  value: string;
  color: string;
  cardBg: string;
  cardBorder: string;
}) => (
  <View
    style={[
      styles.statCard,
      { backgroundColor: cardBg, borderColor: cardBorder },
    ]}
  >
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
}: any) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        isLast && { borderBottomWidth: 0 },
        { borderBottomColor: colors.border },
      ]}
      onPress={onPress}
      disabled={showSwitch}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: destructive ? "#FEE2E2" : colors.inputBg },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? "#EF4444" : colors.textSecondary}
        />
      </View>
      <View style={styles.settingsTextContainer}>
        <Text
          style={[
            styles.settingsTitle,
            { color: destructive ? "#EF4444" : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingsSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
};

// --- Main Screen ---
export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDark, toggleTheme, colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (myIssues.length === 0) setLoading(true);
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

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const saved = await AsyncStorage.getItem("notifications_enabled");
        if (saved !== null) setNotificationsEnabled(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load preferences:", err);
      }
    };
    loadPreferences();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(t("signOut"), t("signOutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("signOut"),
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t("loadingProfile")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />
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
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.user_metadata?.full_name || "Civic User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || "No email"}
            </Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>
              {t("communityMember")}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            label={t("reportedIssues")}
            value={totalReports.toString()}
            color="#111827"
            cardBg={colors.card}
            cardBorder={colors.border}
          />
          <StatCard
            label={t("resolved")}
            value={resolvedReports.toString()}
            color="#10B981"
            cardBg={colors.card}
            cardBorder={colors.border}
          />
          <StatCard
            label={t("pending")}
            value={pendingReports.toString()}
            color="#F59E0B"
            cardBg={colors.card}
            cardBorder={colors.border}
          />
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          {t("account")}
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SettingsItem
            icon="person-outline"
            title={t("personalInformation")}
            subtitle={user?.email || "No email"}
            onPress={() => navigation.navigate("PersonalInfo")}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title={t("privacySecurity")}
            subtitle="Password, data settings"
            onPress={() => navigation.navigate("PrivacySecurity")}
          />
          <SettingsItem
            icon="document-text-outline"
            title={t("myReports")}
            subtitle={`${totalReports} ${t("issuesReported")}`}
            isLast
            onPress={() => navigation.navigate("MyReports")}
          />
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          {t("preferences")}
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SettingsItem
            icon="notifications-outline"
            title={t("notifications")}
            subtitle={t("pushNotifications")}
            showSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={async (value: boolean) => {
              setNotificationsEnabled(value);
              await AsyncStorage.setItem(
                "notifications_enabled",
                JSON.stringify(value),
              );
            }}
          />
          <SettingsItem
            icon="sunny-outline"
            title={t("darkMode")}
            subtitle={t("toggleDarkTheme")}
            showSwitch
            switchValue={isDark}
            onSwitchChange={toggleTheme}
          />
          <SettingsItem
            icon="settings-outline"
            title={t("appSettings")}
            subtitle={t("languageRegion")}
            isLast
            onPress={() => navigation.navigate("AppSettings")}
          />
        </View>

        {/* Support Section */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          {t("support")}
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SettingsItem
            icon="help-circle-outline"
            title={t("helpCenter")}
            subtitle={t("faqsAndGuides")}
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <SettingsItem
            icon="document-outline"
            title={t("termsOfService")}
            onPress={() => navigation.navigate("TermsOfService")}
          />
          <SettingsItem
            icon="shield-outline"
            title={t("privacyPolicy")}
            isLast
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />
        </View>

        {/* Sign Out */}
        <View
          style={[
            styles.sectionCard,
            {
              marginTop: 10,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingsItem
            icon="log-out-outline"
            title={t("signOut")}
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
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15 },
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
  userName: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
  userEmail: { fontSize: 13, marginBottom: 2 },
  userRole: { fontSize: 12, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "31%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
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
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
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
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsTextContainer: { flex: 1 },
  settingsTitle: { fontSize: 15, fontWeight: "500" },
  settingsSubtitle: { fontSize: 12, marginTop: 2 },
  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginVertical: 20,
  },
});
