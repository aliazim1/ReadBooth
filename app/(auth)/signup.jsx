import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { supabase } from "../../lib/supabase";
import { authStyles } from ".././../styles/authStyles";
import {
  AppButton,
  AppText,
  CustomInput,
  HeaderPunchLine,
  Illustration,
  SafeScreen,
} from "../../components";

const signup = () => {
  const { styles } = authStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfrimPassword = confirmPassword.trim();

    if (trimmedName === "") {
      setError("Please enter your name.");
      return;
    } else if (trimmedName.length < 2) {
      setError("Name cannot be one character");
      return;
    }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (trimmedConfrimPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (trimmedPassword != trimmedConfrimPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: { name: trimmedName },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("");
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
            <Illustration source={require("../../assets/images/bgImage.png")} />

            <HeaderPunchLine
              title={"Join ReadBooth"}
              punchLine={"Discover. Share. Connect"}
            />
            <View>
              <CustomInput
                label={"Full Name"}
                placeholder="Enter your full name"
                autoCapitalize={"words"}
                value={fullName}
                onChangeText={setFullName}
              />
              <CustomInput
                label={"Email"}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize=""
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                label={"Password"}
                placeholder="Create a password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <CustomInput
                label={"Confirm Password"}
                placeholder="Confirm password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
                title={"Sign Up"}
                onPress={onSubmit}
                isLoading={loading}
              />
            </View>
            <View style={styles.noAccountContainer}>
              <View style={styles.noAccountContainerRow}>
                <AppText>Already have an account?</AppText>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <AppText style={styles.primaryColorText}>Sign In</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
};
export default signup;
