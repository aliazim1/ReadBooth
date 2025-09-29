import { ActivityIndicator, View } from "react-native";
import { theme } from "../constants/theme";

const Loading = ({ size = "small", color = theme.colors.dark, style }) => {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
