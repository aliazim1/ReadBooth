// PostOptionsModal.js
import { Modal, Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import SettingListItem from "./SettingListItem";

const NotificationOptionsModal = ({
  visible,
  onClose,
  onRead = () => {},
  onDelete = () => {},
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
          <SettingListItem
            icon={"read"}
            chevron={false}
            label={"Mark notifications as read"}
            onPress={onRead}
          />
          <SettingListItem
            chevron={false}
            icon={"trash-can"}
            label={"Clear all notifications"}
            iconColor={activeColors.danger}
            labelColor={activeColors.danger}
            onPress={onDelete}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default NotificationOptionsModal;
