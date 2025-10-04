import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../../components/AppButton";
import AppIonicon from "../../../components/AppIonicon";
import CustomInput from "../../../components/CustomInput";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getUserImageSrc, uploadFile } from "../../../services/imageService";
import { updateUserData } from "../../../services/userService";

const EditProfileDetails = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user: currentUser, setUserData } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        username: currentUser.username || "",
        phone: currentUser.phone || "",
        image: currentUser.image || null,
        email: currentUser.email || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const onSave = async () => {
    let userData = {
      ...user,
      name: user.name.trim(),
      username: user.username.trim(),
      phone: user.phone.trim(),
      email: user.email.trim(),
      address: user.address.trim(),
      bio: user.bio.trim(),
    };

    let { name, username, email, phone, image, address, bio } = userData;
    if (
      name.trim().length < 2 ||
      username.trim().length < 3 ||
      email.trim() === ""
    ) {
      Alert.alert("Required Fields", "Name, username, and email are required.");
      return;
    }

    setLoading(true);

    if (typeof image == "object") {
      let imageRes = await uploadFile("profiles", image?.uri, true);

      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    const res = await updateUserData(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  const addProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: { uri: result.assets[0].uri } });
    }
  };

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image.uri
      : getUserImageSrc(user.image);

  return (
    <SafeScreen bg={theme.colors.white}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: wp(4),
          paddingBottom: 20,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <View style={styles.profileDetails}>
              <View>
                {imageSource ? (
                  <Image source={imageSource} style={styles.avatar} />
                ) : (
                  <AppIonicon name={"user"} />
                )}
                <Pressable onPress={addProfilePic} style={styles.add}>
                  <AppIonicon
                    name="camera"
                    color={theme.colors.dark}
                    size={20}
                  />
                </Pressable>
              </View>
            </View>
            <CustomInput
              placeholder={"Enter your name"}
              label={"Name"}
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <CustomInput
              placeholder={"Choose a username"}
              label={"Username"}
              value={user.username}
              onChangeText={(value) => setUser({ ...user, username: value })}
            />

            <CustomInput
              placeholder={"Enter your email"}
              label={"Email"}
              value={user.email}
              keyboardType="email-address"
              onChangeText={(value) => setUser({ ...user, email: value })}
            />
            <CustomInput
              placeholder={"Add phone number"}
              label={"Phone number"}
              value={user.phone}
              keyboardType="numeric"
              onChangeText={(value) => setUser({ ...user, phone: value })}
            />
            <CustomInput
              placeholder={"Add your city & State"}
              label={"City and State"}
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <CustomInput
              placeholder={"Write a short description about yourself"}
              label={"Bio"}
              value={user.bio}
              multiline={true}
              style={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <AppButton
              title="Save"
              onPress={onSave}
              isLoading={loading}
              containerStyle={{ marginTop: 30 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  profileDetails: {
    marginTop: hp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    position: "absolute",
    bottom: -10,
    left: wp(8.5),
    borderRadius: 50,
    paddingVertical: 1,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.white,
    shadowColor: "#0000006b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  saveBtn: {
    color: theme.colors.success,
    fontWeight: theme.fonts.bold,
  },
});
export default EditProfileDetails;
