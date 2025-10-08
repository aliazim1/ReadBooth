import Ionicons from "@expo/vector-icons/Ionicons";

import { useComponentsStyles } from "../styles/componentsStyles";

export default function AppIonicon({ name, size = 24, color, style }) {
  const { activeColors } = useComponentsStyles();
  return (
    <Ionicons
      name={name}
      color={activeColors.mediumGrey || color}
      size={size}
      style={[{ alignSelf: "center" }, style]}
    />
  );
}
