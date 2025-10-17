import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { hp } from "../helpers/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import Avatar from "./Avatar";

const PostHeader = ({
  item,
  createdAt,
  onNavigate,
  forPostCard = true,
  style,
  onPress,
}) => {
  const { styles, activeColors } = useComponentsStyles();
  return (
    <Pressable onPress={onNavigate} style={[styles.postHeader, style]}>
      <View style={styles.headerFirstRow}>
        <Avatar size={hp(5)} uri={item?.user?.image || item?.image} />
        <View>
          <Text style={styles.name}>
            {forPostCard ? item?.user?.name : item?.name}
          </Text>

          <AppText style={styles.username}>
            {forPostCard ? `@${item?.user?.username}` : "Public"}
          </AppText>
        </View>
        {forPostCard && (
          <View style={styles.createdAtContainer}>
            <AppText style={styles.createdAt}>{createdAt}</AppText>
          </View>
        )}
      </View>
      {forPostCard && (
        <Pressable onPress={onPress}>
          <Ionicons
            size={hp(1.8)}
            color={activeColors.text}
            name="ellipsis-horizontal"
          />
        </Pressable>
      )}
    </Pressable>
  );
};

export default PostHeader;
