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

        // THIS IS FOR FLOATING TAB BAR...
        // tabBarStyle: {
        //   bottom: 20,
        //   height: 63,
        //   paddingTop: 10,
        //   borderWidth: 1,
        //   borderRadius: 50,
        //   borderTopWidth: 1,
        //   position: "absolute",
        //   alignItems: "center",
        //   borderColor: activeColors.tabBarBorder,
        //   borderTopColor: activeColors.tabBarBorder,
        //   justifyContent: "center",
        //   marginHorizontal: wp(14),
        //   backgroundColor: activeColors.background,
        //   elevation: 5,
        //   shadowRadius: 3,
        //   shadowOpacity: 0.7,
        //   shadowOffset: { width: 0, height: 1 },
        //   shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
        // },
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
          paddingTop: 20,
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

        // notifications styles
        container: { flex: 1, paddingHorizontal: wp(4) },

        // profile styles
        headerLeftContainer: {
          gap: 5,
          flexDirection: "row",
          alignItems: "center",
        },
        profileDetails: {
          marginTop: hp(2),
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
        followBtnContainer: {
          bottom: -10,
          borderRadius: 30,
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
        statRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          width: "100%",
          alignItems: "center",
          marginVertical: hp(1.5),
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
          borderBottomWidth: 3,
          borderColor: activeColors.text,
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
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: activeColors.background,
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
