import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useComponentsStyles } from "../styles/componentsStyles";

export default function SafeScreen({ children, style }) {
  const { activeColors } = useComponentsStyles();
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: activeColors.background }, style]}
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
