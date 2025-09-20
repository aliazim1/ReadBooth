import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import { getUserImageSrc } from "../services/imageService";

const Avatar = ({ uri, size = 90, rounded = 50, style = {} }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: rounded },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginBottom: hp(1),
    overflow: "hidden",
  },
  avatar: {
    borderCurve: "circular",
  },
});
export default Avatar;
