import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

import { hp } from "../lib/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import Avatar from "./Avatar";

const NotificationItem = ({ item, onPress, onDeleteNotification }) => {
  const { styles, activeColors } = useComponentsStyles();
  const createdAt = moment(item?.created_at).fromNow();
  // const handleNotificationTap = () => {
  //   let { postId, commentId } = JSON.parse(item?.data);
  //   router.push({ pathname: "postDetails", params: { postId, commentId } });
  // };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.notificationContaienr,
        {
          backgroundColor: item?.isRead
            ? activeColors.backgroundColor
            : activeColors.commentBox,
        },
      ]}
    >
      <View style={styles.row}>
        <View>
          <Avatar size={hp(5)} uri={item?.sender?.image} />
          <View style={styles.notificationTypeIcon}>
            <Ionicons
              name={
                item?.type === "like"
                  ? "heart"
                  : item?.type === "comment"
                  ? "chatbox-ellipses"
                  : "people"
              }
              color={
                item?.type === "like"
                  ? activeColors.danger
                  : item?.type === "comment"
                  ? activeColors.blue
                  : activeColors.success
              }
              size={hp(1.6)}
            />
          </View>
        </View>
        <View>
          <View style={styles.nameMsgContainer}>
            <View style={styles.notificationMsgContainer}>
              <Text style={styles.name}>{item?.sender?.name}</Text>
              <AppText>{item?.message}</AppText>
            </View>
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
