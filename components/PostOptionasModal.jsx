// PostOptionsModal.js
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import SettingListItem from "./SettingListItem";

const PostOptionsModal = ({
  owner = false,
  homeScreen = true,
  visible,
  onClose,
  onShare = () => {},
  onEdit = () => {},
  onSave = () => {},
  onHide = () => {},
  onReport = () => {},
  onDelete = () => {},
  item,
}) => {
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
            icon={"bookmark"}
            label={"Save Post"}
            onPress={onSave}
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
              iconColor={theme.colors.danger}
              labelColor={theme.colors.danger}
              onPress={onDelete}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  popup: {
    paddingTop: hp(2.2),
    paddingBottom: hp(5),
    gap: 24,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
  },
});

export default PostOptionsModal;
