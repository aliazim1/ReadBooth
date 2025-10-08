import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { appTheme, colors } from "../constants/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../helpers/common";

export const useScreensStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // add book styles
        postHeader: {
          gap: 12,
          paddingTop: hp(1.5),
          flexDirection: "row",
          alignItems: "center",
        },
        name: {
          fontSize: hp(2.2),
          color: activeColors.text,
          fontWeight: appTheme.fonts.semibold,
        },
        publicText: {
          fontSize: hp(1.5),
          color: activeColors.mediumGrey,
          fontWeight: appTheme.fonts.medium,
        },
        textInputs: {
          paddingVertical: 14,
          marginVertical: hp(0.5),
          textAlignVertical: "top",
        },
        file: {
          width: "100%",
          height: hp(30),
          overflow: "hidden",
          marginTop: hp(2),
          borderCurve: "continuous",
          borderRadius: appTheme.radius.xl,
        },
        deleteIcon: {
          top: 10,
          right: 10,
          width: 30,
          height: 30,
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: appTheme.radius.xl,
          backgroundColor: "rgba(255, 0, 0, 0.6)",
        },
        mediaContainer: {
          padding: 10,
          borderWidth: 0.7,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          marginVertical: hp(2),
          borderCurve: "continuous",
          borderRadius: appTheme.radius.md,
          justifyContent: "space-between",
          borderColor: activeColors.mediumGrey,
        },
        addMediaText: {
          fontSize: hp(1.6),
          fontWeight: appTheme.fonts.bold,
        },
        mediaIconContainer: {
          gap: 25,
          alignItems: "center",
          flexDirection: "row",
        },
        mediaIcon: {
          padding: 5,
          elevation: 5,
          shadowRadius: 3,
          shadowOpacity: 0.7,
          borderRadius: appTheme.radius.xxl,
          backgroundColor: activeColors.text,
          shadowOffset: { width: 0, height: 1 },
          shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
        },

        successContainer: {
          zIndex: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: activeColors.background,
        },
        animationContainer: {
          width: wp(55),
          height: wp(55),
          alignItems: "center",
          justifyContent: "center",
        },
        lottie: {
          width: 250,
          height: 250,
        },

        // edit profile details styles
        contentContainerStyle: {
          flexGrow: 1,
          marginTop: 10,
          marginBottom: 20,
          paddingHorizontal: wp(4),
        },
        profileDetails: {
          marginTop: hp(1),
          alignItems: "center",
          justifyContent: "center",
        },
        add: {
          position: "absolute",
          bottom: -10,
          left: wp(8.5),
          borderRadius: 50,
          paddingVertical: 1,
          paddingHorizontal: 8,
          backgroundColor: activeColors.text,
          shadowColor: "#0000006b",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 5,
        },
        avatar: {
          width: 100,
          height: 100,
          borderRadius: 100,
        },
        bio: {
          height: hp(15),
          paddingVertical: 15,
          flexDirection: "row",
          alignItems: "flex-start",
        },

        // settings styles
        version: {
          alignItems: "center",
          marginVertical: hp(5),
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
