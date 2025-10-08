import { View } from "react-native";
import { wp } from "../helpers/common";

const HorizontalPadding = ({ children, style }) => {
  return <View style={[{ marginHorizontal: wp(4) }, style]}>{children}</View>;
};

export default HorizontalPadding;
