import { useRouter } from "expo-router";
import { useRef, useState } from "react";

import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../components/AppButton";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import SafeScreen from "../components/SafeScreen";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { supabase } from "../lib/supabase";

export default function login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("error", error);
    setLoading(false);
    if (error) {
      Alert.alert("Login", error.message);
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
              source={require("../assets/images/read.png")}
            />
            <View style={styles.logoContainer}>
              <CustomText style={styles.title}>Welcome Back, Reader</CustomText>
              <CustomText style={styles.headline}>
                Your Book Community Awaits
              </CustomText>
            </View>

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
                <CustomText style={styles.errorText}>{error}</CustomText>
              </View>
            ) : null}

            <View style={styles.btn}>
              <AppButton
                title={"Sign In"}
                onPress={onSubmit}
                isLoading={loading}
              />
            </View>

            <View style={styles.noAccountContainer}>
              <View style={styles.noAccountContainerRow}>
                <CustomText>Not a member of ReadVine community?</CustomText>
                <TouchableOpacity onPress={() => router.replace("./signup")}>
                  <CustomText style={styles.signIn}>Sign Up</CustomText>
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
    fontWeight: theme.fonts.medium,
    marginTop: hp(0.5),
    marginBottom: hp(2),
    color: theme.colors.textDark,
    textAlign: "center",
  },
  btn: {
    marginTop: hp(3),
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
