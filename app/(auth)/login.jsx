import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import CustomInput from "../../components/CustomInput";
import HeaderPunchLine from "../../components/HeaderPunchLine";
import Illustration from "../../components/Illustration";
import SafeScreen from "../../components/SafeScreen";
import { theme } from "../../constants/theme";
import { hp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";

export default function login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    // --- Validation ---
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    // --- Clean inputs ---
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setError("");
        router.replace("(authenticated)/(tabs)/home");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            <Illustration source={require("../../assets/images/read.png")} />

            <HeaderPunchLine
              title={"Welcome Back"}
              punchLine={"Your ReadVine community awaits"}
            />

            <CustomInput
              placeholder="Email address"
              keyboardType="email-address"
              style={{ marginTop: 10 }}
              value={email}
              onChangeText={setEmail}
            />

            <CustomInput
              placeholder="Password"
              secureTextEntry={true}
              style={{ marginTop: 10 }}
              value={password}
              onChangeText={setPassword}
            />

            {/* display the error occurs during signing up */}
            {error ? (
              <View style={styles.errorContainer}>
                <AppText style={styles.errorText}>{error}</AppText>
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
                <AppText>Not a member of ReadVine?</AppText>
                <TouchableOpacity onPress={() => router.replace("/signup")}>
                  <AppText style={styles.signUp}>Sign Up</AppText>
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
  signUp: {
    marginLeft: 5,
    fontWeight: theme.fonts.bold,
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
