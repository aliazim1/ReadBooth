import { StyleSheet, View } from "react-native";
import { wp } from "../helpers/common";

export default function HorizontalPadding({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { marginHorizontal: wp(4) },
});
