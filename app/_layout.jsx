import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const _layout = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

const RootLayout = () => {
  const router = useRouter();
  const { setAuth } = useAuth();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session user: ", session?.user?.id);

      if (session) {
        setAuth(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  // const [loaded] = useFonts({
  //   "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

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
