import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

export default function SafeScreen({
  children,
  bg = theme.colors.white,
  style,
}) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[{ flex: 1, backgroundColor: bg }, style]}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
