import { Image } from "expo-image";
import { View } from "react-native";

import { getUserImageSrc } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";

const Avatar = ({ uri, size = 90, rounded = 50, style = {} }) => {
  const { styles } = useComponentsStyles();
  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[
          { borderCurve: "circular" },
          { width: size, height: size, borderRadius: rounded },
          style,
        ]}
      />
    </View>
  );
};

export default Avatar;
