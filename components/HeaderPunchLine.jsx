import { StyleSheet, View } from "react-native";
import { appTheme } from "../config/theme";
import { hp } from "../lib/common";
import AppText from "./AppText";

const HeaderPunchLine = ({ title, punchLine }) => {
  return (
    <View style={styles.logoContainer}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.punchLine}>{punchLine}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: hp(3),
    fontWeight: appTheme.fonts.bold,
  },
  punchLine: {
    fontSize: hp(1.8),
    fontWeight: appTheme.fonts.medium,
    marginTop: hp(0.5),
    marginBottom: hp(2),
    textAlign: "center",
  },
});

export default HeaderPunchLine;
