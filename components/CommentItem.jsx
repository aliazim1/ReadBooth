import moment from "moment";
import { StyleSheet, View } from "react-native";

import CustomAlert from "../components/CustomAlert";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import AppIoniconTouchable from "./AppIoniconTouchable";
import AppText from "./AppText";
import Avatar from "./Avatar";

const CommentItem = ({
  item,
  highlight = false,
  canDelete = false,
  onDelete = () => {},
}) => {
  //
  // formats the created_at time as (min/hr ago)
  const createdAt = moment(item?.created_at).fromNow();

  // Delete the comment, receives the onDelete function from parent
  const handleDelete = () => {
    CustomAlert({
      title: "Delete",
      message: "Are you sure you want to delete this comment?",
      onConfirm: onDelete,
    });
  };

  return (
    <View style={highlight && styles.highlight}>
      <View style={[styles.commentHeader]}>
        <View style={styles.imgNameTime}>
          <Avatar uri={item?.user?.image} size={40} />
          <View>
            <View style={styles.nameAndTimeContainer}>
              <AppText style={styles.name}>{item?.user?.name}</AppText>
              <AppText style={styles.lightText}>{createdAt}</AppText>
            </View>
            {item?.user?.username && (
              <AppText style={styles.lightText}>
                @{item?.user?.username}
              </AppText>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 30,
          }}
        >
          <AppIoniconTouchable name="heart-outline" size={16} />
          {/* delete/more icon  */}
          {canDelete && (
            <AppIoniconTouchable
              name="trash"
              size={16}
              color={theme.colors.dark}
              onPress={handleDelete}
            />
          )}
        </View>
      </View>
      {<AppText style={styles.body}>{item?.text}</AppText>}
      {/* TODO:  */}
    </View>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgNameTime: {
    flexDirection: "row",
    gap: 7,
  },
  nameAndTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontSize: hp(1.5),
    color: theme.colors.dark,
    fontWeight: theme.fonts.semibold,
  },
  lightText: {
    fontSize: hp(1.2),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  body: {
    marginLeft: wp(15),
    fontSize: hp(1.5),
    color: theme.colors.dark,
    paddingBottom: 10,
    borderBottomColor: theme.colors.darkLight,
    borderBottomWidth: 0.7,
  },
  highlight: {
    backgroundColor: theme.colors.veryLightGrey,
  },
});
export default CommentItem;
