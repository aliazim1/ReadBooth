// PostOptionsModal.js
import { Modal, Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import SettingListItem from "./SettingListItem";

const PostOptionsModal = ({
  owner = false,
  homeScreen = true,
  visible,
  onClose,
  onShare = () => {},
  onEdit = () => {},
  onHide = () => {},
  onReport = () => {},
  onDelete = () => {},
  item,
}) => {
  const { styles, activeColors } = useComponentsStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.popup}>
          {/* only the owner can edit the post */}
          {owner && (
            <SettingListItem
              icon={"comment-edit"}
              label={"Edit Post"}
              onPress={onEdit}
            />
          )}
          <SettingListItem
            icon={"share"}
            label={"Share Post"}
            onPress={onShare}
          />
          <SettingListItem
            chevron={false}
            icon={"eye-off"}
            label={"Hide Post"}
            onPress={onHide}
          />
          {/* Report post: only others' posts */}
          {!owner && (
            <SettingListItem
              icon={"flag"}
              label={"Report Post"}
              onPress={onReport}
            />
          )}

          {/* Delete post: if it's in postDetails screen & is owner */}
          {!homeScreen && owner && (
            <SettingListItem
              chevron={false}
              icon={"trash-can"}
              label={"Delete Post"}
              iconColor={activeColors.danger}
              labelColor={activeColors.danger}
              onPress={onDelete}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default PostOptionsModal;
