import React, { useState, useEffect } from "react";
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

import { ActivityIndicator } from "react-native";

import { fetchIssues, type Issue } from "../api/issues";
import type { Stats } from "../utils/stats";
import { calculateStats } from "../utils/stats";

type LandingPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;

const LandingPage: React.FC = () => {
  const navigation = useNavigation<LandingPageNavigationProp>();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchIssues();
        setIssues(data);
        setStats(calculateStats(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("LandingPage fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundLight }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundLight}
      />

      <ScrollView style={{ flex: 1 }}>
        {/* Hero Section */}
        <View
          style={{
            backgroundColor: theme.colors.primary,
            padding: theme.spacing.xl,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              marginBottom: theme.spacing.md,
            }}
          >
            CivicConnect
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "white",
              textAlign: "center",
              opacity: 0.9,
            }}
          >
            Report civic issues, track resolutions, improve your community
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={{ padding: theme.spacing.md }}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.xl,
              marginBottom: theme.spacing.md,
            }}
            onPress={() => navigation.navigate("ReportIssue")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Report an Issue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.xl,
              marginBottom: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.slate[200],
            }}
            onPress={() => navigation.navigate("AdminDashboard")}
          >
            <Text
              style={{
                color: theme.colors.textLight,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              View Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.xl,
              marginBottom: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.slate[200],
            }}
            onPress={() => navigation.navigate("About")}
          >
            <Text
              style={{
                color: theme.colors.textLight,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              About CivicConnect
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View
          style={{
            backgroundColor: theme.colors.slate[50],
            padding: theme.spacing.lg,
            margin: theme.spacing.md,
            borderRadius: theme.borderRadius.xl,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.colors.textLight,
              textAlign: "center",
              marginBottom: theme.spacing.md,
            }}
          >
            Community Impact
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme.colors.primary}
                style={{ alignSelf: "center" }}
              />
            ) : error ? (
              <Text
                style={{
                  color: theme.colors.slate[600],
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                {error}
              </Text>
            ) : !stats || stats.totalIssues === 0 ? (
              <Text
                style={{
                  color: theme.colors.slate[600],
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                No data available
              </Text>
            ) : (
              [
                {
                  number: `${stats.totalIssues.toLocaleString()}+`,
                  label: "Total Reported",
                },
                {
                  number: `${stats.resolvedIssues.toLocaleString()}+`,
                  label: "Resolved",
                },
                {
                  number: `${Math.round((stats.resolvedIssues / stats.totalIssues) * 100)}%`,
                  label: "Success Rate",
                },
              ].map((stat, index) => (
                <View key={index} style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: theme.colors.primary,
                    }}
                  >
                    {stat.number}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.slate[600],
                      textAlign: "center",
                    }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingPage;
