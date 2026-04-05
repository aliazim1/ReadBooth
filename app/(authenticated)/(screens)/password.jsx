import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { wp } from "../../../lib/common";
import { useAuth } from "../../../contexts/AuthContext";
import { useScreensStyles } from "../../../styles/screensStyles";
import { AppButton, CustomInput, SafeScreen } from "../../components";

const ChangePassword = () => {
  const { styles, activeColors } = useScreensStyles();
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

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

  return (
    <SafeScreen>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyle}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <CustomInput
              placeholder={"Type your current password"}
              label={"Current password"}
              value={user.passwrod}
              onChangeText={(value) => setUser({ ...user, passwrod: value })}
            />
            <CustomInput
              placeholder={"Type your new password"}
              label={"New password"}
              value={user.newPassword}
              onChangeText={(value) => setUser({ ...user, phone: value })}
            />
            <CustomInput
              placeholder={"Confirm your new password"}
              label={"Confirm new password"}
              value={user.email}
              onChangeText={(value) => setUser({ ...user, email: value })}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <View style={{ paddingHorizontal: wp(4) }}>
        <AppButton
          title="Save"
          // onPress={onSave}
          isLoading={loading}
          containerStyle={{ marginTop: 30 }}
        />
      </View>
    </SafeScreen>
  );
};

export default ChangePassword;
