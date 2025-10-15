import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

const HeaderIcons = ({
  icon1 = "",
  icon2 = "chevron-down",
  size = 28,
  onPress1 = () => {},
  onPress2 = () => {},
  style,
}) => {
  const { activeColors } = useComponentsStyles();

  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center", gap: 10 }, style]}
    >
      {icon1 && (
        <Pressable onPress={onPress1}>
          <Ionicons
            size={size}
            name={icon1}
            strokeWidth={3}
            style={{ alignSelf: "center" }}
            color={activeColors.text}
          />
        </Pressable>
      )}
      {icon2 && (
        <Pressable onPress={onPress2}>
          <Ionicons
            size={size}
            name={icon2}
            strokeWidth={3}
            style={{ alignSelf: "center" }}
            color={activeColors.text}
          />
        </Pressable>
      )}
    </View>
  );
};

export default memo(HeaderIcons);
