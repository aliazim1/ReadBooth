import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SafeScreen({ children, bg }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
