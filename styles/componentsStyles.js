import { useContext, useMemo } from "react";
import { Platform, StyleSheet } from "react-native";

import { appTheme, colors } from "../config/theme";
import { ThemeContext } from "../contexts/ThemeContext";
import { hp, wp } from "../lib/common";

export const useComponentsStyles = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        //
        // create post & edit post
        deleteIcon: {
          padding: 4,
          borderRadius: 20,
          alignItems: "center",
          backgroundColor: activeColors.danger,
        },

        //
        //  AppButton styles
        button: {
          height: hp(5.5),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderCurve: "continuous",
          borderRadius: appTheme.radius.xl * 20,
          backgroundColor: activeColors.primary,
        },

        shadowBtn: {
          elevation: 5,
          shadowRadius: 3,
          shadowOpacity: 0.7,
          shadowOffset: { width: 0, height: 1 },
          shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
        },

        text: {
          fontSize: hp(2),
          color: activeColors.white,
          fontWeight: appTheme.fonts.bold,
        },
        image: {
          height: 25,
          width: 25,
          marginRight: 10,
          alignSelf: "center",
        },
        followButton: {
          marginTop: 10,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: appTheme.radius.xxl,
        },
        //
        // AppText styles
        appText: {
          fontSize: hp(1.6),
          color: activeColors.text,
          fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
        },

        //
        // avatar styles
        avatarContainer: {
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: activeColors.gray,
        },

        //
        // book item styles
        bookContainer: {
          gap: 10,
          width: "100%",
          borderWidth: 0.5,
          borderRadius: 12,
          paddingVertical: 12,
          borderColor: activeColors.mediumGrey,
          flexDirection: "row",
          paddingHorizontal: 10,
          alignItems: "flex-start",
        },
        image: {
          width: wp(20),
          aspectRatio: 1,
          borderRadius: 8,
        },
        bookNameContainer: {
          gap: 5,
          width: wp(64),
        },
        bookName: {
          fontWeight: appTheme.fonts.bold,
        },
        bottomRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        linkContainer: {
          gap: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        linkText: {
          fontWeight: appTheme.fonts.semibold,
        },
        bookDeleteIcon: {
          right: 10,
          bottom: 12,
          borderRadius: 20,
          alignItems: "center",
          position: "absolute",
        },

        //
        // add comment component styles
        inputContainer: {
          gap: 5,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: wp(4),
          paddingVertical: hp(1),
        },
        sendBtn: {
          backgroundColor: activeColors.primary,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 12,
        },
        sendbtnText: {
          fontWeight: "600",
          color: activeColors.white,
        },

        //
        // comment item styles
        commentHeader: {
          flex: 1,
          paddingHorizontal: wp(4),
          paddingTop: 5,
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        imgNameTime: {
          flexDirection: "row",
          gap: 7,
        },
        nameAndTimeContainer: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },
        name: {
          fontSize: hp(1.5),
          color: activeColors.text,
          fontWeight: appTheme.fonts.semibold,
        },
        lightText: {
          fontSize: hp(1.2),
          color: activeColors.textLight,
          fontWeight: appTheme.fonts.medium,
        },
        body: {
          marginLeft: wp(14),
          marginRight: wp(3),
          fontSize: hp(1.5),
          color: activeColors.text,
          backgroundColor: activeColors.commentBox,
          padding: 8,
          borderRadius: 10,
        },

        highlight: {
          backgroundColor: activeColors.primary,
        },

        //
        //  custom input styles
        inputLabel: {
          marginTop: 20,
          fontWeight: appTheme.fonts.bold,
        },
        textInput: {
          padding: hp(1.3),
          borderWidth: 0.7,
          borderRadius: appTheme.radius.md,
        },

        //
        // notification item styles
        notificationContaienr: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        },
        row: {
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        nameMsgContainer: {
          gap: 5,
          flexDirection: "row",
          alignItems: "flex-end",
        },
        notificationMsg: {
          fontSize: hp(1.5),
          color: activeColors.textLight,
          fontWeight: appTheme.fonts.medium,
        },
        notificationCreatedAt: {
          fontSize: hp(1.2),
        },
        action: {
          flexDirection: "row",
          width: 20,
          justifyContent: "flex-end",
        },

        //
        // post card styles
        container: {
          marginVertical: hp(1.2),
        },
        postHeader: {
          flexDirection: "row",
          alignItems: "flex-start",
          paddingHorizontal: wp(4),
          justifyContent: "space-between",
        },

        headerFirstRow: {
          gap: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        username: {
          fontSize: hp(1.5),
          color: activeColors.mediumGrey,
          fontWeight: appTheme.fonts.medium,
        },
        postHeaderRightIcons: {
          flex: 1,
          marginTop: -12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        createdAt: {
          marginBottom: 2,
          fontSize: hp(1.2),
          color: activeColors.mediumGrey,
        },
        captionContainer: {
          marginTop: hp(1),
          paddingHorizontal: wp(4),
        },

        postCardText: {
          fontSize: 16,
          color: activeColors.text,
        },
        link: {
          color: "blue",
          textDecorationLine: "underline",
        },
        postMedia: {
          width: "100%",
          aspectRatio: 1,
          marginTop: hp(1),
          borderCurve: "continuous",
        },
        postFooterContainer: {
          marginTop: hp(1),
          paddingLeft: wp(4),
          paddingRight: wp(1),
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        },

        //
        // postGridItem styles
        postContainer: {
          flex: 1 / 3,
          aspectRatio: 1,
          margin: 1,
          backgroundColor: activeColors.veryLightGrey,
        },
        media: {
          width: "100%",
          height: "100%",
        },
        textOnly: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          backgroundColor: activeColors.mediumGrey,
        },
        textOnlyContent: {
          textAlign: "center",
          color: activeColors.text,
          fontSize: 12,
        },

        //
        // post options modal styles
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "flex-end",
        },
        popup: {
          paddingTop: hp(2.2),
          paddingBottom: hp(5),
          gap: 24,
          backgroundColor: activeColors.background,
          borderTopLeftRadius: appTheme.radius.xxl,
          borderTopRightRadius: appTheme.radius.xxl,
        },

        //
        // setting list item styles
        settingItemContainer: {
          backgroundColor: activeColors.background,
          paddingHorizontal: wp(4.5),
        },
        rowContainer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        leftSide: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        notificationIcon: {
          padding: 12,
          borderRadius: 50,
          backgroundColor: activeColors.background,
        },
        chevronContainer: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: activeColors.background,
          paddingHorizontal: wp(4),
          justifyContent: "space-between",
        },
        descriptionText: {
          color: activeColors.gray,
          marginTop: 8,
          fontSize: 12,
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },

        //
        // stats item styles
        column: {
          width: 90,
          gap: 5,
          paddingVertical: 7,
          alignItems: "center",
          justifyContent: "center",
        },
        statLabel: {
          fontSize: 14,
          color: activeColors.text,
        },
        value: {
          color: activeColors.text,
          fontWeight: appTheme.fonts.extraBold,
        },
      }),
    [theme]
  );
  return { styles, activeColors };
};
