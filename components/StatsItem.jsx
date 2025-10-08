import { View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const StatsItem = ({ title, value }) => {
  const styles = useComponentsStyles();
  return (
    <View style={styles.column}>
      <AppText style={styles.statLabel}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
};

export default StatsItem;
