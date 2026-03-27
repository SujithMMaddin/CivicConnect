import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  Trash2,
  Wrench,
  Droplets,
  Info,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  List,
  Map,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchIssues, type Issue } from "../api/issues";

// ---------- Filter Tabs ----------
const TABS = ["All", "Pending", "In Progress", "Resolved"];

// ---------- Icons ----------
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

const getIssueIcon = (category: string): React.ReactNode => {
  const cat = category.toLowerCase();
  if (cat.includes("trash") || cat.includes("garbag") || cat.includes("waste")) return <TrashIcon />;
  if (cat.includes("sewage") || cat.includes("drain") || cat.includes("pothole")) return <WrenchIcon />;
  if (cat.includes("water") || cat.includes("leak") || cat.includes("droplet")) return <DropletIcon />;
  return <InfoIcon />;
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "High": return "#EF4444";
    case "Medium": return "#F59E0B";
    case "Low": return "#10B981";
    default: return "#F59E0B";
  }
};

// ---------- Badge ----------
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

// ---------- Issue Card ----------
const IssueCard = ({ issue }: { issue: Issue }) => (
  <TouchableOpacity style={styles.issueCard} activeOpacity={0.8}>
    <View style={[styles.issueAccent, { backgroundColor: getPriorityColor(issue.priority) }]} />
    <View style={styles.issueCardInner}>
      {getIssueIcon(issue.category)}
      <View style={styles.issueContent}>
        <View style={styles.issueRow}>
          <Text style={styles.issueTitle} numberOfLines={1}>
            {issue.description || "No description"}
          </Text>
          <ChevronRight size={20} color="#CBD5E1" strokeWidth={2.5} />
        </View>
        <View style={styles.issueMeta1}>
          <Badge label={issue.status || "Pending"} />
          <Text style={styles.categoryText}>{issue.category || "General"}</Text>
        </View>
        <View style={styles.issueMeta2}>
          <MapPin size={12} color="#475569" />
          <Text style={styles.metaText}>
            {`${issue.latitude?.toFixed(3)}, ${issue.longitude?.toFixed(3)}`}
          </Text>
          <Clock size={12} color="#475569" />
          <Text style={styles.metaText}>
            {issue.createdAt
              ? new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "N/A"}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// ---------- Map View ----------
const IssuesMapView = ({ issues }: { issues: Issue[] }) => {
const validIssues = issues.filter(
  i => i.latitude && i.longitude && i.status !== "Resolved"
);  const centerLat = validIssues.length > 0
    ? validIssues.reduce((sum, i) => sum + i.latitude, 0) / validIssues.length
    : 12.9716;
  const centerLng = validIssues.length > 0
    ? validIssues.reduce((sum, i) => sum + i.longitude, 0) / validIssues.length
    : 77.5946;

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {validIssues.map((issue) => (
          <Marker
            key={issue.id}
            coordinate={{ latitude: issue.latitude, longitude: issue.longitude }}
            pinColor={getPriorityColor(issue.priority)}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle} numberOfLines={1}>
                  {issue.description || "No description"}
                </Text>
                <View style={styles.calloutRow}>
                  <View style={[styles.calloutDot, { backgroundColor: getPriorityColor(issue.priority) }]} />
                  <Text style={styles.calloutMeta}>{issue.priority} Priority</Text>
                  <Text style={styles.calloutDivider}>•</Text>
                  <Text style={styles.calloutMeta}>{issue.status}</Text>
                </View>
                <Text style={styles.calloutCategory}>{issue.category}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Map Legend */}
      <View style={styles.mapLegend}>
        {[
          { label: "High", color: "#EF4444" },
          { label: "Medium", color: "#F59E0B" },
          { label: "Low", color: "#10B981" },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Issue count overlay */}
      <View style={styles.mapCountBadge}>
        <Text style={styles.mapCountText}>{validIssues.length} issues on map</Text>
      </View>
    </View>
  );
};

// ---------- Main Screen ----------
const IssuesScreen = () => {
  const navigation = useNavigation();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [error, setError] = useState<string | null>(null);

  const loadIssues = async () => {
    setError(null);
    try {
      const data = await fetchIssues();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load issues. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadIssues(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIssues();
    setRefreshing(false);
  };

  const filteredIssues = activeTab === "All"
    ? issues
    : issues.filter((i) => i.status === activeTab);

  const tabCount = (tab: string) =>
    tab === "All" ? issues.length : issues.filter((i) => i.status === tab).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Loading issues...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF4FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Issues</Text>

        {/* List / Map Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "list" && styles.toggleBtnActive]}
            onPress={() => setViewMode("list")}
            activeOpacity={0.8}
          >
            <List size={16} color={viewMode === "list" ? "#FFFFFF" : "#64748B"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "map" && styles.toggleBtnActive]}
            onPress={() => setViewMode("map")}
            activeOpacity={0.8}
          >
            <Map size={16} color={viewMode === "map" ? "#FFFFFF" : "#64748B"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>
                  {tabCount(tab)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : viewMode === "map" ? (
        <IssuesMapView issues={filteredIssues} />
      ) : filteredIssues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Info size={40} color="#CBD5E1" />
          <Text style={styles.emptyText}>No {activeTab} issues found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <IssueCard issue={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
};

export default IssuesScreen;

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EFF4FB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#64748B" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A", letterSpacing: -0.3 },
  toggleContainer: {
    flexDirection: "row", backgroundColor: "#FFFFFF",
    borderRadius: 10, padding: 3, gap: 2,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  toggleBtn: { width: 34, height: 34, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#1D4ED8" },
  tabsWrapper: { backgroundColor: "#EFF4FB", paddingBottom: 8 },
  tabsContainer: { paddingHorizontal: 16, gap: 8, flexDirection: "row" },
  tab: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: "#FFFFFF", gap: 6,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  tabActive: { backgroundColor: "#1D4ED8" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#64748B" },
  tabTextActive: { color: "#FFFFFF" },
  tabBadge: { backgroundColor: "#F1F5F9", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  tabBadgeText: { fontSize: 11, fontWeight: "700", color: "#94A3B8" },
  tabBadgeTextActive: { color: "#FFFFFF" },
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },
  issueCard: {
    backgroundColor: "#FFFFFF", borderRadius: 14, marginBottom: 10,
    flexDirection: "row", overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  issueAccent: { width: 4, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  issueCardInner: { flex: 1, flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  issueIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  issueContent: { flex: 1 },
  issueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  issueTitle: { fontSize: 14, fontWeight: "600", color: "#0F172A", flex: 1, marginRight: 4 },
  issueMeta1: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  issueMeta2: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  categoryText: { fontSize: 12, color: "#64748B" },
  metaText: { fontSize: 11, color: "#94A3B8", marginRight: 6 },
  errorContainer: { margin: 16, padding: 16, backgroundColor: "#FEF2F2", borderRadius: 12 },
  errorText: { color: "#DC2626", textAlign: "center", fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { fontSize: 15, color: "#94A3B8", fontWeight: "500" },
  mapContainer: { flex: 1, position: "relative" },
  map: { flex: 1 },
  callout: {
    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 12,
    minWidth: 180, maxWidth: 220,
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  calloutTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  calloutRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  calloutDot: { width: 8, height: 8, borderRadius: 4 },
  calloutMeta: { fontSize: 11, color: "#64748B", fontWeight: "500" },
  calloutDivider: { fontSize: 11, color: "#CBD5E1" },
  calloutCategory: { fontSize: 11, color: "#94A3B8", textTransform: "capitalize" },
  mapLegend: {
    position: "absolute", bottom: 20, right: 16,
    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 10, gap: 6,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: "600", color: "#334155" },
  mapCountBadge: {
    position: "absolute", top: 12, left: 16,
    backgroundColor: "#FFFFFF", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  mapCountText: { fontSize: 12, fontWeight: "600", color: "#334155" },
});