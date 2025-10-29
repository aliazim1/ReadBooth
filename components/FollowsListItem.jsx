import { Pressable, Text, View } from "react-native";

import { hp } from "../lib/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppButton from "./AppButton";
import AppIonicon from "./AppIonicon";
import AppText from "./AppText";
import Avatar from "./Avatar";

const FollowsListItem = ({
  item,
  router,
  currentUserId,
  showFollowBtn = true,
  style,
  onPress,
}) => {
  const { styles, activeColors } = useComponentsStyles();

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "userDetails",
          params: {
            userId: item?.id,
          },
        });
      }}
      style={[
        styles.postHeader,
        {
          paddingHorizontal: 0,
          marginBottom: 5,
          alignItems: "center",
        },
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
      {showFollowBtn && currentUserId != item?.id && (
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

      {!showFollowBtn && <AppIonicon name={"chevron-forward"} size={20} />}
    </Pressable>
  );
};

export default FollowsListItem;
