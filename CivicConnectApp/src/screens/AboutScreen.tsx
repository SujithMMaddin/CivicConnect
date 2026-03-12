import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
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

type AboutScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "About"
>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();

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
        console.error("AboutScreen fetch error:", err);
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

      {/* Top App Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          justifyContent: "space-between",
          backgroundColor: theme.colors.backgroundLight,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 24, color: theme.colors.textLight }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.textLight,
            flex: 1,
            textAlign: "center",
          }}
        >
          About CivicConnect
        </Text>
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24, color: theme.colors.textLight }}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Header Image / Hero Section */}
        <View
          style={{
            backgroundColor: theme.colors.slate[50],
            padding: theme.spacing.md,
          }}
        >
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiLBbHf3V0AdRx9CRG2-W8hGDJWgTzbJAEM3L-kvfHgg3PTNnZumxU1M1e-9wERmri1p68vOQHemGp8LV95VaBsrwTlMJ2EZCQe3WwH-l59iQ3tC0_m9IlVUSacwgL8kUh-rAtE2y2YnOcybZkqJSJB8TKUXdhBw9yRgcFvndNNVwcRh9cTbOonHOuM4CuJ0T75dDGFsb1zWih_ks7yMHfyDg2IieMVjgh_zGX-lMqWji5zhd65lJYE78QLReRWqIUooXkxpqkIYzZ",
            }}
            style={{
              width: "100%",
              height: 240,
              borderRadius: theme.borderRadius.lg,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: theme.spacing.lg,
              backgroundColor: "rgba(16, 24, 34, 0.8)",
              borderBottomLeftRadius: theme.borderRadius.lg,
              borderBottomRightRadius: theme.borderRadius.lg,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: theme.colors.primary,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: theme.spacing.sm,
              }}
            >
              Urban Innovation
            </Text>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "white",
                lineHeight: 36,
              }}
            >
              Empowering{"\n"}Smarter Cities
            </Text>
          </View>
        </View>

        {/* Vision Section */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.primary + "20",
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.sm,
              }}
            >
              <Text style={{ fontSize: 24, color: theme.colors.primary }}>
                👁️
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: theme.colors.textLight,
                lineHeight: 28,
              }}
            >
              Our Vision
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.slate[600],
              lineHeight: 24,
              marginBottom: theme.spacing.lg,
            }}
          >
            To create a seamless, transparent, and responsive communication
            bridge between citizens and city officials, fostering a sustainable
            urban future where technology serves humanity.
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.slate[200],
            marginHorizontal: theme.spacing.md,
          }}
        />

        {/* Mission Section */}
        <View style={{ padding: theme.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.primary + "20",
                alignItems: "center",
                justifyContent: "center",
                marginRight: theme.spacing.sm,
              }}
            >
              <Text style={{ fontSize: 24, color: theme.colors.primary }}>
                🚀
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: theme.colors.textLight,
                lineHeight: 28,
              }}
            >
              Our Mission
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.slate[600],
              lineHeight: 24,
            }}
          >
            We deploy cutting-edge digital infrastructure to streamline urban
            governance. By modernizing issue reporting and resolution tracking,
            we enable local administrations to be more accountable and
            efficient.
          </Text>
        </View>

        {/* Core Pillars */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            padding: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          {[
            {
              icon: "🏛️",
              title: "Administrative Integrity",
              description:
                "Ensuring every report is logged, tracked, and verified by independent city audits.",
            },
            {
              icon: "👥",
              title: "Citizen Empowerment",
              description:
                "Giving a voice to every resident through simple, accessible mobile technology.",
            },
            {
              icon: "📊",
              title: "Data-Driven Decisions",
              description:
                "Using real-time analytics to prioritize infrastructure repairs and city services.",
            },
          ].map((pillar, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                minWidth: 140,
                backgroundColor: "white",
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.xl,
                borderWidth: 1,
                borderColor: theme.colors.slate[100],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 36, marginBottom: theme.spacing.sm }}>
                {pillar.icon}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: theme.colors.textLight,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {pillar.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.slate[600],
                  lineHeight: 20,
                }}
              >
                {pillar.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Impact Section */}
        <View
          style={{
            backgroundColor: theme.colors.primary,
            padding: theme.spacing.xl,
            marginTop: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              marginBottom: theme.spacing.lg,
            }}
          >
            Current Impact
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {[
              {
                number: `${stats?.totalIssues?.toLocaleString() || 0}+`,
                label: "Total Reported",
              },
              {
                number: `${stats?.resolvedIssues?.toLocaleString() || 0}+`,
                label: "Resolved",
              },
              {
                number: `${stats ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100 || 0) : 0}%`,
                label: "Resolution Rate",
              },
            ].map((stat, index) => (
              <View key={index} style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {stat.number}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "white",
                    opacity: 0.8,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer CTA */}
        <View
          style={{
            padding: theme.spacing.lg,
            alignItems: "center",
            backgroundColor: theme.colors.backgroundLight,
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
            Ready to improve your neighborhood?
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.xl,
              borderRadius: theme.borderRadius.xl,
              width: "80%",
              maxWidth: 300,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={() => navigation.navigate("ReportIssue")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Start Reporting
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.slate[500],
              textAlign: "center",
              marginTop: theme.spacing.lg,
            }}
          >
            © 2023 CivicConnect. Building the future of urban life.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
