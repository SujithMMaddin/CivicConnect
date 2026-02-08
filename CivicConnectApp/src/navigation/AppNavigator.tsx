import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
  Landing: undefined;
  About: undefined;
  ReportIssue: undefined;
  ContactSupport: undefined;
  AdminDashboard: undefined;
  CivicDataInsights: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Landing"
          component={require("../screens/LandingPage").default}
        />
        <Stack.Screen
          name="About"
          component={require("../screens/AboutScreen").default}
        />
        <Stack.Screen
          name="ReportIssue"
          component={require("../screens/ReportIssueScreen").default}
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
