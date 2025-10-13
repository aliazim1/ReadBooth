import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

const HeaderRight = ({
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
            name={icon1}
            color={activeColors.iconsColor}
            size={size}
            style={{ alignSelf: "center" }}
          />
        </Pressable>
      )}
      {icon2 && (
        <Pressable onPress={onPress2}>
          <Ionicons
            name={icon2}
            color={activeColors.iconsColor}
            size={size}
            style={{ alignSelf: "center" }}
          />
        </Pressable>
      )}
    </View>
  );
};

export default memo(HeaderRight);
