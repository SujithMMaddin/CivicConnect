import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
