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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={36}
              color="#2563EB"
            />
          </View>
          <Text style={styles.heroTitle}>Privacy Policy</Text>
          <Text style={styles.heroSubtitle}>Last updated: January 2025</Text>
        </View>

        <Text style={styles.intro}>
          Your privacy matters to us. This policy explains what data we collect,
          how we use it, and how we protect it.
        </Text>

        <Section
          title="1. Information We Collect"
          content="We collect the following information when you use CivicConnect: your email address and name when you register, location data when you submit an issue report, issue descriptions and photos you submit, and app usage data to improve our service."
        />
        <Section
          title="2. How We Use Your Information"
          content="Your information is used to provide and improve the CivicConnect service, to display your reported issues on the community map, to allow civic authorities to address reported issues, and to send you notifications about your reports."
        />
        <Section
          title="3. Location Data"
          content="Location access is requested only when you submit an issue report. We do not track your location in the background. Location data is stored alongside your issue report to identify the problem area."
        />
        <Section
          title="4. Data Storage"
          content="Your data is stored securely using Supabase, which complies with industry-standard security practices. All data is encrypted in transit using HTTPS."
        />
        <Section
          title="5. Data Sharing"
          content="We do not sell your personal data to third parties. Issue reports (category, location, description) are shared with relevant civic authorities to facilitate resolution. Your personal email is never shared."
        />
        <Section
          title="6. Data Retention"
          content="Your account data is retained as long as your account is active. Issue reports are retained for record-keeping purposes. You may request deletion of your account and associated data at any time."
        />
        <Section
          title="7. Your Rights"
          content="You have the right to access your personal data, correct inaccurate data, request deletion of your data, and withdraw consent at any time. To exercise these rights, contact us at support@civicconnect.app."
        />
        <Section
          title="8. Cookies & Analytics"
          content="The mobile app does not use cookies. We may use anonymized analytics to understand app usage patterns and improve the user experience."
        />
        <Section
          title="9. Children's Privacy"
          content="CivicConnect is not intended for users under the age of 13. We do not knowingly collect personal information from children."
        />
        <Section
          title="10. Contact Us"
          content="If you have questions or concerns about this privacy policy, please contact us at support@civicconnect.app or through the Help Center in the app."
        />

        {/* Badge */}
        <View style={styles.badge}>
          <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
          <Text style={styles.badgeText}>
            Your data is encrypted and secure
          </Text>
        </View>
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
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  badgeText: { fontSize: 14, fontWeight: "600", color: "#065F46" },
});
