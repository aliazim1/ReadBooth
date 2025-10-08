import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useComponentsStyles } from "../styles/componentsStyles";

export default function AppMaterialCommunityIcon({
  name,
  size = 24,
  color,
  style,
}) {
  const { activeColors } = useComponentsStyles();
  return (
    <MaterialCommunityIcons
      name={name}
      color={activeColors.iconsColor || color}
      size={size}
      style={{ alignSelf: "center", ...style }}
    />
  );
}
