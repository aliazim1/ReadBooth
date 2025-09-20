import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { TouchableOpacity } from "react-native";

import { theme } from "../constants/theme";

const AppIoniconTouchable = ({
  name = "chevron-back",
  size = 28,
  color = theme.colors.dark,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[{ marginLeft: -12 }, style]}>
      <Ionicons
        name={name}
        color={color}
        size={size}
        style={{ alignSelf: "center" }}
      />
    </TouchableOpacity>
  );
};

export default memo(AppIoniconTouchable);
