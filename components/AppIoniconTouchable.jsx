import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable } from "react-native";
import { theme } from "../constants/theme";

const AppIoniconTouchable = ({
  name = "chevron-back",
  size = 28,
  strokeWidth = 3,
  color = theme.colors.dark,
  onPress,
  style,
}) => {
  return (
    <Pressable onPress={onPress} style={style}>
      <Ionicons
        name={name}
        color={color}
        size={size}
        strokeWidth={strokeWidth}
        style={{ alignSelf: "center" }}
      />
    </Pressable>
  );
};

export default memo(AppIoniconTouchable);
