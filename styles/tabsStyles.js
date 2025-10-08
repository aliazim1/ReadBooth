import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { appTheme, colors } from "../constants/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../helpers/common";

export const useTabsStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // tabs _layout styles
        tabBarStyle: {
          bottom: 20,
          height: 63,
          paddingTop: 10,
          borderWidth: 1,
          borderRadius: 50,
          borderTopWidth: 1,
          position: "absolute",
          alignItems: "center",
          borderColor: "#333",
          borderTopColor: "#333",
          justifyContent: "center",
          marginHorizontal: wp(14),
          backgroundColor: activeColors.background,
        },
        headerStyle: {
          backgroundColor: activeColors.background,
        },
        tabBarBadge: {
          backgroundColor: activeColors.danger,
          color: "white",
        },
        homeHeaderTItle: {
          fontSize: hp(2),
          marginLeft: 12,
          color: activeColors.text,
          fontWeight: appTheme.fonts.extraBold,
        },
        tabBarIcons: {
          width: 40,
          height: 40,
          padding: 5,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        },

        // books styles
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

        // home styles
        outerContainer: {
          flex: 1,
          backgroundColor: activeColors.background,
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

        // notifications styles
        container: {
          flex: 1,
          paddingHorizontal: wp(4),
        },

        // profile styles
        profileDetails: {
          marginTop: hp(2),
          alignItems: "center",
          justifyContent: "center",
        },
        profileColumn: {
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        },
        statRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "center",
          marginVertical: hp(1.5),
        },

        bio: {
          marginTop: 8,
          color: activeColors.text,
        },

        tabContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        tabsContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        },
        tabButton: {
          paddingVertical: 10,
          flex: 1,
          alignItems: "center",
        },
        activeTabButton: {
          borderBottomWidth: 4,
          borderColor: activeColors.primary,
        },
        tabText: {
          color: activeColors.gray,
          fontWeight: "500",
        },
        activeTabText: {
          color: activeColors.primary,
          fontWeight: "bold",
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
