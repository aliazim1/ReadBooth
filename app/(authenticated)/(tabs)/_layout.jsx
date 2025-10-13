import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
        headerTintColor: activeColors.text,
        tabBarActiveTintColor: activeColors.text,
        tabBarInactiveTintColor: activeColors.mediumGrey,
        tabBarStyle: {
          backgroundColor: activeColors.background,
          height: 80,
          paddingTop: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        headerStyle: {
          backgroundColor: activeColors.background,
        },
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
            <Octicons
              name="home-fill"
              size={28}
              color={focused ? activeColors.text : activeColors.mediumGrey}
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
              size={28}
              color={focused ? activeColors.text : activeColors.mediumGrey}
            />
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
            <Ionicons
              name={"notifications"}
              size={28}
              color={focused ? activeColors.text : activeColors.mediumGrey}
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
            <Ionicons
              name={"person"}
              size={28}
              color={focused ? activeColors.text : activeColors.mediumGrey}
            />
          ),
        }}
      />
    </Tabs>
  );
}

{
  /* 
  // screenOptions={{
      //   tabBarShowLabel: false,
      //   headerShadowVisible: false,
      //   tabBarStyle: styles.tabBarStyle,
      //   headerStyle: styles.headerStyle,
      //   tabBarBadgeStyle: styles.tabBarBadge,
      //   headerTintColor: activeColors.text,
      //   tabBarActiveTintColor: activeColors.text,
      //   tabBarInactiveTintColor: activeColors.mediumGrey,
      // }}
  */
}
