import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { appTheme, colors } from "../config/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../lib/common";

export const useTabsStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // tabs _layout styles
        tabBarStyles: {
          paddingTop: 8,
          borderTopWidth: 0.2,
          alignItems: "center",
          paddingHorizontal: 18,
          justifyContent: "center",
          borderTopColor: activeColors.tabBarBorder,
          backgroundColor: activeColors.background,
        },
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        tabBarBadge: {
          backgroundColor: activeColors.danger,
          color: "white",
        },
        homeHeaderTitle: {
          fontSize: hp(2),
          marginLeft: 12,
          color: activeColors.text,
          fontWeight: appTheme.fonts.extraBold,
        },

        //
        // book, notification & profile header title
        nbpHeaderTitle: {
          marginLeft: 12,
          fontWeight: appTheme.fonts.bold,
        },
        tabBarIcons: {
          width: 40,
          height: 40,
          padding: 5,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        },

        // home styles
        headerIcons: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginRight: 12,
        },
        outerContainer: {
          flex: 1,
          backgroundColor: activeColors.background,
        },
        homeContentContainerStyle: {
          paddingTop: hp(1),
          paddingBottom: hp(2),
        },
        ItemSeparatorComponent: {
          height: 1,
          marginVertical: 10,
          backgroundColor: activeColors.mediumGrey,
        },
        loadingContainer: {
          alignItems: "center",
          justifyContent: "center",
        },
        noMorePost: {
          fontSize: hp(1.3),
          marginVertical: 20,
        },

        // books styles
        tabBarIndicatorStyle: {
          alignSelf: "center",
          justifyContent: "center",
          width: wp(25),
          marginLeft: wp(4),
          backgroundColor: activeColors.primary,
        },
        headerIconsContainer: {
          gap: 12,
          marginRight: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        contentContainerStyle: {
          paddingTop: 20,
          gap: 14,
          paddingHorizontal: wp(4),
        },

        // notifications styles
        container: { flex: 1, paddingHorizontal: wp(4) },

        // profile styles
        headerLeftContainer: {
          gap: 5,
          flexDirection: "row",
          alignItems: "center",
        },
        profileDetails: {
          marginTop: hp(1),
          alignItems: "center",
          justifyContent: "center",
        },
        profileColumn: {
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
        },
        imgNameRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },

        statRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          marginVertical: 12,
        },

        bio: {
          marginTop: 10,
          fontSize: 14,
          color: activeColors.text,
        },

        tabContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabsContainer: {
          gap: 5,
          marginBottom: 10,
          flexDirection: "row",
          paddingHorizontal: wp(4),
          justifyContent: "space-between",
        },
        tabButton: {
          flex: 1,
          borderWidth: 1,
          borderRadius: 12,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          borderColor: activeColors.tabBarBorder,
        },
        activeTabButton: {
          backgroundColor: activeColors.commentBox,
        },
        tabText: {
          color: activeColors.mediumGrey,
        },
        activeTabText: {
          color: activeColors.text,
          fontWeight: appTheme.fonts.bold,
        },

        // user details screen styles
        startLoadingContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: activeColors.background,
        },
        followBtnContainer: {
          bottom: -12,
          borderRadius: 30,
          flexDirection: "row",
          alignSelf: "center",
          position: "absolute",
          alignItems: "center",
          paddingHorizontal: 5,
          justifyContent: "center",
          backgroundColor: activeColors.background,
        },
        followLabel: {
          fontSize: hp(1.2),
          fontWeight: "bold",
        },
      }),

    [theme]
  );
  return { styles, activeColors };
};
