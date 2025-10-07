import { Stack, useRouter } from "expo-router";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import { theme } from "../../../constants/theme";

const ScreensLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerLeft: () => (
          <AppIoniconTouchable
            name="chevron-back"
            onPress={() => router.back()}
          />
        ),
      }}
    >
      <Stack.Screen
        name="createPost"
        options={{
          headerTitle: "Create Post",
        }}
      />
      <Stack.Screen
        name="addBook"
        options={{
          headerTitle: "Add a New Book to Shelf",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings and Privacy",
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          headerTitle: "Change Password",
        }}
      />
      <Stack.Screen
        name="edit-profile-details"
        options={{
          headerTitle: "Account Info",
        }}
      />
    </Stack>
  );
};

export default ScreensLayout;
