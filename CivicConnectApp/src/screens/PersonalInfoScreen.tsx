import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../api/supabase";
import { useTheme } from "../context/ThemeContext";

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setFullName(user?.user_metadata?.full_name || "");
      } catch (err) {
        console.error("Load user error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
      Alert.alert("Success", "Your name has been updated.");
      setEditing(false);
    } catch (err) {
      Alert.alert("Error", "Could not update your name. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Personal Information
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={44} color="#2563EB" />
          </View>
          <Text style={[styles.avatarName, { color: colors.text }]}>
            {fullName || "Civic User"}
          </Text>
          <Text style={[styles.avatarRole, { color: "#2563EB" }]}>
            Community Member
          </Text>
        </View>

        {/* Full Name */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          ACCOUNT DETAILS
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.fieldRow}>
            <View style={styles.fieldLeft}>
              <Text
                style={[styles.fieldLabel, { color: colors.textSecondary }]}
              >
                Full Name
              </Text>
              {editing ? (
                <TextInput
                  style={[
                    styles.fieldInput,
                    { color: colors.text, borderColor: colors.border },
                  ]}
                  value={fullName}
                  onChangeText={setFullName}
                  autoFocus
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: colors.text }]}>
                  {fullName || "Not set"}
                </Text>
              )}
            </View>
            {editing ? (
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={() => setEditing(false)}
                  style={styles.cancelBtn}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                style={[
                  styles.editBtn,
                  { backgroundColor: isDark ? colors.border : "#EFF6FF" },
                ]}
              >
                <Ionicons name="pencil-outline" size={16} color="#2563EB" />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Email */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldLeft}>
              <Text
                style={[styles.fieldLabel, { color: colors.textSecondary }]}
              >
                Email Address
              </Text>
              <Text style={[styles.fieldValue, { color: colors.text }]}>
                {user?.email || "No email"}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Account Info */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          ACCOUNT INFO
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textSecondary}
            />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Member Since
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {memberSince}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons
              name="finger-print-outline"
              size={18}
              color={colors.textSecondary}
            />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                User ID
              </Text>
              <Text
                style={[styles.infoValue, { color: colors.text }]}
                numberOfLines={1}
              >
                {user?.id?.slice(0, 16)}...
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#BFDBFE",
  },
  avatarName: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  avatarRole: { fontSize: 13, fontWeight: "600" },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  fieldRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  fieldLeft: { flex: 1 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  fieldValue: { fontSize: 15, fontWeight: "500" },
  fieldInput: {
    fontSize: 15,
    fontWeight: "500",
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginTop: 2,
  },
  editActions: { flexDirection: "row", gap: 8 },
  cancelBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: { fontSize: 12, fontWeight: "600", color: "#10B981" },
  divider: { height: 1, marginHorizontal: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "500" },
});
