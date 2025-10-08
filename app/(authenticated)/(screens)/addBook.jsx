import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../../components/AppButton";
import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import CustomInput from "../../../components/CustomInput";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { addBook } from "../../../services/postService";

const CreatePost = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [link1, setLink1] = useState("");

  const onPick = async () => {
    try {
      const mediaConfig = {
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
      let file = null;

      // iOS trimmed video may return top-level URI instead of assets
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          file = result.assets[0];
          if (!file.type) file.type = "image";
        } else if (result.uri) {
          // fallback for single file (trimmed video)
          file = { uri: result.uri, type: "image" };
        }
      }
      if (file) setFile(file);
    } catch (error) {
      console.log("Error picking media:", error);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    // if file is local, return true otherwise false
    if (typeof file == "object") return true;
    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;

    // check for local files
    if (isLocalFile(file)) {
      return file.type;
    }

    // check for remote file if image
    if (file.includes("postImages")) return "image";
    return null;
  };

  const getFileUri = (file) => {
    if (!file) return null;

    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  };

  // function to publish the post
  const onSubmit = async () => {
    // if user tries to post an empty post
    if (title.trim() === "" || author.trim() === "" || !file) {
      Alert.alert("Required Fields", "Please fill out the required fields.");
      return;
    }

    let data = {
      file,
      title: title,
      author: author,
      link1: link1,
      userId: user?.id,
    };

    // add the book to the shelve
    setLoading(true);
    let res = await addBook(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      setTitle("");
      setAuthor("");
      setLink1("");
      setShowSuccess(true); // show the animation
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } else {
      Alert.alert("Add Book", res.msg);
    }
  };

  return (
    <SafeScreen style={{ paddingHorizontal: wp(3.9) }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            {/* the profile details  */}
            <View style={styles.header}>
              <Avatar uri={user?.image} size={hp(6.5)} />
              <View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            {/* the text-field with actions */}
            <CustomInput
              label={"Title"}
              placeholder="Book Title"
              value={title}
              onChangeText={setTitle}
              multiline={false}
              autoCorrect={true}
              style={styles.textInputs}
            />
            <CustomInput
              label={"Author"}
              placeholder="Book Author"
              value={author}
              onChangeText={setAuthor}
              multiline={false}
              autoCorrect={true}
              style={styles.textInputs}
            />
            <CustomInput
              label={"Link"}
              placeholder="Enter link to the book"
              value={link1}
              onChangeText={setLink1}
              multiline={false}
              autoCorrect={true}
              style={styles.textInputs}
            />

            {/* media will display here once selected */}
            {file && (
              <View style={styles.file}>
                {getFileType(file) == "image" && (
                  <Image
                    source={{ uri: getFileUri(file) }}
                    style={{ flex: 1 }}
                  />
                )}
                <AppIoniconTouchable
                  name="close"
                  size={20}
                  color={theme.colors.white}
                  style={styles.deleteIcon}
                  onPress={() => setFile(null)}
                />
              </View>
            )}

            {/* attach media label & icons */}
            <View style={styles.mediaContainer}>
              <AppText style={styles.addMediaText}> Add Picture </AppText>
              <View style={styles.mediaIconContainer}>
                <AppIoniconTouchable
                  name="image"
                  size={20}
                  color="black"
                  onPress={() => onPick()}
                  style={styles.mediaIcon}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* the success animation  */}
      {showSuccess && (
        <View
          style={[
            { ...StyleSheet.absoluteFillObject },
            styles.successContainer,
          ]}
        >
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../../../assets/images/success.json")}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          </View>
        </View>
      )}
      {/* add button won't be scrollable  */}
      <AppButton title="Add Book" onPress={onSubmit} isLoading={loading} />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingTop: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: hp(2.2),
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold,
  },
  publicText: {
    fontSize: hp(1.5),
    color: theme.colors.mediumGrey,
    fontWeight: theme.fonts.medium,
  },
  textInputs: {
    paddingVertical: 14,
    marginVertical: hp(0.5),
    textAlignVertical: "top",
  },
  file: {
    width: "100%",
    height: hp(30),
    overflow: "hidden",
    marginTop: hp(2),
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  mediaContainer: {
    padding: 10,
    borderWidth: 0.7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginVertical: hp(2),
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    justifyContent: "space-between",
    borderColor: theme.colors.mediumGrey,
  },
  mediaIconContainer: {
    gap: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  mediaIcon: {
    padding: 5,
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.7,
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.white,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
  },
  addMediaText: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.bold,
  },
  deleteIcon: {
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255, 0, 0, 0.6)",
  },
  successContainer: {
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  animationContainer: {
    width: wp(55),
    height: wp(55),
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 250,
    height: 250,
  },
});
export default CreatePost;
