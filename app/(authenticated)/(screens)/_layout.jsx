import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

const ScreensLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color={"black"} />
          </Pressable>
        ),
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
