import { Platform, Text } from "react-native";
import { theme } from "../constants/theme";

export default function CustomText({ children, style, ...rest }) {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          color: theme.colors.dark,
          fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
