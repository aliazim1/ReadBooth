import { Alert } from "react-native";

const CustomAlert = ({
  title = "Alert",
  message,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Yes",
}) => {
  Alert.alert(title, message, [
    {
      text: cancelText,
      onPress: () => {},
      style: "cancel",
    },
    {
      text: confirmText,
      onPress: onConfirm,
      style: "destructive",
    },
  ]);
};

export default CustomAlert;
