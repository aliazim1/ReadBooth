import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../../components/CustomAlert";
import NotificationItem from "../../../components/NotificationItem";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { wp } from "../../../helpers/common";

const Notifications = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  // const [notifications, setNotifications] = useState([]);
  const { notifications, clearBadge, loadNotifications } = useNotifications();

  // useEffect(() => {
  //   getNotifications();
  // }, []);

  useEffect(() => {
    if (user?.id) loadNotifications(user.id);
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      clearBadge();
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() =>
            CustomAlert({
              title: "Clear all",
              message: "Are you sure you want to clear all notifications?",
              onConfirm: () => {},
            })
          }
        >
          <MaterialIcons name="clear-all" size={24} color={theme.colors.dark} />
        </Pressable>
      ),
    });
  }, [notifications, navigation, router]);

  // const getNotifications = async () => {
  //   let res = await fetchNotifications(user.id);
  //   if (res.success) setNotifications(res.data);
  // };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((item) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
        </ScrollView>
        {/* display a message if No-Notificaitons */}
        {notifications.length == 0 && (
          <View style={styles.noNofiticationsContainer}>
            <Ionicons
              size={24}
              color={theme.colors.dark}
              name="notifications-outline"
            />
            <Text style={styles.noNofitications}>No notifications yet.</Text>
          </View>
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },

  noNofiticationsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 10,
  },
  noNofitications: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
  },
});
export default Notifications;
