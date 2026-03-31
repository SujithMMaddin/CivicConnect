import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using CivicConnect, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our application.",
  },
  {
    title: "2. Use of Service",
    content:
      "CivicConnect is a civic issue reporting platform. You agree to use this service only for its intended purpose — reporting genuine civic issues in your community. Misuse, spam, or false reports are strictly prohibited.",
  },
  {
    title: "3. User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to keep your profile information up to date.",
  },
  {
    title: "4. Content Responsibility",
    content:
      "You are solely responsible for the content you submit, including issue descriptions and photos. You must not submit content that is false, misleading, offensive, or violates any applicable laws.",
  },
  {
    title: "5. Location Data",
    content:
      "CivicConnect collects your location data only when you submit an issue report. This data is used solely to identify the location of the reported civic problem and is not shared with third parties.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content, design, and technology within CivicConnect is the property of CivicConnect and is protected by applicable intellectual property laws.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "CivicConnect is not liable for any direct, indirect, or consequential damages arising from your use of the platform. We do not guarantee that reported issues will be resolved by civic authorities.",
  },
  {
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time through the Privacy & Security settings.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.",
  },
  {
    title: "10. Contact",
    content:
      "If you have questions about these terms, please contact us at support@civicconnect.app.",
  },
];

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

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
          Terms of Service
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroIconBox}>
            <Ionicons name="document-text-outline" size={36} color="#2563EB" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Terms of Service
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Last updated: January 2025
          </Text>
        </View>

        <View
          style={[
            styles.introBanner,
            {
              backgroundColor: isDark ? "#1e3a5f" : "#EFF6FF",
              borderLeftColor: "#2563EB",
            },
          ]}
        >
          <Text
            style={[
              styles.introText,
              { color: isDark ? "#93C5FD" : "#1E40AF" },
            ]}
          >
            By using CivicConnect, you agree to these terms. Please read them
            carefully before using our services.
          </Text>
        </View>

        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {s.title}
            </Text>
            <Text
              style={[styles.sectionContent, { color: colors.textSecondary }]}
            >
              {s.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerTitle: { fontSize: 17, fontWeight: "700" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  hero: { alignItems: "center", marginBottom: 24 },
  heroIconBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  heroSubtitle: { fontSize: 13 },
  introBanner: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  introText: { fontSize: 14, lineHeight: 22 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  sectionContent: { fontSize: 14, lineHeight: 22 },
});
