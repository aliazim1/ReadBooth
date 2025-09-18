import { Image, StyleSheet } from "react-native";
import { hp, wp } from "../helpers/common";

const Illustration = ({ source }) => {
  return <Image style={styles.image} resizeMode="contain" source={source} />;
};

const styles = StyleSheet.create({
  image: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
});
export default Illustration;
