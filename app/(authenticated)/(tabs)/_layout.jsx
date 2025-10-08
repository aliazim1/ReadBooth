import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

import AppIonicon from "../../../components/AppIonicon";
import AppText from "../../../components/AppText";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useTabsStyles } from "../../../styles/tabsStyles";

export default function TabLayout() {
  const { styles, activeColors } = useTabsStyles();
  const { badgeCount } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShadowVisible: false,
        tabBarStyle: styles.tabBarStyle,
        headerStyle: styles.headerStyle,
        tabBarBadgeStyle: styles.tabBarBadge,
        headerTintColor: activeColors.text,
        tabBarActiveTintColor: activeColors.text,
        tabBarInactiveTintColor: activeColors.mediumGrey,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "",
          headerLeft: () => (
            <AppText style={styles.homeHeaderTItle}>ReadBooth</AppText>
          ),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? activeColors.primary
                    : "transparent",
                },
              ]}
            >
              <Octicons
                name="home-fill"
                size={18}
                color={focused ? activeColors.text : activeColors.mediumGrey}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: "Book Shelf",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? activeColors.primary
                    : "transparent",
                },
              ]}
            >
              <MaterialIcons
                name="menu-book"
                size={20}
                color={focused ? activeColors.text : activeColors.mediumGrey}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          // tabBarBadgeStyle: styles.tabBarBadge,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? activeColors.primary
                    : "transparent",
                },
              ]}
            >
              <AppIonicon
                name={"notifications"}
                size={20}
                color={focused ? activeColors.text : activeColors.mediumGrey}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? activeColors.primary
                    : "transparent",
                },
              ]}
            >
              <AppIonicon
                name={"person"}
                size={20}
                color={focused ? activeColors.text : activeColors.mediumGrey}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

{
  /* <Tabs
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
    > */
}
