import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Language } from "../utils/translations";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

const REGIONS = [
  { code: "IN-KA", label: "Karnataka, India" },
  { code: "IN-MH", label: "Maharashtra, India" },
  { code: "IN-TN", label: "Tamil Nadu, India" },
  { code: "IN-TS", label: "Telangana, India" },
  { code: "IN-DL", label: "Delhi, India" },
  { code: "IN-UP", label: "Uttar Pradesh, India" },
  { code: "IN-GJ", label: "Gujarat, India" },
  { code: "IN-RJ", label: "Rajasthan, India" },
];

export default function AppSettingsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedRegion, setSelectedRegion] = useState("IN-KA");
  const [saved, setSaved] = useState(false);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        const lang = await AsyncStorage.getItem("app_language");
        const region = await AsyncStorage.getItem("app_region");
        if (lang) setSelectedLanguage(lang);
        if (region) setSelectedRegion(region);
      } catch (err) {
        console.error("Load settings error:", err);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("app_language", selectedLanguage);
      await AsyncStorage.setItem("app_region", selectedRegion);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setLanguage(selectedLanguage as Language);
      Alert.alert(
        "Settings Saved",
        "Your language and region preferences have been saved.",
      );
    } catch (err) {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          App Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          LANGUAGE
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {LANGUAGES.map((lang, index) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.optionItem,
                { borderBottomColor: colors.border },
                index === LANGUAGES.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {lang.label}
                </Text>
                <Text
                  style={[styles.optionSubLabel, { color: colors.textMuted }]}
                >
                  {lang.native}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor:
                      selectedLanguage === lang.code
                        ? "#2563EB"
                        : colors.textMuted,
                  },
                  selectedLanguage === lang.code && {
                    backgroundColor: "#2563EB",
                  },
                ]}
              >
                {selectedLanguage === lang.code && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Region Section */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          REGION
        </Text>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {REGIONS.map((region, index) => (
            <TouchableOpacity
              key={region.code}
              style={[
                styles.optionItem,
                { borderBottomColor: colors.border },
                index === REGIONS.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => setSelectedRegion(region.code)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {region.label}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor:
                      selectedRegion === region.code
                        ? "#2563EB"
                        : colors.textMuted,
                  },
                  selectedRegion === region.code && {
                    backgroundColor: "#2563EB",
                  },
                ]}
              >
                {selectedRegion === region.code && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Save Button */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.saveButton, saved && { backgroundColor: "#10B981" }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons
            name={saved ? "checkmark" : "save-outline"}
            size={18}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.saveButtonText}>
            {saved ? "Saved!" : "Save Settings"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scroll: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  optionLeft: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: "500" },
  optionSubLabel: { fontSize: 12, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
