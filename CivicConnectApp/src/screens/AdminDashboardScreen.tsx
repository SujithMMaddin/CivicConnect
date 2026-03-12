import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../styles/theme";

import { ActivityIndicator } from "react-native";
import { useMemo } from "react";

import { fetchIssues, type Issue } from "../api/issues";
import type { Stats } from "../utils/stats";
import { calculateStats } from "../utils/stats";

type AdminDashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AdminDashboard"
>;

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filterCategories = [
    { id: "all", label: "All" },
    { id: "pothole", label: "Roads" },
    { id: "streetlight", label: "Street Light" },
    { id: "water", label: "Water" },
    { id: "sanitation", label: "Sanitation" },
  ];

  const [issueStats, setIssueStats] = useState<Stats | null>(null);
  const [issuesData, setIssuesData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allFilteredIssues = useMemo(
    () =>
      selectedFilter === "all"
        ? issuesData
        : issuesData.filter((issue) => issue.category === selectedFilter),
    [issuesData, selectedFilter],
  );

  const recentIssues = useMemo(() => {
    return allFilteredIssues
      .sort(
        (a: Issue, b: Issue) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [allFilteredIssues]);

  const filteredIssues = recentIssues;

  const dashboardStats = issueStats
    ? [
        {
          icon: "📊",
          label: "Total",
          value: issueStats.totalIssues.toLocaleString(),
          color: "blue",
        },
        {
          icon: "⏳",
          label: "Pending",
          value: issueStats.pendingIssues.toLocaleString(),
          color: "amber",
        },
        {
          icon: "🚨",
          label: "High-Priority",
          value: issueStats.highPriorityIssues.toLocaleString(),
          color: "red",
        },
        {
          icon: "✅",
          label: "Resolved",
          value: issueStats.resolvedIssues.toLocaleString(),
          color: "emerald",
        },
      ]
    : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchIssues();
        setIssuesData(data);
        setIssueStats(calculateStats(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("AdminDashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return theme.colors.slate[100];
      case "Medium":
        return "#fef3c7";
      case "Low":
        return theme.colors.slate[100];
      default:
        return theme.colors.slate[100];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In-Progress":
        return "#dbeafe";
      case "Pending":
        return theme.colors.slate[100];
      case "Resolved":
        return "#d1fae5";
      default:
        return theme.colors.slate[100];
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundLight }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundLight}
      />

      {/* Top Navigation Bar */}
      <View
        style={{
          backgroundColor: theme.colors.backgroundLight + "80",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.slate[200],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: theme.spacing.md,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <TouchableOpacity
              style={{
                width: 24,
                height: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: theme.colors.textLight }}>
                ☰
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.textLight,
              }}
            >
              Resolution Center
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: theme.colors.textLight }}>
                🔔
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Global Search */}
      <View style={{ padding: theme.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: theme.borderRadius.xl,
            paddingHorizontal: theme.spacing.md,
            height: 48,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>
            🔍
          </Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: theme.colors.textLight,
            }}
            placeholder="Search issues, IDs, or locations"
            placeholderTextColor={theme.colors.slate[400]}
          />
        </View>
      </View>

      {/* Summary Statistics */}
      <ScrollView
        horizontal
        style={{
          paddingHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.md,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
          {dashboardStats.map((stat, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "white",
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.xl,
                minWidth: 140,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor:
                    stat.color === "blue"
                      ? "#dbeafe"
                      : stat.color === "amber"
                        ? "#fef3c7"
                        : stat.color === "red"
                          ? "#fee2e2"
                          : "#d1fae5",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing.sm,
                }}
              >
                <Text style={{ fontSize: 20 }}>{stat.icon}</Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: theme.colors.textLight,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: theme.colors.slate[500],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Filter Section */}
      <View
        style={{
          paddingHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
            }}
          >
            Category Filter
          </Text>
          <TouchableOpacity onPress={() => setSelectedFilter("all")}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.primary,
                fontWeight: "semibold",
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            {filterCategories.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor:
                    selectedFilter === filter.id
                      ? theme.colors.primary
                      : "white",
                  borderWidth: selectedFilter === filter.id ? 0 : 1,
                  borderColor: theme.colors.slate[200],
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "medium",
                    color:
                      selectedFilter === filter.id
                        ? "white"
                        : theme.colors.textLight,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Issue List */}
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
            }}
          >
            Recent Issues
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.slate[600],
                fontWeight: "medium",
              }}
            >
              Newest First
            </Text>
            <Text style={{ fontSize: 16, marginLeft: theme.spacing.xs }}>
              ⌄
            </Text>
          </View>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 8, color: theme.colors.slate[600] }}>
              Loading dashboard...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: theme.colors.slate[600],
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Failed to load data
            </Text>
            <TouchableOpacity
              onPress={() => {
                const reload = async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    const data = await fetchIssues();
                    setIssuesData(data);
                    setIssueStats(calculateStats(data));
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to load data",
                    );
                  } finally {
                    setLoading(false);
                  }
                };
                reload();
              }}
              style={{
                padding: 10,
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredIssues.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.slate[600],
                textAlign: "center",
              }}
            >
              {selectedFilter === "all"
                ? "No recent issues found"
                : `No recent ${filterCategories.find((f) => f.id === selectedFilter)?.label || "issues"} issues`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.slate[500],
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Try adjusting the filter
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {filteredIssues.map((issue) => (
              <View
                key={issue.id}
                style={{
                  backgroundColor: "white",
                  marginBottom: theme.spacing.lg,
                  borderRadius: theme.borderRadius.xl,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
                    <View
                      style={{
                        paddingHorizontal: theme.spacing.xs,
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor:
                          issue.priority === "High"
                            ? "#fee2e2"
                            : issue.priority === "Medium"
                              ? "#fef3c7"
                              : theme.colors.slate[100],
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color:
                            issue.priority === "High"
                              ? "#dc2626"
                              : issue.priority === "Medium"
                                ? "#d97706"
                                : theme.colors.slate[700],
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {issue.priority}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: theme.spacing.xs,
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor:
                          issue.status === "In-Progress"
                            ? "#dbeafe"
                            : issue.status === "Pending"
                              ? theme.colors.slate[100]
                              : "#d1fae5",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color:
                            issue.status === "In-Progress"
                              ? "#2563eb"
                              : issue.status === "Pending"
                                ? theme.colors.slate[700]
                                : "#059669",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {issue.status}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.slate[500],
                      fontWeight: "medium",
                    }}
                  >
                    #{issue.id}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: theme.colors.textLight,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {issue.title || issue.description.substring(0, 50) + "..."}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.colors.slate[600],
                    lineHeight: 20,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  {issue.description}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.slate[100],
                    paddingTop: theme.spacing.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{ fontSize: 16, marginRight: theme.spacing.xs }}
                    >
                      📍
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: theme.colors.slate[600] }}
                    >
                      {issue.location || "Location unavailable"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.colors.primary,
                        fontWeight: "bold",
                        marginRight: theme.spacing.xs,
                      }}
                    >
                      Details
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.colors.primary }}>
                      →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: theme.spacing.xl,
          right: theme.spacing.xl,
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 32, color: "white" }}>➕</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingVertical: theme.spacing.sm,
          paddingBottom: theme.spacing.lg,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>📊</Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            Dash
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>🗺️</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>📋</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>⚙️</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Set
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
