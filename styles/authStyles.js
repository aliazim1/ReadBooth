import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { hp, wp } from "../lib/common";
import { appTheme, colors } from "../config/theme";
import { ThemeContext } from "../contexts/ThemeContext";

export const authStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // welcome styles
        container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
          paddingTop: hp(15),
          paddingHorizontal: wp(4),
          backgroundColor: activeColors.background,
        },
        contentContainerStyer: {
          flexGrow: 1,
          paddingHorizontal: 24,
        },
        footer: {
          marginTop: hp(15),
          width: "100%",
          gap: 20,
        },
        btnTitle: {
          color: activeColors.white,
          fontWeight: appTheme.fonts.bold,
        },
        signinBtn: {
          backgroundColor: activeColors.white,
        },
        btn: {
          marginTop: hp(3),
        },
        noAccountContainer: {
          flex: 1,
          justifyContent: "flex-end",
        },
        noAccountContainerRow: {
          flexDirection: "row",
          justifyContent: "center",
        },
        primaryColorText: {
          marginLeft: 5,
          fontWeight: appTheme.fonts.bold,
          color: activeColors.primary,
        },
        errorContainer: {
          width: "100%",
          paddingHorizontal: 8,
          marginVertical: 12,
        },
        errorText: {
          fontSize: 13,
          color: activeColors.danger,
        },
        btnContainer: {
          marginBottom: hp(3),
          flexDirection: "row",
          justifyContent: "space-between",
        },
      }),
    [theme],
  );
  return { styles, activeColors };
};
