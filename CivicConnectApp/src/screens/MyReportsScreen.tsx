import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../api/supabase";
import { fetchIssues, type Issue } from "../api/issues";
import { useTheme } from "../context/ThemeContext";

const STATUS_FILTERS = ["All", "Pending", "In Progress", "Resolved"];

const statusColor = (status: string) => {
  if (status === "Resolved") return "#10B981";
  if (status === "In Progress" || status === "In-Progress") return "#F59E0B";
  return "#3B82F6";
};

const priorityColor = (priority: string) => {
  if (priority === "High") return "#EF4444";
  if (priority === "Medium") return "#F59E0B";
  return "#10B981";
};

export default function MyReportsScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const all = await fetchIssues();
          const mine = all.filter((i: any) => i.userId === user?.id);
          setIssues(mine);
        } catch (err) {
          console.error("MyReports load error:", err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, []),
  );

  const filtered =
    activeFilter === "All"
      ? issues
      : issues.filter(
          (i) =>
            i.status === activeFilter ||
            (activeFilter === "In Progress" && i.status === "In-Progress"),
        );

  const renderItem = ({ item }: { item: Issue }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: isDark ? colors.border : "#EFF6FF" },
          ]}
        >
          <Text style={[styles.categoryText, { color: "#2563EB" }]}>
            {item.category}
          </Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: priorityColor(item.priority) + "20" },
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              { color: priorityColor(item.priority) },
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </View>
      <Text
        style={[styles.description, { color: colors.text }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(item.status) + "20" },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: statusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Reports
        </Text>
        <View
          style={[
            styles.countBadge,
            { backgroundColor: isDark ? colors.border : "#EFF6FF" },
          ]}
        >
          <Text style={styles.countText}>{issues.length}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              activeFilter === f && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === f ? "#fff" : colors.textSecondary },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="document-text-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No reports found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {activeFilter === "All"
              ? "You haven't reported any issues yet."
              : `No ${activeFilter} issues.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "700", marginLeft: 12 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countText: { fontSize: 13, fontWeight: "700", color: "#2563EB" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  filterBtnActive: { backgroundColor: "#2563EB" },
  filterText: { fontSize: 13, fontWeight: "600" },
  listContent: { padding: 16, gap: 12 },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 12, fontWeight: "700" },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 12, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "600" },
  dateText: { fontSize: 12 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptySubtitle: { fontSize: 14, textAlign: "center" },
});
