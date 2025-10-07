import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppButton from "../../components/AppButton";
import HeaderPunchLine from "../../components/HeaderPunchLine";
import Illustration from "../../components/Illustration";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

const Welcome = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View>
        <Illustration source={require("../../assets/images/welcome.png")} />
        <HeaderPunchLine
          title={"ReadBooth"}
          punchLine={"More Than Books—A Community"}
        />
      </View>
      <View style={styles.footer}>
        <AppButton
          title="Sign Up"
          textStyle={styles.btnTitle}
          onPress={() => router.replace("/signup")}
        />
        <AppButton
          title="Sign In"
          hasShadow={true}
          containerStyle={{ backgroundColor: theme.colors.white }}
          textStyle={[styles.btnTitle, { color: theme.colors.dark }]}
          onPress={() => router.replace("/login")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: theme.colors.background,
    paddingTop: hp(15),
    paddingHorizontal: wp(4),
  },
  footer: {
    marginTop: hp(15),
    width: "100%",
    gap: 20,
  },
  btnTitle: {
    fontWeight: theme.fonts.bold,
  },
});

export default Welcome;
