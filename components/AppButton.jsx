import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import AppIonicon from "./AppIonicon";
import AppText from "./AppText";
import Loading from "./Loading";

const AppButton = ({
  title = "Click Me",
  iconName,
  imageUri,
  iconColor = theme.colors.darkLight,
  hasShadow = false,
  isLoading = false,
  containerStyle,
  textStyle,
  onPress,
}) => {
  if (isLoading) {
    return (
      <View
        style={[styles.button, containerStyle, { backgroundColor: "white" }]}
      >
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, hasShadow && styles.shadowBtn, containerStyle]}
      onPress={onPress}
    >
      {iconName && !isLoading && (
        <AppIonicon
          name={iconName}
          style={{ marginRight: 5 }}
          size={22}
          color={iconColor}
        />
      )}
      {imageUri && !isLoading && (
        <Image source={imageUri} resizeMode="contain" style={styles.image} />
      )}
      {title && <AppText style={[styles.text, textStyle]}>{title}</AppText>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(5.5),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl * 20,
    flexDirection: "row",
  },
  shadowBtn: {
    shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    fontSize: hp(2.2),
    color: "white",
    fontWeight: theme.fonts.bold,
  },
  image: {
    height: 25,
    width: 25,
    marginRight: 10,
    alignSelf: "center",
  },
});

export default AppButton;
