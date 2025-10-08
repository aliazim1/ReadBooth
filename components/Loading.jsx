import { ActivityIndicator, View } from "react-native";
import { useComponentsStyles } from "../styles/componentsStyles";

const Loading = ({ size = "small", color, style }) => {
  const { activeColors } = useComponentsStyles();

  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={color || activeColors.iconsColor} />
    </View>
  );
};

export default Loading;
