import { StyleSheet, View } from "react-native";
import { theme } from "../constants/theme";
import AppText from "./AppText";

export default function OrDivider({
  text = "Or",
  containerStyle,
  textStyle,
  lineStyle,
}) {
  return (
    <View style={[styles.row, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      <AppText style={[{ marginHorizontal: 10 }, textStyle]}>{text}</AppText>
      <View style={[styles.line, lineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray,
  },
});
