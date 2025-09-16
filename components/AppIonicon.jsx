import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../constants/theme";

export default function AppIonicon({
  name,
  size = 24,
  color = theme.colors.darkLight,
  style,
}) {
  return (
    <Ionicons
      name={name}
      color={color}
      size={size}
      style={[{ alignSelf: "center" }, style]}
    />
  );
}
