import { Modal, Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import SettingListItem from "./SettingListItem";

const OptionsModal = ({
  owner = false,
  usedForUserDetails = false,
  homeScreen = true,
  visible,
  onClose,
  onShare = () => {},
  onEdit = () => {},
  onHide = () => {},
  onReport = () => {},
  onDelete = () => {},
  onBlock = () => {},
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
          {!usedForUserDetails && owner && (
            <SettingListItem
              icon={"comment-edit"}
              label={"Edit post"}
              onPress={onEdit}
            />
          )}

          {!usedForUserDetails && (
            <SettingListItem
              icon={"share"}
              label={"Share post"}
              onPress={onShare}
            />
          )}
          {!usedForUserDetails && (
            <SettingListItem
              chevron={false}
              icon={"eye-off"}
              label={"Hide post"}
              onPress={onHide}
            />
          )}
          {/* Report post: only others' posts */}
          {!usedForUserDetails && !owner && (
            <SettingListItem
              icon={"flag"}
              label={"Report post"}
              onPress={onReport}
            />
          )}

          {/* Delete post: if it's in postDetails screen & is owner */}
          {!usedForUserDetails && !homeScreen && owner && (
            <SettingListItem
              chevron={false}
              icon={"trash-can"}
              label={"Delete post"}
              iconColor={activeColors.danger}
              labelColor={activeColors.danger}
              onPress={onDelete}
            />
          )}

          {/* Block user */}
          {usedForUserDetails && (
            <SettingListItem
              chevron={false}
              icon={"flag-outline"}
              label={"Report user"}
              onPress={onBlock}
            />
          )}
          {usedForUserDetails && (
            <SettingListItem
              chevron={false}
              icon={"block-helper"}
              label={"Block user"}
              iconColor={activeColors.danger}
              labelColor={activeColors.danger}
              onPress={onBlock}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default OptionsModal;
