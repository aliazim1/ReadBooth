import { Pressable, Text, View } from "react-native";

import { hp } from "../helpers/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppButton from "./AppButton";
import AppText from "./AppText";
import Avatar from "./Avatar";

const FollowsListItem = ({
  item,
  currentUserId,
  onNavigate,
  style,
  onPress,
}) => {
  const { styles, activeColors } = useComponentsStyles();

  return (
    <Pressable
      onPress={onNavigate}
      style={[
        styles.postHeader,
        { paddingHorizontal: 0, marginBottom: 5, alignItems: "center" },
        style,
      ]}
    >
      <View style={styles.headerFirstRow}>
        <Avatar size={hp(5)} uri={item?.image} />
        <View>
          <Text style={styles.name}>{item?.name}</Text>

          <AppText style={styles.username}>{item?.username}</AppText>
        </View>
      </View>
      {currentUserId != item?.id && (
        <AppButton
          title={item.followed ? "Following" : "Follow"}
          containerStyle={{
            width: 84,
            backgroundColor: item.followed
              ? activeColors.mediumGrey
              : activeColors.primary,
            height: 30,
          }}
          textStyle={{ fontSize: hp(1.6) }}
          onPress={onPress}
        />
      )}
    </Pressable>
  );
};

export default FollowsListItem;
