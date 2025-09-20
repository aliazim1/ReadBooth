import { Stack, useRouter } from "expo-router";

const AuthenticatedLayout = () => {
  const router = useRouter();

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthenticatedLayout;
