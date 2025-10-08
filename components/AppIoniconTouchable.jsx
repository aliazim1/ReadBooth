import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

const AppIoniconTouchable = ({
  name = "chevron-back",
  size = 28,
  strokeWidth = 3,
  color,
  onPress,
  style,
}) => {
  const { activeColors } = useComponentsStyles();
  return (
    <Pressable onPress={onPress} style={style}>
      <Ionicons
        name={name}
        color={color || activeColors.text}
        size={size}
        strokeWidth={strokeWidth}
        style={{ alignSelf: "center" }}
      />
    </Pressable>
  );
};

export default memo(AppIoniconTouchable);
