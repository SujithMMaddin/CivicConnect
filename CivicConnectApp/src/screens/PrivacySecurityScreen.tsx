import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../api/supabase";
import { useTheme } from "../context/ThemeContext";

const SecurityItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isLast,
  destructive,
}: any) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        { borderBottomColor: colors.border },
        isLast && { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: destructive ? "#FEE2E2" : colors.background },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? "#EF4444" : colors.textSecondary}
        />
      </View>
      <View style={styles.settingsTextContainer}>
        <Text
          style={[
            styles.settingsTitle,
            { color: destructive ? "#EF4444" : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingsSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const ChangePasswordModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { colors } = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        Alert.alert("Failed", error.message);
        return;
      }
      Alert.alert("Success", "Your password has been updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            setNewPassword("");
            setConfirmPassword("");
            onClose();
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetIconBox}>
              <Ionicons name="lock-closed-outline" size={24} color="#2563EB" />
            </View>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              Change Password
            </Text>
            <Text
              style={[styles.sheetSubtitle, { color: colors.textSecondary }]}
            >
              Choose a strong password with at least 6 characters
            </Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            New Password
          </Text>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons
                name={showNew ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Confirm Password
          </Text>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {confirmPassword.length > 0 && (
            <View style={styles.matchRow}>
              <Ionicons
                name={
                  newPassword === confirmPassword
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={newPassword === confirmPassword ? "#10B981" : "#EF4444"}
              />
              <Text
                style={[
                  styles.matchText,
                  {
                    color:
                      newPassword === confirmPassword ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                {newPassword === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.updateBtn, loading && { opacity: 0.7 }]}
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.updateBtnText}>Update Password</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: colors.border }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.cancelBtnText, { color: colors.textSecondary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function PrivacySecurityScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your reported issues. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Contact Support",
              "To delete your account, please contact support@civicconnect.app",
            ),
        },
      ],
    );
  };

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
          Privacy & Security
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          PASSWORD
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SecurityItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => setChangePasswordVisible(true)}
            isLast
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          PRIVACY
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SecurityItem
            icon="eye-off-outline"
            title="Data Usage"
            subtitle="How we use your data"
            onPress={() =>
              Alert.alert(
                "Data Usage",
                "We only collect location data when you report issues. Your data is never sold to third parties.",
              )
            }
          />
          <SecurityItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() =>
              Alert.alert(
                "Privacy Policy",
                "CivicConnect collects minimal data required to provide civic reporting services. All data is stored securely.",
              )
            }
            isLast
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          DANGER ZONE
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <SecurityItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            isLast
            destructive
          />
        </View>
      </ScrollView>

      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 1,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsTextContainer: { flex: 1 },
  settingsTitle: { fontSize: 15, fontWeight: "500" },
  settingsSubtitle: { fontSize: 12, marginTop: 2 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: { alignItems: "center", marginBottom: 24 },
  sheetIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  sheetSubtitle: { fontSize: 13, textAlign: "center", lineHeight: 18 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15 },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    marginTop: -8,
  },
  matchText: { fontSize: 12, fontWeight: "500" },
  updateBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateBtnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  cancelBtn: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  cancelBtnText: { fontSize: 15, fontWeight: "600" },
});
