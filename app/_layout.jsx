import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    <AuthProvider>
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
        router.replace("(authenticated)/(tabs)/home");
      } else {
        setAuth(null);
        router.replace("(auth)/welcome");
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
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(authenticated)" />
    </Stack>
  );
};

export default _layout;
