import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Image } from "expo-image";
import AppIonicon from "../../../components/AppIonicon";
import AppText from "../../../components/AppText";
import CustomInput from "../../../components/CustomInput";
import Loading from "../../../components/Loading";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getUserImageSrc } from "../../../services/imageService";
import { updateUserData } from "../../../services/userService";

const EditProfileDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
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
    let userData = { ...user };

    let { name, username, phone, email, address, image, bio } = userData;

    if (!name || !username || !email) {
      Alert.alert("Required Fields", "Name, username, and email are required.");
      return;
    }

    setLoading(true);
    const res = await updateUserData(currentUser?.id, userData);
    setLoading(false);
    if (res.success) setUserData({ ...currentUser, ...userData });
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <AppText style={{ color: theme.colors.rose }}>Cancel</AppText>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onSave}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <AppText style={styles.saveBtn}>Save</AppText>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, router, onSave, loading]);

  const addProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  let imageSource = user.image
    ? { uri: user.image }
    : currentUser?.image
    ? { uri: getUserImageSrc(currentUser.image) }
    : require("../../../assets/images/user.png");

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
                {/* <Avatar uri={imageSource} size={100} /> */}
                <Image source={imageSource} style={styles.avatar} />
                <TouchableOpacity onPress={addProfilePic} style={styles.add}>
                  <AppIonicon
                    name="camera"
                    color={theme.colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
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

            {/* <AppButton title="Submit" onPress={onSave} /> */}
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
    position: "absolute",
    bottom: 10,
    right: 0,
    borderRadius: 50,
    padding: 4,
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
