import { Pressable, Text, View } from "react-native";

import { appTheme } from "../constants/theme";
import { useComponentsStyles } from "../styles/componentsStyles";
import Loading from "./Loading";

const FollowButton = ({
  title = "Click Me",
  isLoading = false,
  containerStyle,
  onPress,
}) => {
  const { styles, activeColors } = useComponentsStyles();
  if (isLoading) {
    return (
      <View style={[styles.followButton, containerStyle]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable style={[styles.followButton, containerStyle]} onPress={onPress}>
      <Text
        style={{
          color: activeColors.white,
          fontWeight: appTheme.fonts.semibold,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default FollowButton;
