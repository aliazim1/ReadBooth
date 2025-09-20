import Octicons from "@expo/vector-icons/Octicons";
import { Tabs, useRouter } from "expo-router";
import { Image } from "react-native";

import AppIonicon from "../../../components/AppIonicon";
import { theme } from "../../../constants/theme";

export default function TabLayout() {
  const router = useRouter();

  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShadowVisible: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.bottomTabIcon,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerTitle: "",
            headerLeft: () => (
              <Image
                tintColor={"#C65D3B"}
                source={require("../../../assets/images/logo2.png")}
                style={{ width: 60, height: 60 }}
              />
            ),
            tabBarIcon: ({ focused }) => (
              <Octicons
                name="home-fill"
                size={22}
                color={
                  focused ? theme.colors.primary : theme.colors.bottomTabIcon
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ focused }) => (
              <AppIonicon
                name={"people"}
                size={25}
                color={
                  focused ? theme.colors.primary : theme.colors.bottomTabIcon
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="books"
          options={{
            title: "Books",
            tabBarIcon: ({ focused }) => (
              <AppIonicon
                name={"book"}
                size={25}
                color={
                  focused ? theme.colors.primary : theme.colors.bottomTabIcon
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: "Inbox",
            tabBarIcon: ({ focused }) => (
              <AppIonicon
                name={"chatbubbles"}
                size={25}
                color={
                  focused ? theme.colors.primary : theme.colors.bottomTabIcon
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerTitle: "",
            tabBarIcon: ({ focused }) => (
              <AppIonicon
                name={"person"}
                size={25}
                color={
                  focused ? theme.colors.primary : theme.colors.bottomTabIcon
                }
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
