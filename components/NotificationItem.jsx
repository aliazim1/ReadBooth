import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import { hp } from "../helpers/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import Avatar from "./Avatar";

const NotificationItem = ({
  item,
  router,
  onDeleteNotification = () => {},
}) => {
  const { styles, activeColors } = useComponentsStyles();
  const createdAt = moment(item?.created_at).fromNow();
  const handleNotificationTap = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetails", params: { postId, commentId } });
  };

  return (
    <TouchableOpacity
      onPress={handleNotificationTap}
      style={styles.notificationContaienr}
    >
      <View style={styles.row}>
        <Avatar size={hp(5)} uri={item?.sender?.image} />
        <View>
          <View style={styles.nameMsgContainer}>
            <Text style={styles.name}>{item?.sender?.name}</Text>
            <AppText style={styles.notificationMsg}>{item?.title}</AppText>
          </View>
          <AppText style={styles.notificationCreatedAt}>{createdAt}</AppText>
        </View>
      </View>
      <Pressable onPress={onDeleteNotification} style={styles.action}>
        <Ionicons
          name={"ellipsis-horizontal"}
          color={activeColors.iconsColor}
          size={hp(1.8)}
        />
      </Pressable>
    </TouchableOpacity>
  );
};

export default NotificationItem;
