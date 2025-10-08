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
        // comments styles
        container: {
          flex: 1,
          backgroundColor: activeColors.background,
        },
        notFound: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        inputContainer: {
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: wp(4),
          paddingVertical: hp(1),
        },
        input: {
          maxHeight: 5 * 20,
          lineHeight: 20,
          paddingVertical: 8,
          textAlignVertical: "top",
          width: "100%",
          borderWidth: 0,
          marginVertical: hp(2),
        },
        sendBtn: {
          padding: 6,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: appTheme.radius.xxl,
          backgroundColor: activeColors.mediumGrey,
        },
        commentCountContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
        beFirst: {
          fontSize: hp(1.4),
          paddingLeft: wp(4),
        },
        commentCount: {
          fontSize: hp(1.4),
          marginRight: 5,
          paddingLeft: wp(4),
          fontWeight: appTheme.fonts.bold,
        },

        // edit post styles
        header: {
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
        bodyContent: {
          height: hp(15),
          marginVertical: hp(2),
          textAlignVertical: "top",
        },

        // post details styles (mixed with above styles)
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
      }),
    [theme]
  );
  return { styles, activeColors };
};
