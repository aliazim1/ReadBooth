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

const signup = () => {
  const { styles } = authStyles();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingverify, setLoadingVerify] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation
    // if (trimmedName.length < 2) {
    //   setError("Name must be at least 2 characters.");
    //   return;
    // }

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: { name: trimmedName, username: trimmedName },
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
                label={"Email"}
                placeholder="Enter your email address"
                keyboardType="email-address"
                style={{ marginTop: 10 }}
                autoCapitalize=""
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                label={"Password"}
                placeholder="Create a password"
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
                title={"Continue"}
                onPress={onSubmit}
                isLoading={loading}
              />
            </View>
            <View style={styles.noAccountContainer}>
              <View style={styles.noAccountContainerRow}>
                <AppText>Already have a ReadBooth account?</AppText>
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
