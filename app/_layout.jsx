import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session user: ", session?.user);

      if (session) {
        setAuth(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

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
