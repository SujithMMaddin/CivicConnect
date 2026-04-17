import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { supabase } from "../api/supabase";
import {
  checkIssueStatusChanges,
  checkNearbyIssues,
} from "../api/notificationService";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Check session and navigate
    const timer = setTimeout(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          navigation.replace("MainTabs"); // already logged in
        } else {
          navigation.replace("Login"); // not logged in
        }

        if (session) {
          // Check status changes
          await checkIssueStatusChanges(session.user.id);

          // Check nearby issues
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            await checkNearbyIssues(
              loc.coords.latitude,
              loc.coords.longitude,
              2,
            );
          }
          navigation.replace("MainTabs");
        } else {
          navigation.replace("Login");
        }
      } catch (err) {
        navigation.replace("Login"); // on error go to login
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Animated Logo Video */}
      <Video
        source={require("../../assets/logo-animation1.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        isMuted
      />

      {/* App Name + Subtitle */}
      <Animated.View style={[styles.textContent, { opacity: fadeAnim }]}>
        <Text style={styles.title}>CivicConnect</Text>
        <View style={styles.accentLine} />
        <Text style={styles.subtitle}>REPORT & TRACK ISSUES</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>SECURE GOVERNMENT PORTAL</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 16,
  },
  textContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: "#2563EB",
    marginVertical: 10,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  footerText: {
    fontSize: 10,
    color: "#9CA3AF",
    letterSpacing: 1,
    fontWeight: "500",
  },
});
