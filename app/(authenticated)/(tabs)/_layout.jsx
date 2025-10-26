import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

import AppText from "../../../components/AppText";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabBadge } from "../../../contexts/BadgeContext";
import { supabase } from "../../../lib/supabase";
import { useTabsStyles } from "../../../styles/tabsStyles";

const TabLayout = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const { badgeCount, setBadgeCount } = useTabBadge();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // fetch initial unread count
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("receiverId", user.id)
        .eq("isRead", false);
      if (error) console.error("fetchUnreadCount error:", error);
      else setBadgeCount(count ?? 0);
    };

    fetchUnreadCount();
    // subscribe to new notification inserts
    const channel = supabase
      .channel("notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setBadgeCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <Tabs
      screenOptions={{
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
          headerLeft: () => (
            <AppText style={styles.nbpHeaderTitle}>Notifications</AppText>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="notifications"
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
              name="person"
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
