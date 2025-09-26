import { Stack, useRouter } from "expo-router";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";

const ScreensLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
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
        name="postDetails"
        options={{
          headerTitle: "Post Details",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="comments"
        options={{
          headerTitle: "Comments",
          presentation: "modal",
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
          headerTitle: "Account",
        }}
      />
    </Stack>
  );
};

export default ScreensLayout;
