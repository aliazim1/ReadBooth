import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { theme } from "../constants/theme";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

const RootLayout = () => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <StatusBar style="light" />
        <MainLayout />
      </NotificationsProvider>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const { setAuth, setUserData } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(authenticated)" />
      <Stack.Screen
        name="(modals)/postDetails"
        options={{
          headerTitle: "",
          presentation: "modal",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(modals)/comments"
        options={{
          headerTitle: "Comments",
          presentation: "modal",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(modals)/editPost"
        options={{
          headerTitle: "Edit Post",
          presentation: "modal",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
