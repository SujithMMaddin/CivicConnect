import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Flag, Plus, User } from "lucide-react-native";

// ---------- Types ----------
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: { screen?: string } | undefined;
  ReportIssue: undefined;
  About: undefined;
  ContactSupport: undefined;
  AdminDashboard: undefined;
  CivicDataInsights: undefined;
};

export type TabParamList = {
  Home: undefined;
  Issues: undefined;
  Report: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ---------- Report Tab Button ----------
const ReportTabIcon = () => (
  <View style={styles.reportTabButton}>
    <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
  </View>
);

// ---------- Bottom Tab Navigator ----------
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#1E3A8A",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={require("../screens/LandingPage").default}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Issues"
        component={require("../screens/IssuesScreen").default}
        options={{
          tabBarIcon: ({ color }) => <Flag size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Report"
        component={require("../screens/ReportIssueScreen").default}
        options={{
          tabBarIcon: () => <ReportTabIcon />,
          tabBarLabel: "Report",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={require("../screens/ProfileScreen").default}
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ---------- Root Stack Navigator ----------
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Splash"
          component={require("../screens/SplashScreen").default}
        />
        <Stack.Screen
          name="Login"
          component={require("../screens/LoginPage").default}
        />
        <Stack.Screen
          name="Signup"
          component={require("../screens/SignupPage").default}
        />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="About"
          component={require("../screens/AboutScreen").default}
        />
        <Stack.Screen
          name="ContactSupport"
          component={require("../screens/ContactSupportScreen").default}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={require("../screens/AdminDashboardScreen").default}
        />
        <Stack.Screen
          name="CivicDataInsights"
          component={require("../screens/CivicDataInsightsScreen").default}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// ---------- Styles ----------
const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingBottom: 12,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  reportTabButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginBottom: 22,
  },
});
