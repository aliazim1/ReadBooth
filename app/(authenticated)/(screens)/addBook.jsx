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
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { addBook } from "../../../services/postService";
import { useScreensStyles } from ".././../../styles/screensStyles";

const CreatePost = () => {
  const { styles, activeColors } = useScreensStyles();
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
            <View style={styles.postHeader}>
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
                  color={activeColors.white}
                  style={styles.deleteIcon}
                  onPress={() => setFile(null)}
                />
              </View>
            )}

            {/* attach media label & icons */}
            <View style={styles.mediaContainer}>
              <AppText style={styles.addMediaText}> Add Picture </AppText>
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
      {/* add button won't be scrollable  */}
      <View style={{ paddingHorizontal: wp(4) }}>
        <AppButton title="Add Book" onPress={onSubmit} isLoading={loading} />
      </View>
    </SafeScreen>
  );
};

export default CreatePost;
