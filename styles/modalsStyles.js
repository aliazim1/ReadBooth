import { useContext, useMemo } from "react";
import { StyleSheet } from "react-native";

import { appTheme, colors } from "../constants/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../helpers/common";

export const modalsStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        //
        // comments styles for both comments & postDetails
        container: {
          flex: 1,
          backgroundColor: activeColors.background,
        },
        notFound: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        startLoadingContainer: {
          alignItems: "center",
          justifyContent: "center",
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
        beFirst: {
          fontSize: hp(1.4),
          paddingLeft: wp(4),
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

        //
        // edit post styles
        header: {
          gap: 12,
          paddingTop: hp(1.5),
          flexDirection: "row",
          alignItems: "center",
        },
        title: {
          fontSize: hp(2.2),
          color: activeColors.text,
          fontWeight: appTheme.fonts.semibold,
        },
        subTitle: {
          fontSize: hp(1.5),
          color: activeColors.mediumGrey,
          fontWeight: appTheme.fonts.medium,
        },
        bodyContent: {
          height: hp(15),
          marginVertical: hp(2),
          textAlignVertical: "top",
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
