import { MaterialIcons, Octicons } from "@expo/vector-icons";
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
        headerTintColor: theme.colors.text,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.mediumGrey,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
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
                color: theme.colors.text,
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
              color={focused ? theme.colors.text : theme.colors.mediumGrey}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: "Book Shelf",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="menu-book"
              size={24}
              color={focused ? theme.colors.text : theme.colors.mediumGrey}
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
              color={focused ? theme.colors.text : theme.colors.mediumGrey}
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
              color={focused ? theme.colors.text : theme.colors.mediumGrey}
            />
          ),
        }}
      />
    </Tabs>
  );
}
