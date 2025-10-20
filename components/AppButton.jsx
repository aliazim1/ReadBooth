import { Image, Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppIonicon from "./AppIonicon";
import AppText from "./AppText";
import Loading from "./Loading";

const AppButton = ({
  title = "Click Me",
  iconName,
  imageUri,
  iconColor,
  hasShadow = false,
  isLoading = false,
  containerStyle,
  textStyle,
  onPress,
}) => {
  const { styles, activeColors } = useComponentsStyles();
  if (isLoading) {
    return (
      <View style={[styles.button, containerStyle]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.button, hasShadow && styles.shadowBtn, containerStyle]}
      onPress={onPress}
    >
      {iconName && !isLoading && (
        <AppIonicon
          name={iconName}
          style={{ marginRight: 5 }}
          size={22}
          color={activeColors.iconsColor || iconColor}
        />
      )}
      {imageUri && !isLoading && (
        <Image source={imageUri} resizeMode="contain" style={styles.image} />
      )}
      {title && <AppText style={[styles.text, textStyle]}>{title}</AppText>}
    </Pressable>
  );
};

export default AppButton;
