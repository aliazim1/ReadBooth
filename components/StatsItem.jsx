import { StyleSheet, View } from "react-native";

import { theme } from "../constants/theme";
import AppText from "./AppText";

const StatsItem = ({ title, value }) => {
  return (
    <View style={styles.column}>
      <AppText style={{ fontSize: 14, color: theme.colors.dark }}>
        {title}
      </AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: 90,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",

    // add the following styles if wanted to show the statsItems as box
    // backgroundColor: theme.colors.veryLightGrey,
    // borderRadius: 12,
  },
  value: {
    color: theme.colors.dark,
    fontWeight: theme.fonts.extraBold,
  },
  bio: {
    marginTop: 8,
    color: theme.colors.dark,
  },
});
export default StatsItem;
