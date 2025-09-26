import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";

const Loading = ({ size = "large", color = theme.colors.primary, style }) => {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
