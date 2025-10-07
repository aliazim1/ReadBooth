import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { theme } from "../constants/theme";

export default function AppMaterialCommunityIcon({
  name,
  size = 24,
  color = theme.colors.text,
  style,
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      color={color}
      size={size}
      style={{ alignSelf: "center", ...style }}
    />
  );
}
