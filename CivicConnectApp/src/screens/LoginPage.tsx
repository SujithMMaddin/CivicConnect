import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { supabase } from "../api/supabase";
import { Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import * as AuthSession from "expo-auth-session";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { Svg, Path, Ellipse } from "react-native-svg"; // <-- Use SVG for lines
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Simple component for background curves and dotted lines
WebBrowser.maybeCompleteAuthSession();
const BackgroundGraphics = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        {/* Solid large curve at the top */}
        <Path
          d="M 10 100 Q 150 50 300 250"
          stroke="#CED4DA"
          strokeWidth="0.5"
          fill="none"
        />
        {/* Dotted curve in upper right */}
        <Path
          d="M 280 80 Q 320 200 400 120"
          stroke="#ADB5BD"
          strokeWidth="1"
          strokeDasharray="3, 3" // This creates the dots
          fill="none"
        />
        {/* Small ellipse/circle in lower bottom */}
        <Ellipse
          cx="30"
          cy="90%"
          rx="100"
          ry="150"
          stroke="#E0E0E0"
          strokeWidth="1"
          fill="none"
        />
        {/* Dotted diagonal in the footer */}
        <Path
          d="M 0 780 L 100 880"
          stroke="#ADB5BD"
          strokeWidth="1"
          strokeDasharray="5, 5"
          fill="none"
        />
      </Svg>
    </View>
  );
};

export default function LoginScreen() {
  type NavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log("Google button tapped");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "civicconnect://auth/callback",
          skipBrowserRedirect: false,
        },
      });
      console.log("Supabase data:", JSON.stringify(data));
      console.log("Supabase error:", JSON.stringify(error));
      if (error) {
        Alert.alert("Google Sign In Failed", error.message);
        return;
      }
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "civicconnect://auth/callback",
        );
        console.log("Browser result:", JSON.stringify(result));
        if (result.type === "success") {
          navigation.navigate("Landing");
        }
      }
    } catch (err) {
      console.error("Google Sign In error:", err);
      Alert.alert("Error", "Google Sign In failed. Please try again.");
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }
      navigation.navigate("Landing");
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundGraphics />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              <Image
                source={require("../../assets/applogo.png")}
                style={styles.logoIcon}
              />
              <Text style={styles.logoTitle}>CivicConnect</Text>
            </View>
            <Text style={styles.logoSubtitle}>REPORT & TRACK ISSUES</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue making your community better.
            </Text>

            {/* Email Input */}
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SECURE LOGIN WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="finger-print" size={24} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
              >
                {/* Note: In production you might want an official Google SVG icon */}
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color="#4B5563"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLinksRow}>
              <Text style={styles.footerLink}>PRIVACY POLICY</Text>
              <Text style={styles.footerLink}>TERMS OF SERVICE</Text>
              <Text style={styles.footerLink}>HELP CENTER</Text>
            </View>
            <Text style={styles.footerCopyright}>
              © 2024 CIVICCONNECT. SECURE GOVERNMENT PORTAL.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 6,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2563EB",
    letterSpacing: 1.5,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4, // for android shadow
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 18,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 22,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#4B5563",
  },
  signInButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  socialButton: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#4B5563",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerLinksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "80%",
  },
  footerLink: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.8,
  },
  footerCopyright: {
    fontSize: 10,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
});
