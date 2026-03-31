import React, { createContext, useContext, useState } from "react";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors & { statusBar: "dark-content" | "light-content" };
}

const lightColors = {
  background: "#F9FAFB",
  card: "#FFFFFF",
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "#F3F4F6",
  primary: "#2563EB",
  tabBar: "#FFFFFF",
  statusBar: "dark-content" as const,
  inputBg: "#F3F4F6",
  sectionBg: "#EFF4FB",
  accent: "#DBEAFE",
};

const darkColors = {
  background: "#0F172A",
  card: "#1E293B",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  border: "#334155",
  primary: "#3B82F6",
  tabBar: "#1E293B",
  statusBar: "light-content" as const,
  inputBg: "#334155",
  sectionBg: "#0F172A",
  accent: "#1E3A5F",
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = (
    theme === "dark" ? darkColors : lightColors
  ) as typeof lightColors & { statusBar: "dark-content" | "light-content" };
  return (
    <ThemeContext.Provider
      value={{ theme, isDark: theme === "dark", toggleTheme, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
