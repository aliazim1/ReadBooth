import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, View } from "react-native";

import CustomAlert from "../../../components/CustomAlert";
import HeaderIcons from "../../../components/HeaderIcons";
import NotExist from "../../../components/NotExist";
import NotificationItem from "../../../components/NotificationItem";
import NotificationOptionsModal from "../../../components/NotificationModal";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabBadge } from "../../../contexts/BadgeContext";
import { supabase } from "../../../lib/supabase";
import {
  clearAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
} from "../../../services/notificationService";
import { useTabsStyles } from "../../../styles/tabsStyles";

const Notifications = () => {
  const { styles } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { setBadgeCount } = useTabBadge();
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    // call the function to fetch all the notifications
    fetchNotifications(user.id, setNotifications);
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
          <HeaderIcons
            size={24}
            icon2="filter"
            onPress2={() => setModalVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation, router]);

  // function to set the isRead to true & navigate to postDetails for (like & comment),
  // if type is comment, it highlights that specific comment
  const handleNotificationPress = async (item) => {
    await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", item?.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (item?.type != "follow") {
      router.push({
        pathname: "postDetails",
        params: { postId: item?.postId, commentId: item?.commentId },
      });
    }
  };

  // function to remove a notification & filter out the deleted notification
  const handleDeleteNotification = async (item) => {
    const { success } = await deleteNotification({
      notificationId: item.id,
      senderId: item.senderId,
      receiverId: item.receiverId,
      postId: item.postId,
      type: item.type,
    });

    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    }
  };

  const handleClearAllNotifications = async () => {
    const { success } = await clearAllNotifications(user.id);
    if (success) setNotifications([]);
    setModalVisible(false);
  };

  // if user is null (logged out), don’t render anything
  if (!user) return null;

  return (
    <SafeScreen>
      <View style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() => handleNotificationPress(item)}
              onDeleteNotification={() => handleDeleteNotification(item)}
            />
          )}
          ListEmptyComponent={
            <NotExist iconName={"bell"} message="No notifications yet" />
          }
        />
      </View>

      <NotificationOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRead={async () => {
          if (!notifications.length > 0) {
            setModalVisible(false);
            return null;
          }

          const { success } = await markAllNotificationsRead(user.id);
          if (success) {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, isRead: true }))
            );
          }
          setModalVisible(false);
        }}
        onDelete={async () => {
          if (!notifications.length > 0) {
            setModalVisible(false);
            return null;
          }
          CustomAlert({
            title: "Clear Notifications",
            message: "Are you sure you want to clear all notifications?",
            onConfirm: handleClearAllNotifications,
          });
        }}
      />
    </SafeScreen>
  );
};

export default Notifications;
