import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import AppText from "../../../components/AppText";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useTabsStyles } from "../../../styles/tabsStyles";

const TabLayout = () => {
  const { styles, activeColors } = useTabsStyles();
  const { badgeCount } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerStyle: styles.headerStyle,
        tabBarStyle: styles.tabBarStyles,
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
            <AppText style={styles.homeHeaderTitle}>ReadBooth</AppText>
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
          title: "Books",
          headerTitle: "",
          headerLeft: () => (
            <AppText style={styles.nbpHeaderTitle}>Book Shelf</AppText>
          ),
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
          headerTitle: "",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          // tabBarBadgeStyle: styles.tabBarBadge,
          headerLeft: () => (
            <AppText style={styles.nbpHeaderTitle}>Notifications</AppText>
          ),
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
};

export default TabLayout;
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
