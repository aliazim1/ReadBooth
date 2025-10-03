import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomAlert from "../../../components/CustomAlert";
import NotificationItem from "../../../components/NotificationItem";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { wp } from "../../../helpers/common";
import { fetchNotifications } from "../../../services/notificationService";

const Notifications = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

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

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    if (res.success) setNotifications(res.data);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
        </ScrollView>
        {/* display a message if no notificaitons to display */}
        {notifications.length == 0 && (
          <Text style={styles.noNofitications}>No notifications yet.</Text>
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
  listStyle: {
    // flex: 1,
  },
  noNofitications: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
  },
});
export default Notifications;
