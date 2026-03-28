﻿import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import {
  Bell,
  Plus,
  ChevronRight,
  FileText,
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  Trash2,
  Wrench,
  Droplets,
  Info,
  MapPin,
  Clock,
  Users,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchIssues, type Issue } from "../api/issues";
import { RootStackParamList } from "../navigation/AppNavigator";

// ---------- Icon Components ----------
const BellIcon = () => (
  <View style={styles.bellIconWrapper}>
    <Bell size={20} color="#000" />
    <View style={styles.bellDot} />
  </View>
);

const PlusIcon = () => (
  <View style={styles.plusIconBox}>
    <Plus size={22} color="#FFFFFF" strokeWidth={3} />
  </View>
);

const ArrowRight = ({ color = "#2563EB" }) => (
  <ChevronRight size={24} color={color} strokeWidth={2.5} />
);

const FileIcon = ({ color = "#93C5FD" }) => (
  <View style={[styles.statIconBox, { backgroundColor: `${color}22` }]}>
    <FileText size={20} color={color} />
  </View>
);

const AlertTriangleIcon = () => (
  <View style={[styles.statIconBox, { backgroundColor: "#FEE2E2" }]}>
    <AlertTriangle size={20} color="#DC2626" />
  </View>
);

const FileOrangeIcon = () => (
  <View style={[styles.statIconBox, { backgroundColor: "#FEF3C7" }]}>
    <ClipboardList size={20} color="#D97706" />
  </View>
);

const CheckCircleIcon = () => (
  <View style={[styles.statIconBox, { backgroundColor: "#D1FAE5" }]}>
    <CheckCircle size={20} color="#059669" />
  </View>
);

const TrashIcon = () => (
  <View style={[styles.issueIconBox, { backgroundColor: "#F1F5F9" }]}>
    <Trash2 size={18} color="#475569" />
  </View>
);

const WrenchIcon = () => (
  <View style={[styles.issueIconBox, { backgroundColor: "#F1F5F9" }]}>
    <Wrench size={18} color="#475569" />
  </View>
);

const DropletIcon = () => (
  <View style={[styles.issueIconBox, { backgroundColor: "#F1F5F9" }]}>
    <Droplets size={18} color="#475569" />
  </View>
);

const InfoIcon = () => (
  <View style={[styles.issueIconBox, { backgroundColor: "#EFF6FF" }]}>
    <Info size={18} color="#1D4ED8" />
  </View>
);

const LocationIcon = () => (
  <MapPin size={12} color="#475569" style={styles.metaIcon as any} />
);
const ClockIcon = () => (
  <Clock size={12} color="#475569" style={styles.metaIcon as any} />
);
const PeopleIcon = () => (
  <Users size={12} color="#475569" style={styles.metaIcon as any} />
);

// ---------- Sub-components ----------
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <View style={styles.statCard}>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    {icon}
  </View>
);

const Badge = ({ label }: { label: string }) => {
  const badgeStyles: { [key: string]: { bg: string; text: string } } = {
    Pending: { bg: "#FEF3C7", text: "#92400E" },
    "In Progress": { bg: "#DBEAFE", text: "#1D4ED8" },
    Resolved: { bg: "#D1FAE5", text: "#065F46" },
  };
  const s = badgeStyles[label] || badgeStyles["Pending"];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{label}</Text>
    </View>
  );
};

const IssueCard = ({
  icon,
  title,
  badge,
  category,
  location,
  date,
  count,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  category: string;
  location: string;
  date: string;
  count: string;
  accentColor: string;
}) => (
  <TouchableOpacity style={styles.issueCard} activeOpacity={0.8}>
    <View style={[styles.issueAccent, { backgroundColor: accentColor }]} />
    <View style={styles.issueCardInner}>
      {icon}
      <View style={styles.issueContent}>
        <View style={styles.issueRow}>
          <Text style={styles.issueTitle} numberOfLines={1}>
            {title}
          </Text>
          <ArrowRight color="#CBD5E1" />
        </View>
        <View style={styles.issueMeta1}>
          <Badge label={badge} />
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={styles.issueMeta2}>
          <LocationIcon />
          <Text style={styles.metaText}>{location}</Text>
          <ClockIcon />
          <Text style={styles.metaText}>{date}</Text>
          <PeopleIcon />
          <Text style={styles.metaText}>{count}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// ---------- Main Screen ----------
const getIssueIcon = (category: string): React.ReactNode => {
  const cat = category.toLowerCase();
  if (cat.includes("garbag") || cat.includes("waste")) return <TrashIcon />;
  if (cat.includes("pothole"))
    return (
      <View style={[styles.issueIconBox, { backgroundColor: "#F1F5F9" }]}>
        <MapPin size={18} color="#475569" />
      </View>
    );
  if (cat.includes("streetlight") || cat.includes("lighting"))
    return (
      <View style={[styles.issueIconBox, { backgroundColor: "#F1F5F9" }]}>
        <Info size={18} color="#475569" />
      </View>
    );
  if (cat.includes("sewage") || cat.includes("drain")) return <WrenchIcon />;
  if (cat.includes("water") || cat.includes("leak") || cat.includes("droplet"))
    return <DropletIcon />;
  return <InfoIcon />;
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "High":
      return "#EF4444";
    case "Medium":
      return "#F59E0B";
    case "Low":
      return "#10B981";
    default:
      return "#F59E0B";
  }
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function CivicReportHome() {
  const navigation = useNavigation<NavigationProp>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err: any) {
        console.error("Failed to fetch issues:", err);
        setError("Failed to load issues. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchIssues();
      setIssues(data);
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const totalIssues = issues.length;
  const highPriority = issues.filter(
    (i: Issue) => i.priority === "High",
  ).length;
  const pendingCount = issues.filter(
    (i: Issue) => i.status === "Pending",
  ).length;
  const resolved = issues.filter((i: Issue) => i.status === "Resolved").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF4FB" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>CivicReport</Text>
          </View>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        {/* Report CTA Banner */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ReportIssue")}
          style={styles.reportBanner}
          activeOpacity={0.9}
        >
          <PlusIcon />
          <View style={styles.reportBannerText}>
            <Text style={styles.reportBannerTitle}>Report an Issue</Text>
            <Text style={styles.reportBannerSubtitle}>
              Help improve your community
            </Text>
          </View>
          <ArrowRight color="#FFFFFF" />
        </TouchableOpacity>

        {/* Overview */}
        <Text style={styles.sectionTitle}>OVERVIEW</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="TOTAL ISSUES"
            value={totalIssues.toString()}
            icon={<FileIcon color="#93C5FD" />}
          />
          <StatCard
            label="HIGH PRIORITY"
            value={highPriority.toString()}
            icon={<AlertTriangleIcon />}
          />
          <StatCard
            label="IN PROGRESS"
            value={pendingCount.toString()}
            icon={<FileOrangeIcon />}
          />
          <StatCard
            label="RESOLVED"
            value={resolved.toString()}
            icon={<CheckCircleIcon />}
          />
        </View>

        {/* Recent Issues */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT ISSUES</Text>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "Issues" })
            }
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight color="#2563EB" size={16} />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={issues.slice(0, 5)}
            renderItem={({ item: issue }) => (
              <IssueCard
                icon={getIssueIcon(issue.category)}
                title={issue.description || "No description"}
                badge={issue.status || "Pending"}
                category={issue.category || "General"}
                location={`Lat ${issue.latitude}, Lng ${issue.longitude}`}
                date={
                  issue.createdAt
                    ? new Date(issue.createdAt).toLocaleDateString("en-US", {
                        month: "short" as const,
                        day: "numeric" as const,
                      })
                    : "N/A"
                }
                count="N/A"
                accentColor={getPriorityColor(issue.priority)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}
            removeClippedSubviews={true}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Help Card */}
        <View style={styles.helpCard}>
          <InfoIcon />
          <View style={styles.helpTextBox}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpSubtitle}>
              For emergencies, please call 911. This app is for non-emergency
              civic issues only.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EFF4FB" },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { color: "#DC2626", textAlign: "center", fontSize: 14 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 20,
  },
  welcomeText: { fontSize: 14, color: "#64748B", fontWeight: "400" },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bellIconWrapper: { position: "relative" },
  bellDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  reportBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D4ED8",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  plusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  reportBannerText: { flex: 1 },
  reportBannerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  reportBannerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#64748B",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statValue: { fontSize: 28, fontWeight: "700", color: "#0F172A" },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllBtn: { flexDirection: "row", alignItems: "center" },
  viewAllText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },
  issueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  issueAccent: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  issueCardInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  issueIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  issueContent: { flex: 1 },
  issueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
    marginRight: 4,
  },
  issueMeta1: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  issueMeta2: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  categoryText: { fontSize: 12, color: "#64748B" },
  metaIcon: { fontSize: 11 },
  metaText: { fontSize: 11, color: "#94A3B8", marginRight: 6 },
  helpCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  helpTextBox: { flex: 1 },
  helpTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  helpSubtitle: { fontSize: 12, color: "#475569", lineHeight: 17 },
});
