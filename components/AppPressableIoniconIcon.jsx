import { Pressable, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { hp } from "../lib/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const AppPressableIoniconIcon = ({
  name,
  label,
  onPress,
  size = 19,
  width = 60,
  showLabel = true,
  color,
  style,
}) => {
  const { activeColors } = useComponentsStyles();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.footerBtnContainer, { width: width }, style]}
    >
      {name && (
        <Ionicons
          name={name}
          color={color || activeColors.iconsColor}
          size={size}
        />
      )}
      {showLabel && <AppText style={styles.footerLabel}>{label}</AppText>}
    </Pressable>
  );
};
const styles = StyleSheet.create({
  footerBtnContainer: {
    gap: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  footerLabel: {
    width: 35,
    fontSize: hp(1),
  },
});

export default AppPressableIoniconIcon;
