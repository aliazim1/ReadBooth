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

export default function signup() {
  const router = useRouter();

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
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
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
            <Illustration source={require("../../assets/images/bgImage.png")} />

            <HeaderPunchLine
              title={"Join ReadVine"}
              punchLine={"Discover. Share. Connect"}
            />
            <CustomInput
              placeholder="Your full name"
              style={{ marginTop: 10 }}
              value={fullName}
              onChangeText={setFullName}
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
                title={"Continue"}
                onPress={onSubmit}
                isLoading={loading}
              />
            </View>
            <View style={styles.noAccountContainer}>
              <View style={styles.noAccountContainerRow}>
                <AppText>Already a member of ReadVine?</AppText>
                <TouchableOpacity onPress={() => router.replace("/login")}>
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
    fontWeight: theme.fonts.bold,
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
