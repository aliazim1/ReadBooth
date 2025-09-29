import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

// import AppIoniconTouchable from "../components/AppIoniconTouchable";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

const RootLayout = () => {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <MainLayout />
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="(authenticated)" />
      <Stack.Screen
        name="(modals)/postDetails"
        options={{
          headerTitle: "",
          presentation: "modal",
          headerShadowVisible: false,
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
