import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../styles/theme";

type CivicDataInsightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CivicDataInsights"
>;

const CivicDataInsightsScreen: React.FC = () => {
  const navigation = useNavigation<CivicDataInsightsScreenNavigationProp>();

  const stats = [
    {
      title: "Total Issues",
      value: "1,284",
      change: "+12%",
      changeColor: "#10b981",
    },
    {
      title: "Avg. Time",
      value: "4.2 days",
      change: "-0.5d",
      changeColor: "#ef4444",
    },
    {
      title: "Satisfaction",
      value: "92%",
      change: "+2%",
      changeColor: "#10b981",
    },
  ];

  const categories = [
    { name: "Waste Management", count: 412, percentage: 85 },
    { name: "Roads & Transport", count: 328, percentage: 65 },
    { name: "Water & Sewage", count: 284, percentage: 50 },
    { name: "Street Lighting", count: 154, percentage: 30 },
  ];

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
            maxWidth: 480,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24, color: theme.colors.primary }}>
              📊
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              flex: 1,
              textAlign: "center",
            }}
          >
            Analytics & Insights
          </Text>
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
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          style={{
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.sm,
          }}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.primary,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "medium", color: "white" }}
              >
                Last 30 Days
              </Text>
              <Text style={{ fontSize: 12, color: "white", opacity: 0.8 }}>
                📅
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: theme.colors.slate[200],
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "medium",
                  color: theme.colors.textLight,
                }}
              >
                All Districts
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.slate[600] }}>
                ⌄
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: theme.colors.slate[200],
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "medium",
                  color: theme.colors.textLight,
                }}
              >
                High Priority
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.slate[600] }}>
                🔍
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* High-Level Stats Cards */}
        <ScrollView
          horizontal
          style={{ padding: theme.spacing.md }}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={{
                  minWidth: 160,
                  backgroundColor: "white",
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.xl,
                  borderWidth: 1,
                  borderColor: theme.colors.slate[200],
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
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
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.slate[500],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {stat.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: stat.changeColor,
                      fontWeight: "bold",
                      backgroundColor: stat.changeColor + "20",
                      paddingHorizontal: theme.spacing.xs,
                      paddingVertical: 2,
                      borderRadius: theme.borderRadius.sm,
                    }}
                  >
                    {stat.change}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: theme.colors.textLight,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {stat.value}
                </Text>
                <View
                  style={{
                    height: 4,
                    backgroundColor: theme.colors.slate[100],
                    borderRadius: theme.borderRadius.sm,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width:
                        stat.title === "Total Issues"
                          ? "70%"
                          : stat.title === "Avg. Time"
                            ? "45%"
                            : "92%",
                      backgroundColor:
                        stat.title === "Total Issues"
                          ? theme.colors.primary
                          : stat.title === "Avg. Time"
                            ? "#f97316"
                            : "#10b981",
                      borderRadius: theme.borderRadius.sm,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Issues by Category */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.slate[200],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.lg,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.colors.textLight,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  Issue Categories
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.slate[500] }}>
                  Top reported departments
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 20, color: theme.colors.slate[400] }}>
                  ⋯
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: theme.spacing.md }}>
              {categories.map((category, index) => (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "semibold",
                        color: theme.colors.slate[600],
                      }}
                    >
                      {category.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: theme.colors.primary,
                      }}
                    >
                      {category.count}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 8,
                      backgroundColor: theme.colors.slate[100],
                      borderRadius: theme.borderRadius.sm,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${category.percentage}%`,
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.borderRadius.sm,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={{
                marginTop: theme.spacing.lg,
                paddingVertical: theme.spacing.sm,
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.primary + "20",
                borderRadius: theme.borderRadius.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.primary,
                  fontWeight: "bold",
                }}
              >
                View Detailed Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resolution Trends */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.slate[200],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.textLight,
                marginBottom: theme.spacing.xs,
              }}
            >
              Resolution Trends
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.slate[500],
                marginBottom: theme.spacing.lg,
              }}
            >
              Issues resolved over time (Weekly)
            </Text>

            <View
              style={{
                height: 120,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.sm,
              }}
            >
              {[40, 60, 55, 85, 70, 95, 40].map((height, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: `${height}%`,
                    backgroundColor:
                      theme.colors.primary + (index === 5 ? "" : "40"),
                    borderRadius: theme.borderRadius.sm,
                  }}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: theme.spacing.sm,
                marginTop: theme.spacing.sm,
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 10,
                      color: theme.colors.slate[400],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {day}
                  </Text>
                ),
              )}
            </View>
          </View>
        </View>

        {/* Status Distribution */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.slate[200],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.textLight,
                marginBottom: theme.spacing.xs,
              }}
            >
              Status Distribution
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.slate[500],
                marginBottom: theme.spacing.lg,
              }}
            >
              Current breakdown of all tasks
            </Text>

            <View
              style={{ alignItems: "center", marginBottom: theme.spacing.lg }}
            >
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  backgroundColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing.md,
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                >
                  1.2k
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "white",
                    opacity: 0.8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Total
                </Text>
              </View>

              <View style={{ gap: theme.spacing.sm }}>
                {[
                  {
                    color: theme.colors.primary,
                    label: "Resolved",
                    percentage: "75%",
                  },
                  { color: "#10b981", label: "In Progress", percentage: "15%" },
                  { color: "#f97316", label: "Open", percentage: "10%" },
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor: item.color,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: theme.colors.textLight,
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: theme.colors.slate[400] }}
                      >
                        {item.percentage}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Smart Insight Card */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              backgroundColor: theme.colors.primary + "10",
              borderWidth: 1,
              borderColor: theme.colors.primary + "20",
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing.md,
              flexDirection: "row",
              gap: theme.spacing.md,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: "white" }}>💡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: theme.colors.primary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Actionable Insight
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.textLight,
                  lineHeight: 20,
                }}
              >
                Pothole reports in{" "}
                <Text style={{ fontWeight: "bold" }}>District 4</Text> have
                increased by 24% this week. Consider reallocating the
                maintenance crew to prioritize the South Industrial zone.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>🗺️</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 2,
              color: theme.colors.primary,
            }}
          >
            📈
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            Insights
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>🚨</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Issues
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginBottom: 2 }}>⚙️</Text>
          <Text style={{ fontSize: 10, color: theme.colors.slate[500] }}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CivicDataInsightsScreen;
