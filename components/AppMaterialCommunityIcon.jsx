import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { theme } from "../constants/theme";

export default function AppMaterialIcon({
  name,
  size = 24,
  color = theme.colors.dark,
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
