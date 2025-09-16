import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";
import ScreenWrapper from "../components/SafeScreen";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
        />
        <View style={styles.headlineContainer}>
          <Text style={styles.title}>ReadVine</Text>
          <Text style={styles.punchLine}>
            A Community Built for Book Lovers
          </Text>
        </View>

        {/* footer for the button to get started */}
        <View style={styles.footer}>
          <AppButton
            title="Get Started"
            onPress={() => router.replace("./signup")}
          />
        </View>
      </View>
    </ScreenWrapper>
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
    paddingHorizontal: wp(10),
  },
  footer: {
    gap: 30,
    width: "100%",
  },
});

export default Welcome;
