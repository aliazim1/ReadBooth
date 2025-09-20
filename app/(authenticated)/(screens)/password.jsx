import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import CustomInput from "../../../components/CustomInput";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getUserImageSrc } from "../../../services/imageService";

const ChangePassword = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user: currentUser, setAuth } = useAuth();

  const [user, setUser] = useState({
    passwrod: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        passwrod: currentUser.passwrod || "",
      });
    }
  }, [currentUser]);

  let imageSource = getUserImageSrc(currentUser?.image);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppIoniconTouchable
          name="close"
          size={28}
          onPress={() => router.back()}
        />
      ),
      headerRight: () => (
        <TouchableOpacity disabled={false}>
          <AppText
            style={{
              color: theme.colors.primary,
              fontWeight: theme.fonts.bold,
            }}
          >
            Save
          </AppText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  return (
    <SafeScreen bg={theme.colors.white}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: wp(4),
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <CustomInput
              placeholder={""}
              label={"Current password"}
              value={user.passwrod}
              onChangeText={(value) => setUser({ ...user, passwrod: value })}
            />
            <CustomInput
              placeholder={""}
              label={"New password"}
              value={user.newPassword}
              onChangeText={(value) => setUser({ ...user, phone: value })}
            />
            <CustomInput
              placeholder={""}
              label={"Confirm new password"}
              value={user.email}
              onChangeText={(value) => setUser({ ...user, email: value })}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  profileDetails: {
    marginTop: hp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    width: 50,
    borderRadius: 20,
    paddingVertical: 2,
    backgroundColor: theme.colors.white,
    shadowColor: "#0000006b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
});
export default ChangePassword;
