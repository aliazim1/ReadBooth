import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { hp } from "../lib/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import Avatar from "./Avatar";

const PostHeader = ({
  item,
  style,
  onPress,
  createdAt,
  onNavigate,
  forPostCard = true,
  verifyBadge = false,
  comingFromUserDetails = false,
}) => {
  const { styles, activeColors } = useComponentsStyles();

  return (
    <Pressable onPress={onNavigate} style={[styles.postHeader, style]}>
      <View style={styles.headerFirstRow}>
        <Avatar size={hp(5)} uri={item?.user?.image || item?.image} />
        <View>
          <View style={styles.nameAndMark}>
            <Text style={styles.name}>
              {forPostCard ? item?.user?.name : item?.name}
            </Text>
            {verifyBadge && (
              <MaterialCommunityIcons
                name={"check-decagram"}
                color={activeColors.blue}
              />
            )}
          </View>
          <AppText style={styles.username}>
            {forPostCard ? `@${item?.user?.username}` : "Public"}
          </AppText>
        </View>

        {/* don't display 3-dots if coming from userDetails screen */}
        {forPostCard && !comingFromUserDetails && (
          <View style={styles.postHeaderRightIcons}>
            <AppText style={styles.createdAt}>{createdAt}</AppText>
            <Pressable onPress={onPress}>
              <Ionicons
                size={hp(2.2)}
                color={activeColors.text}
                name="ellipsis-horizontal"
              />
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default PostHeader;
