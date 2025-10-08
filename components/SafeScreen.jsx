import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { authStyles } from "../styles/authStyles";

export default function SafeScreen({ children, style }) {
  const { activeColors } = authStyles();
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
