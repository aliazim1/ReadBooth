import { Text } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";

export default function AppText({ children, style, ...rest }) {
  const { styles, activeColors } = useComponentsStyles();
  return (
    <Text style={[styles.appText, style]} {...rest}>
      {children}
    </Text>
  );
}
