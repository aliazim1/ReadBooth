import { Stack, useRouter } from "expo-router";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import { useScreensStyles } from ".././../../styles/screensStyles";

const ScreensLayout = () => {
  const router = useRouter();
  const { activeColors } = useScreensStyles();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: activeColors.text,
        headerStyle: {
          backgroundColor: activeColors.background,
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
          headerTitle: "Add New Book",
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
