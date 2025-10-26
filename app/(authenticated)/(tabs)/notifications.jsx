import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabBadge } from "../../../contexts/BadgeContext";
import { supabase } from "../../../lib/supabase";
import { useTabsStyles } from "../../../styles/tabsStyles";

const Notifications = () => {
  const { styles } = useTabsStyles();
  const { user } = useAuth();
  const { setBadgeCount } = useTabBadge();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBadgeCount(0);
    }, [])
  );

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiverId", user.id)
      .order("created_at", { ascending: false });

    if (!error) setNotifications(data);
    else console.log("fetchNotifications error:", error);
  };

  const handleNotificationPress = async (id) => {
    await supabase.from("notifications").update({ isRead: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item.id)}
      style={{
        backgroundColor: item.isRead ? "#fff" : "#e6f0ff", // different color for new notifications
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <Text style={styles.text}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>
    </SafeScreen>
  );
};

export default Notifications;
