import { StyleSheet, View } from "react-native";
import { theme } from "../constants/theme";
import CustomText from "./CustomText";

export default function OrDivider({
  text = "Or",
  containerStyle,
  textStyle,
  lineStyle,
}) {
  return (
    <View style={[styles.row, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      <CustomText style={[{ marginHorizontal: 10 }, textStyle]}>
        {text}
      </CustomText>
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
