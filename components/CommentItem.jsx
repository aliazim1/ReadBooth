import moment from "moment";
import { View } from "react-native";

import CustomAlert from "../components/CustomAlert";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import Avatar from "./Avatar";
import HeaderIcons from "./HeaderIcons";

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
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      onConfirm: onDelete,
    });
  };

  return (
    <View>
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

        <HeaderIcons
          icon1="heart-outline"
          icon2={canDelete ? "trash" : ""}
          size={16}
          onPress2={handleDelete}
        />
      </View>
      {/* comment body text */}
      {
        <AppText
          style={[
            styles.body,
            {
              backgroundColor:
                (highlight && activeColors.primary) || activeColors.commentBox,
            },
          ]}
        >
          {item?.text}
        </AppText>
      }
    </View>
  );
};

export default CommentItem;
