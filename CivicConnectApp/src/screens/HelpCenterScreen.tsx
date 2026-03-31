import React, { useState } from "react";
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

const FAQS = [
  {
    question: "How do I report a civic issue?",
    answer:
      "Tap the '+' button at the bottom of the screen. Select the issue category, set the location using the map or your current GPS, add a description and optional photos, then tap Submit.",
  },
  {
    question: "Can I track the status of my report?",
    answer:
      "Yes! Go to Profile → My Reports to see all your submitted reports along with their current status: Pending, In Progress, or Resolved.",
  },
  {
    question: "What categories of issues can I report?",
    answer:
      "You can report Potholes, Street Lights, Water issues, Trash, Graffiti, Traffic Signs, Sidewalk damage, Parking problems, Noise complaints, and more.",
  },
  {
    question: "How is the priority of an issue determined?",
    answer:
      "Water-related issues are automatically assigned High priority. All other issues are assigned Medium priority by default. Admins can update priorities as needed.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "Your report is sent to the civic authority dashboard. An admin will review it and update the status. You can track progress in My Reports.",
  },
  {
    question: "Can I see issues reported by others?",
    answer:
      "Yes! The Home and Issues tabs show all community-reported issues in your area so you stay informed about civic problems nearby.",
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to Profile → Personal Information. You can update your display name there. Email changes require contacting support.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Profile → Privacy & Security → Change Password. Enter your new password twice and tap Update Password.",
  },
  {
    question: "Is my location data stored?",
    answer:
      "Location data is only collected when you submit an issue report. It is used solely to identify where the civic problem is located.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email us at support@civicconnect.app. We typically respond within 24 hours.",
  },
];

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>
          {question}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textSecondary}
        />
      </View>
      {expanded && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
          {answer}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function HelpCenterScreen() {
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
          Help Center
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroIconBox}>
            <Ionicons name="help-circle-outline" size={36} color="#2563EB" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            How can we help?
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Find answers to common questions about CivicConnect
          </Text>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>
        <View
          style={[
            styles.faqCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {FAQS.map((faq, index) => (
            <View key={index}>
              <FAQItem question={faq.question} answer={faq.answer} />
              {index < FAQS.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
              )}
            </View>
          ))}
        </View>

        <View
          style={[
            styles.contactCard,
            {
              backgroundColor: isDark ? "#1e3a5f" : "#EFF6FF",
              borderColor: isDark ? "#1D4ED8" : "#BFDBFE",
            },
          ]}
        >
          <Ionicons name="mail-outline" size={24} color="#2563EB" />
          <View style={styles.contactText}>
            <Text
              style={[
                styles.contactTitle,
                { color: isDark ? "#93C5FD" : "#1E40AF" },
              ]}
            >
              Still need help?
            </Text>
            <Text style={[styles.contactSubtitle, { color: "#3B82F6" }]}>
              Email us at support@civicconnect.app
            </Text>
          </View>
        </View>
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
  hero: { alignItems: "center", marginBottom: 28 },
  heroIconBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  heroSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  faqItem: { padding: 16 },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  faqAnswer: { fontSize: 13, marginTop: 10, lineHeight: 20 },
  divider: { height: 1, marginHorizontal: 16 },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  contactText: { flex: 1 },
  contactTitle: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  contactSubtitle: { fontSize: 13 },
});
