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
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    console.log("User data: ", res.data);
    // if (res.success) setUserData(res.data);
  };

  return (
    <Stack screenOptions={{ headerShown: false }} />
    //    <Stack.Screen name="index" />
    //   <Stack.Screen name="welcome" />
    //   <Stack.Screen name="login" />
    //   <Stack.Screen name="signup" />
    //   <Stack.Screen name="+not-found" />
    // </Stack>
  );
};

export default _layout;
