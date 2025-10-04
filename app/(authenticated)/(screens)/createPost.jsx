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
import { createPost } from "../../../services/postService";

const CreatePost = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bodyContent, setBodyContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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

      if (file) {
        setFile(file);
      } else {
        console.log("No file selected or trimming failed");
      }
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

    // check for remote file if image/video
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
    if (bodyContent.trim() === "" && !file) {
      Alert.alert("Empty Post", "Your post can’t be empty.");
      return;
    }

    let data = {
      file,
      body: bodyContent,
      userId: user?.id,
    };

    // create post
    setLoading(true);
    let res = await createPost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      setBodyContent("");
      setShowSuccess(true); // show the animation
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    } else {
      Alert.alert("Post", res.msg);
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
              placeholder="What’s on your bookshelf today?"
              value={bodyContent}
              onChangeText={setBodyContent}
              multiline={true}
              autoCorrect={true}
              numberOfLines={5}
              style={styles.bodyContent}
            />

            {/* media will display here once selected */}
            {file && (
              <View style={styles.file}>
                {getFileType(file) == "image" && (
                  <Image
                    source={{ uri: getFileUri(file) }}
                    style={{ flex: 1 }}
                  />
                  // <Video
                  //   style={{ flex: 1 }}
                  //   source={{ uri: getFileUri(file) }}
                  //   useNativeControls
                  //   resizeMode="cover"
                  //   shouldPlay
                  //   // isLooping
                  // />
                  // ) : (
                  //   <Image
                  //     source={{ uri: getFileUri(file) }}
                  //     style={{ flex: 1 }}
                  //   />
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
              <AppText style={styles.addMediaText}> Add Image </AppText>
              <View style={styles.mediaIconContainer}>
                <AppIoniconTouchable
                  name="image"
                  size={20}
                  color={theme.colors.dark}
                  onPress={() => onPick()}
                  style={styles.mediaIcon}
                />

                {/* No Video option available at the moment. */}
                {/* <AppIoniconTouchable
                  name="videocam"
                  color={theme.colors.dark}
                  size={20}
                  onPress={() => onPick(false)}
                  style={styles.mediaIcon}
                /> */}
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
      {/* publish button won't be scrollable  */}
      <AppButton title="Publish" onPress={onSubmit} isLoading={loading} />
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
    color: theme.colors.dark,
    fontWeight: theme.fonts.semibold,
  },
  publicText: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  bodyContent: {
    height: hp(15),
    marginVertical: hp(2),
    textAlignVertical: "top",
  },
  file: {
    width: "100%",
    height: hp(30),
    overflow: "hidden",
    marginBottom: hp(2),
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  mediaContainer: {
    padding: 10,
    borderWidth: 0.7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    justifyContent: "space-between",
    borderColor: theme.colors.darkLight,
  },
  mediaIconContainer: {
    gap: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  mediaIcon: {
    backgroundColor: theme.colors.white,
    padding: 5,
    borderRadius: theme.radius.xxl,
    shadowColor: "hsla(0, 0.00%, 0.00%, 0.30)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 5,
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
    width: 300,
    height: 300,
  },
});
export default CreatePost;
