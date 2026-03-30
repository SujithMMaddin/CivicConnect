import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../api/supabase";

export default function PersonalInfoScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setFullName(user?.user_metadata?.full_name || "");
        setEmail(user?.email || "");
      } catch (err) {
        console.error("Load user error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSaveName = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) {
        Alert.alert("Update Failed", error.message);
        return;
      }
      setEditingName(false);
      Alert.alert("Success", "Your name has been updated successfully.");
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#2563EB" />
          </View>
          <Text style={styles.avatarName}>{fullName || "Civic User"}</Text>
          <Text style={styles.avatarRole}>Community Member</Text>
        </View>

        {/* Profile Details */}
        <Text style={styles.sectionTitle}>PROFILE DETAILS</Text>
        <View style={styles.sectionCard}>
          {/* Full Name */}
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconBox}>
                <Ionicons name="person-outline" size={18} color="#4B5563" />
              </View>
              <Text style={styles.infoLabel}>FULL NAME</Text>
            </View>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={fullName}
                  onChangeText={setFullName}
                  autoFocus
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveName}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setEditingName(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{fullName || "Not set"}</Text>
                <TouchableOpacity
                  onPress={() => setEditingName(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil-outline" size={18} color="#2563EB" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Email */}
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconBox}>
                <Ionicons name="mail-outline" size={18} color="#4B5563" />
              </View>
              <Text style={styles.infoLabel}>EMAIL ADDRESS</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{email || "Not set"}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Member Since */}
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconBox}>
                <Ionicons name="calendar-outline" size={18} color="#4B5563" />
              </View>
              <Text style={styles.infoLabel}>MEMBER SINCE</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Account ID */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconBox}>
                <Ionicons
                  name="finger-print-outline"
                  size={18}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.infoLabel}>USER ID</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValueSmall} numberOfLines={1}>
                {user?.id || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#64748B" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  scroll: { flex: 1, paddingHorizontal: 16 },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BFDBFE",
    marginBottom: 12,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  avatarRole: { fontSize: 13, color: "#2563EB", fontWeight: "600" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#94A3B8",
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoItem: { padding: 16 },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#0F172A" },
  infoValueSmall: { fontSize: 12, color: "#64748B", flex: 1 },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
  editRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  editInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 13 },
  cancelBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cancelBtnText: { color: "#64748B", fontWeight: "600", fontSize: 13 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  verifiedText: { fontSize: 12, color: "#10B981", fontWeight: "600" },
});
