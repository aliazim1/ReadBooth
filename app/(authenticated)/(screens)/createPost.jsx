import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../../components/AppButton";
import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import CustomInput from "../../../components/CustomInput";
import PostHeader from "../../../components/PostHeader";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { wp } from "../../../lib/common";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { createPost } from "../../../services/postService";
import { useScreensStyles } from ".././../../styles/screensStyles";

const CreatePost = () => {
  const { styles } = useScreensStyles();
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
    <SafeScreen>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            {/* the profile details  */}

            <PostHeader
              item={user}
              show3dots={false}
              forPostCard={false}
              style={{ paddingHorizontal: 0, marginBottom: 20 }}
            />

            {/* the text-field with actions */}
            <CustomInput
              placeholder="What’s on your bookshelf today?"
              value={bodyContent}
              onChangeText={setBodyContent}
              multiline={true}
              autoCorrect={true}
              autoCapitalize={"sentences"}
              numberOfLines={5}
              style={styles.bio}
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
                  color="white"
                  style={styles.deleteIcon}
                  onPress={() => setFile(null)}
                />
              </View>
            )}

            {/* attach media label & icons */}
            <View style={styles.mediaContainer}>
              <AppText style={styles.addMediaText}> Add Image </AppText>
              <AppIoniconTouchable
                name="image"
                size={24}
                onPress={() => onPick()}
              />
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
      <View style={{ paddingHorizontal: wp(4) }}>
        <AppButton title="Publish" onPress={onSubmit} isLoading={loading} />
      </View>
    </SafeScreen>
  );
};

export default CreatePost;
