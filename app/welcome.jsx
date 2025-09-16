import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

const Welcome = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />
        <View style={styles.headlineContainer}>
          <AppText style={styles.title}>ReadVine</AppText>
          <AppText style={styles.punchLine}>
            A Community Built for Book Lovers
          </AppText>
        </View>
      </View>
      {/* footer for the button to get started */}
      <View style={styles.footer}>
        <AppButton
          title="Get Started"
          onPress={() => router.replace("./signup")}
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
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  headlineContainer: {
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchLine: {
    textAlign: "center",
    color: theme.colors.text,
  },
  footer: {
    marginTop: hp(39),
    width: "100%",
  },
});

export default Welcome;
