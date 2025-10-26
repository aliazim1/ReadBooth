import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { appTheme, colors } from "../config/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../lib/common";

export const useScreensStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // postDetails
        startLoadingContainer: {
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: activeColors.background,
        },
        notFound: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        container: {
          flex: 1,
          backgroundColor: activeColors.background,
        },
        commentsListContainer: {
          gap: 10,
          marginVertical: 16,
          paddingBottom: hp(5),
        },
        commentCountContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
        commentCountLabel: {
          fontSize: hp(1.4),
          marginRight: 5,
          paddingLeft: wp(4),
          fontWeight: appTheme.fonts.bold,
        },
        commentCount: {
          fontSize: hp(1.4),
        },
        beFirst: {
          fontSize: hp(1.4),
          paddingLeft: wp(4),
        },

        // add book styles
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
          backgroundColor: activeColors.background,
          shadowColor: "#0000006b",
          shadowOffset: { width: 0, height: 2 },
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

        // follows screen styles
        headerIcons: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginRight: 12,
        },
        tabBarIndicatorStyle: {
          width: 172,
          marginLeft: 18,
          backgroundColor: activeColors.primary,
        },
        headerIconsContainer: {
          gap: 12,
          marginRight: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },

        noNofiticationsContainer: {
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 10,
        },
        contentContainerStyle: {
          paddingTop: 20,
          gap: 14,
          paddingHorizontal: wp(4),
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
