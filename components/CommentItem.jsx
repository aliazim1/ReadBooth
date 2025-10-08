import moment from "moment";
import { View } from "react-native";

import CustomAlert from "../components/CustomAlert";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppIoniconTouchable from "./AppIoniconTouchable";
import AppText from "./AppText";
import Avatar from "./Avatar";

const CommentItem = ({
  item,
  highlight = false,
  canDelete = false,
  onDelete = () => {},
}) => {
  const { styles, activeColors } = useComponentsStyles();
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

export default CommentItem;
