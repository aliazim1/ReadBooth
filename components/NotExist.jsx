import { View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppIonicon from "./AppIonicon";
import AppMaterialCommunityIcon from "./AppMaterialCommunityIcon";
import AppText from "./AppText";

const NotExist = ({ iconName, message, ioniconIcon = false }) => {
  const { styles } = useComponentsStyles();
  return (
    <View style={styles.noNofiticationsContainer}>
      {ioniconIcon && <AppIonicon name={iconName} />}
      {!ioniconIcon && <AppMaterialCommunityIcon name={iconName} />}
      <AppText>{message}</AppText>
    </View>
  );
};

export default NotExist;
