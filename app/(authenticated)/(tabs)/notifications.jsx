import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, View } from "react-native";

import HeaderIcons from "../../../components/HeaderIcons";
import NotificationItem from "../../../components/NotificationItem";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabBadge } from "../../../contexts/BadgeContext";
import { supabase } from "../../../lib/supabase";
import { useTabsStyles } from "../../../styles/tabsStyles";

const Notifications = () => {
  const { styles } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { setBadgeCount } = useTabBadge();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
         id,
          created_at,
          message,
          type,
          isRead,
          type,
          message,
          postId,
          commentId,
          sender:senderId ( id, name, username, image )
        `
        )
        .eq("receiverId", user.id)
        .order("created_at", { ascending: false });

      if (!error) setNotifications(data);
      else console.log("fetchNotifications error:", error);
    };

    fetchNotifications();
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      setBadgeCount(0);
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <HeaderIcons size={24} icon2="filter" />
        </View>
      ),
    });
  }, [navigation, router]);

  const handleNotificationPress = async (id) => {
    await supabase.from("notifications").update({ isRead: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // if user is null (logged out), don’t render anything
  if (!user) return null;

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => handleNotificationPress(item.id)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>
    </SafeScreen>
  );
};

export default Notifications;
