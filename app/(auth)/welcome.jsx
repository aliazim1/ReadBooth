import { useRouter } from "expo-router";
import { View } from "react-native";

import { authStyles } from ".././../styles/authStyles";
import { AppButton, HeaderPunchLine, Illustration } from "../../components";

const Welcome = () => {
  const { styles, activeColors } = authStyles();
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
          title="Sign In"
          hasShadow={true}
          containerStyle={styles.signinBtn}
          textStyle={[styles.btnTitle, { color: activeColors.black }]}
          onPress={() => router.replace("/login")}
        />
        <AppButton
          title="Sign Up"
          textStyle={styles.btnTitle}
          onPress={() => router.replace("/signup")}
        />
      </View>
    </View>
  );
};

export default Welcome;
