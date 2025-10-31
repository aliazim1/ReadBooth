import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { getData, storeData } from "../config/asyncstorage";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { BadgeProvider } from "../contexts/BadgeContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { useComponentsStyles } from "../styles/componentsStyles";

// keep the splashScreen visible while fetching the resources
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [theme, setTheme] = useState({ mode: "dark" });

  useEffect(() => {
    fetchStoredTheme();
  }, []);

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
    storeData("ReadBoothTheme", newTheme);
  };

  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("ReadBoothTheme");
      if (themeData) {
        updateTheme(themeData);
      }
    } catch (error) {
      alert(error);
    } finally {
      setTimeout(() => SplashScreen.hideAsync(), 1000);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <AuthProvider>
        <BadgeProvider>
          <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
          <MainLayout />
        </BadgeProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
};

const MainLayout = () => {
  const { activeColors } = useComponentsStyles();
  const router = useRouter();
  const { setAuth, setUserData } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return; // ensures layout is ready before navigating

        if (session) {
          setAuth(session.user);
          updateUserData(session.user, session.user.email);
          router.replace("/home");
        } else {
          setAuth(null);
          router.replace("/welcome");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [isMounted]);

  const updateUserData = async (user, email) => {
    const res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: activeColors.text,
        headerStyle: { backgroundColor: activeColors.background },
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
      <Stack.Screen
        name="(modals)/editBook"
        options={{
          headerTitle: "Edit Book",
          presentation: "modal",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(modals)/searchScreen"
        options={{
          headerTitle: "",
          presentation: "modal",
          animation: "fade",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
