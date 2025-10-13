// PostOptionsModal.js
import { Modal, Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import SettingListItem from "./SettingListItem";

const BookOptionsModal = ({
  owner = false,
  visible,
  onClose,
  saved = false,
  onShare = () => {},
  onEdit = () => {},
  onSave = () => {},
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
          {owner && (
            <SettingListItem
              icon={"pencil"}
              label={"Edit Book"}
              onPress={onEdit}
            />
          )}
          <SettingListItem
            icon={"share"}
            label={"Share Book"}
            onPress={onShare}
          />
          {!owner && (
            <SettingListItem
              icon={saved ? "bookmark" : "bookmark-outline"}
              label={saved ? "Saved Book" : "Save Book"}
              onPress={onSave}
              chevron={false}
            />
          )}

          {/* Delete post: if it's in postDetails screen & is owner */}
          {owner && (
            <SettingListItem
              chevron={false}
              icon={"trash-can"}
              label={"Delete Book"}
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

export default BookOptionsModal;
