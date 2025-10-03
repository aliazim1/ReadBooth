import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import AppText from "./AppText";
import Avatar from "./Avatar";

const NotificationItem = ({ item, router }) => {
  const createdAt = moment(item?.created_at).fromNow();

  const handleNotificationTap = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  };

  return (
    <TouchableOpacity onPress={handleNotificationTap} style={styles.contaienr}>
      <View style={styles.row}>
        <Avatar size={hp(5)} uri={item?.sender?.image} />
        <View>
          <View style={styles.nameMsgContainer}>
            <Text style={styles.name}>{item?.sender?.name}</Text>
            <AppText style={styles.notificationMsg}>{item?.title}</AppText>
          </View>
          <AppText style={styles.createdAt}>{createdAt}</AppText>
        </View>
      </View>
      <Pressable
        onPress={() => Alert.alert("Tapped", "You tapped the three dots")}
        style={styles.action}
      >
        <Ionicons
          name={"ellipsis-horizontal"}
          color={theme.colors.dark}
          size={hp(1.8)}
        />
      </Pressable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contaienr: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  row: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameMsgContainer: {
    gap: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  name: {
    fontSize: hp(1.8),
    color: theme.colors.dark,
    fontWeight: theme.fonts.semibold,
  },
  notificationMsg: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  createdAt: {
    fontSize: hp(1.2),
  },
  action: {
    flexDirection: "row",
    width: 20,
    justifyContent: "flex-end",
  },
});

export default NotificationItem;
