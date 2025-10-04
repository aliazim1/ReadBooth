import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";

import AppIonicon from "../../../components/AppIonicon";
import AppText from "../../../components/AppText";
import { theme } from "../../../constants/theme";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { hp } from "../../../helpers/common";

export default function TabLayout() {
  const { badgeCount } = useNotifications();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.bottomTabIcon,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "",
          headerLeft: () => (
            <AppText
              style={{
                fontSize: hp(2),
                marginLeft: 12,
                fontWeight: theme.fonts.extraBold,
              }}
            >
              ReadBooth
            </AppText>
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
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.danger,
            color: "white",
          },
          tabBarIcon: ({ focused }) => (
            <AppIonicon
              name={"notifications"}
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
  );
}
