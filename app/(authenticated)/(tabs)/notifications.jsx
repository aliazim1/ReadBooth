import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

import AppText from "../../../components/AppText";
import CustomAlert from "../../../components/CustomAlert";
import NotificationItem from "../../../components/NotificationItem";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { removeNotification } from "../../../services/notificationService";
import { useTabsStyles } from "../../../styles/tabsStyles";

const Notifications = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { notifications, setNotifications, clearBadge, loadNotifications } =
    useNotifications();

  useEffect(() => {
    if (user?.id) loadNotifications(user.id);
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      clearBadge();
    });
    return unsubscribe;
  }, [navigation]);

  const deleteNotification = async (id) => {
    let res = await removeNotification(id);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      Alert.alert("Notificaiton", res.msg || "Failed to delete notification");
    }
  };

  const onDeleteNotification = ({ id }) => {
    CustomAlert({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      onConfirm: () => deleteNotification(id),
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() =>
            notifications.length === 0
              ? null
              : CustomAlert({
                  title: "Clear All Notifications",
                  message: "Are you sure you want to delete all notifications?",
                  onConfirm: async () => {
                    try {
                      await Promise.all(
                        notifications.map((n) => removeNotification(n.id))
                      );
                      setNotifications([]);
                    } catch (error) {
                      Alert.alert("Error", "Failed to clear notifications.");
                    }
                  },
                })
          }
        >
          <MaterialIcons name="clear-all" size={24} color={activeColors.text} />
        </Pressable>
      ),
    });
  }, [notifications, navigation, router]);

  return (
    <SafeScreen>
      {notifications.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {notifications.map((item) => (
            <NotificationItem
              item={item}
              key={item?.id}
              router={router}
              onDeleteNotification={() => onDeleteNotification({ id: item.id })}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noNofiticationsContainer}>
          <Ionicons
            size={30}
            color={activeColors.text}
            name="notifications-outline"
          />
          <AppText>No notifications yet</AppText>
        </View>
      )}
    </SafeScreen>
  );
};

export default Notifications;
