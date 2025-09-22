import { Stack } from "expo-router";

const AuthenticatedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(screens)" />
    </Stack>
  );
};
export default AuthenticatedLayout;
