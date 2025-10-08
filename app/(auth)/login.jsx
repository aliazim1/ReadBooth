import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
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
import { supabase } from "../../lib/supabase";
import { authStyles } from ".././../styles/authStyles";

export default function login() {
  const router = useRouter();
  const { styles } = authStyles();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    // clean the inputs
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
        router.replace("/home");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeScreen>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <Illustration source={require("../../assets/images/read.png")} />

            <HeaderPunchLine
              title={"Welcome Back"}
              punchLine={"Your ReadBooth community awaits"}
            />

            <View>
              <CustomInput
                label={"Email"}
                placeholder="Enter your email address"
                keyboardType="email-address"
                style={{ marginTop: 10 }}
                value={email}
                autoCapitalize=""
                autoCorrect={false}
                onChangeText={setEmail}
              />

              <CustomInput
                label={"Password"}
                placeholder="Enter your password"
                secureTextEntry={true}
                style={{ marginTop: 10 }}
                value={password}
                onChangeText={setPassword}
              />
            </View>

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
                <AppText>Don't have a ReadBooth account?</AppText>
                <TouchableOpacity onPress={() => router.replace("/signup")}>
                  <AppText style={styles.primaryColorText}>Sign Up Now</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
}
