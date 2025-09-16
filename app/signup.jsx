import { useRouter } from "expo-router";
import { useRef, useState } from "react";

import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import CustomInput from "../components/CustomInput";
import SafeScreen from "../components/SafeScreen";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { supabase } from "../lib/supabase";

export default function signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingverify, setLoadingVerify] = useState(false);
  const fullnameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!fullnameRef.current || !emailRef.current || !passwordRef.current) {
      setError("Please enter your full name, email, and password.");
      return;
    }

    let name = fullnameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  return (
    <SafeScreen bg={theme.colors.white}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require("../assets/images/bgImage.png")}
            />
            <View style={styles.logoContainer}>
              <AppText style={styles.title}>Join ReadVine</AppText>
              <AppText style={styles.headline}>
                Discover. Share. Connect
              </AppText>
            </View>

            <CustomInput
              searchBox={true}
              placeholder="Your full name"
              style={{ marginTop: 10 }}
              onChangeText={(value) => {
                fullnameRef.current = value;
                setError("");
              }}
            />
            <CustomInput
              searchBox={true}
              placeholder="Email address"
              keyboardType="email-address"
              style={{ marginTop: 10 }}
              onChangeText={(value) => {
                emailRef.current = value;
                setError("");
              }}
            />

            <CustomInput
              searchBox={true}
              placeholder="Password"
              secureTextEntry={true}
              style={{ marginTop: 10 }}
              onChangeText={(value) => {
                passwordRef.current = value;
                setError("");
              }}
            />

            {/* display the error occurs during signing up */}
            {error ? (
              <View style={styles.errorContainer}>
                <AppText style={styles.errorText}>{error}</AppText>
              </View>
            ) : null}

            <View style={styles.btn}>
              <AppButton
                title={"Continue"}
                onPress={onSubmit}
                isLoading={loading}
              />
            </View>
            <View style={styles.noAccountContainer}>
              <View style={styles.noAccountContainerRow}>
                <AppText>Already a member of ReadVine?</AppText>
                <TouchableOpacity onPress={() => router.replace("./login")}>
                  <AppText style={styles.signIn}>Sign In</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  image: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.dark,
  },
  headline: {
    fontSize: hp(1.8),
    marginTop: hp(0.5),
    marginBottom: hp(2),
    textAlign: "center",
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
  btn: {
    marginTop: hp(3),
  },

  btnContainer: {
    marginBottom: hp(3),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginOptionBtns: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.white,
  },
  noAccountContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  noAccountContainerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signIn: {
    marginLeft: 5,
    fontWeight: theme.fonts.medium,
    color: theme.colors.primary,
  },

  // email verification section
  imgContainer: {
    paddingTop: 40,
    alignItems: "center",
  },
  img: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },

  email: {
    fontWeight: "bold",
  },
  verificationContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  codeInput: {
    width: "60%",
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: theme.colors.dark,
  },
  verificationBtn: {
    marginTop: 25,
  },

  // display error message
  errorContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  errorText: {
    color: theme.colors.rose,
    fontSize: 13,
  },
});
