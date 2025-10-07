import { Platform, Text } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

export default function AppText({ children, style, ...rest }) {
  return (
    <Text
      style={[
        {
          fontSize: hp(1.6),
          color: theme.colors.text,
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
