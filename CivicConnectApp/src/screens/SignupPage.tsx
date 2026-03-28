import React, { useState } from "react";
import { Image } from "react-native";
import { supabase } from "../api/supabase";
import { Alert } from "react-native";
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
import { Svg, Path, Ellipse } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const BackgroundGraphics = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path
          d="M 10 100 Q 150 50 300 250"
          stroke="#CED4DA"
          strokeWidth="0.5"
          fill="none"
        />
        <Path
          d="M 280 80 Q 320 200 400 120"
          stroke="#ADB5BD"
          strokeWidth="1"
          strokeDasharray="3, 3"
          fill="none"
        />
        <Ellipse
          cx="30"
          cy="90%"
          rx="100"
          ry="150"
          stroke="#E0E0E0"
          strokeWidth="1"
          fill="none"
        />
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

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        Alert.alert("Signup Failed", error.message);
        return;
      }
      Alert.alert(
        "Registration Successful",
        "Your account has been created. Please check your email to verify your account.",
        [{ text: "Continue", onPress: () => navigation.navigate("Login") }],
      );
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundGraphics />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.logoSubtitle}>JOIN THE COMMUNITY</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start contributing to a better neighborhood today.
            </Text>

            {/* Full Name Input */}
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

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

            {/* Confirm Password Input */}
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpButtonText}>Register Now</Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation?.goBack()}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Legal Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerCopyright}>
              By signing up, you agree to our Terms and Privacy Policy.
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
    paddingVertical: 20,
  },
  keyboardView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    elevation: 4,
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
    paddingHorizontal: 10,
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
    marginBottom: 16,
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
  signUpButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#4B5563",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  footerCopyright: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
  },
});
