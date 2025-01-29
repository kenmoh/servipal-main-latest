import { createFont, createTokens } from "tamagui";
import { themes, size, space, radius, zIndex } from "@tamagui/themes";

const fontSize = {
  1: 12,
  2: 14,
  3: 16,
  4: 18,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 40,
  10: 48,
};

const weight = {
  1: "100", // Thin
  2: "200", // Extra Light
  3: "300", // Light
  4: "400", // Regular
  5: "500", // Medium
  6: "600", // Semi-Bold
  7: "700", // Bold
  8: "800", // Extra Bold
  9: "900", // Black
};

const letterSpacing = {
  1: 0,
  2: 0.25,
  3: 0.5,
  4: 0.75,
  5: 1,
  6: 1.25,
  7: 1.5,
  8: 1.75,
  9: 2,
};

const face = {
  // Define font faces for different weights and styles
  100: { normal: "Poppins-Thin", italic: "Poppins-ThinItalic" },
  200: { normal: "Poppins-ExtraLight", italic: "Poppins-ExtraLightItalic" },
  300: { normal: "Poppins-Light", italic: "Poppins-LightItalic" },
  400: { normal: "Poppins-Regular", italic: "Poppins-Italic" },
  500: { normal: "Poppins-Medium", italic: "Poppins-MediumItalic" },
  600: { normal: "Poppins-SemiBold", italic: "Poppins-SemiBoldItalic" },
  700: { normal: "Poppins-Bold", italic: "Poppins-BoldItalic" },
  800: { normal: "Poppins-ExtraBold", italic: "Poppins-ExtraBoldItalic" },
  900: { normal: "Poppins-Black", italic: "Poppins-BlackItalic" },
};

export const poppinsFont = createFont({
  family: "Poppins", // Font family name
  size: fontSize, // Font sizes
  weight, // Font weights
  letterSpacing, // Letter spacings
  face, // Font faces for weights/styles
});

export const tokens = createTokens({
  color: {
    cardLight: "#fff",
    cardDark: "rgba(30, 33, 39, 0.5)",
    primaryLight: "#0000CD",
    transparentTeal: "rgba(0,128, 128, 0.9)",
    primaryDark: "#ffffff",
    textLight: "#11181C",
    textDark: "#ddd",
    backgroundLight: "#eee",
    backgroundDark: "#18191c",
    error: "#ff8282",
    errorTransparent: "rgba(255, 130, 130, 0.35)",
    success: "#b9fbc0",
    successTransparent: "rgba(185, 251, 192, 0.7)",
    pending: "#fae1dd",
    pendingTransparent: "rgba(250, 225, 221, 0.5)",
    delivered: "#81b0ff",
    deliveredTransparent: "rgba(129, 176, 255, 0.35)",
    inputLight: "#f0f2f5",
    inputDark: "#303339",
    iconLight: "#687076",
    iconDark: "#9BA1A6",
    borderColorLight: "#eee",
    profileCardLight: "rgba(249, 242, 245, 0.5)",
    // profileCardLight: "#f0f2f5",
    // profileCardDark: "#30333940",
    // profileCardDark: "#303339",
    profileCardDark: "rgba(30, 33, 39, 0.5)",
    borderColorDark: "#2f4550",
    tabIconDefaultLight: "#687076",
    tabIconDefaultDark: "#ddd",
    transparentBtnPrimaryColor: "rgba(255, 168,0,0.35)",
  },
  space,
  size,
  radius,
  zIndex,
});

export const appTheme = {
  lightTheme: {
    ...themes.light,
    cardBackground: tokens.color.cardLight,
    background: tokens.color.backgroundLight,
    text: tokens.color.textLight,
    icon: tokens.color.iconLight,
    tabIconSelected: tokens.color.primaryLight,
    inputBackground: tokens.color.inputLight,
    borderColor: tokens.color.borderColorLight,
    primaryBtnColor: tokens.color.primaryLight,
    secondaryBtnColor: tokens.color.primaryDark,
    success: tokens.color.success,
    error: tokens.color.error,
    pendingColor: tokens.color.pending,
    delivered: tokens.color.delivered,
    btnPrimaryColor: "orange",
    profileCard: tokens.color.profileCardLight,
    tabIconDefault: tokens.color.tabIconDefaultLight,
  },
  darkTheme: {
    ...themes.dark,
    cardBackground: tokens.color.cardDark,
    background: tokens.color.backgroundDark,
    text: tokens.color.textDark,
    icon: tokens.color.iconDark,
    tabIconSelected: tokens.color.primaryDark,
    inputBackground: tokens.color.inputDark,
    borderColor: tokens.color.borderColorDark,
    primaryBtnColor: tokens.color.primaryLight,
    secondaryBtnColor: tokens.color.primaryDark,
    success: tokens.color.success,
    error: tokens.color.error,
    pendingColor: tokens.color.pending,
    delivered: tokens.color.delivered,
    btnPrimaryColor: "orange",
    profileCard: tokens.color.profileCardDark,
    tabIconDefault: tokens.color.tabIconDefaultDark,
  },
};
