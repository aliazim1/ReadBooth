import { Text, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

const StatsItem = ({ title, value }) => {
  const { styles } = useComponentsStyles();
  return (
    <View style={styles.column}>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default StatsItem;
