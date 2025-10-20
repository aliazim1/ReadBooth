import { Pressable, Text } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

const StatsItem = ({ title, value, onPress }) => {
  const { styles } = useComponentsStyles();
  return (
    <Pressable onPress={onPress} style={styles.column}>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
};

export default StatsItem;
