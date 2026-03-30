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

const Section = ({ title, content }: { title: string; content: string }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconBox}>
            <Ionicons name="document-text-outline" size={36} color="#2563EB" />
          </View>
          <Text style={styles.heroTitle}>Terms of Service</Text>
          <Text style={styles.heroSubtitle}>Last updated: January 2025</Text>
        </View>

        <Text style={styles.intro}>
          By using CivicConnect, you agree to these terms. Please read them
          carefully before using our services.
        </Text>

        <Section
          title="1. Acceptance of Terms"
          content="By accessing or using CivicConnect, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our application."
        />
        <Section
          title="2. Use of Service"
          content="CivicConnect is a civic issue reporting platform. You agree to use this service only for its intended purpose — reporting genuine civic issues in your community. Misuse, spam, or false reports are strictly prohibited."
        />
        <Section
          title="3. User Accounts"
          content="You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to keep your profile information up to date."
        />
        <Section
          title="4. Content Responsibility"
          content="You are solely responsible for the content you submit, including issue descriptions and photos. You must not submit content that is false, misleading, offensive, or violates any applicable laws."
        />
        <Section
          title="5. Location Data"
          content="CivicConnect collects your location data only when you submit an issue report. This data is used solely to identify the location of the reported civic problem and is not shared with third parties."
        />
        <Section
          title="6. Intellectual Property"
          content="All content, design, and technology within CivicConnect is the property of CivicConnect and is protected by applicable intellectual property laws."
        />
        <Section
          title="7. Limitation of Liability"
          content="CivicConnect is not liable for any direct, indirect, or consequential damages arising from your use of the platform. We do not guarantee that reported issues will be resolved by civic authorities."
        />
        <Section
          title="8. Termination"
          content="We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time through the Privacy & Security settings."
        />
        <Section
          title="9. Changes to Terms"
          content="We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms."
        />
        <Section
          title="10. Contact"
          content="If you have questions about these terms, please contact us at support@civicconnect.app."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
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
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  heroSubtitle: { fontSize: 13, color: "#9CA3AF" },
  intro: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  sectionContent: { fontSize: 14, color: "#6B7280", lineHeight: 22 },
});
