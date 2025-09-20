import { Stack, useRouter } from "expo-router";
import { theme } from "../../../constants/theme";

const ScreensLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.dark,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings and Privacy",
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          presentation: "modal",
          headerTitle: "Change password",
        }}
      />
      <Stack.Screen
        name="edit-profile-details"
        options={{
          presentation: "modal",
          headerTitle: "Account",
        }}
      />
    </Stack>
  );
};

export default ScreensLayout;
