import { StyleSheet, View } from "react-native";

import { theme } from "../constants/theme";
import AppText from "./AppText";

const StatsItem = ({ title, value }) => {
  return (
    <View style={styles.column}>
      <AppText style={{ fontSize: 14, color: theme.colors.text }}>
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
  },
  value: {
    color: theme.colors.text,
    fontWeight: theme.fonts.extraBold,
  },
});
export default StatsItem;
