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
import { addBook } from "../../../services/bookServices";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { useScreensStyles } from ".././../../styles/screensStyles";

const AddBook = () => {
  const { styles, activeColors } = useScreensStyles();
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [link, setLink] = useState("");

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
    if (title.trim() === "") {
      Alert.alert("Missing Title", "Please enter the book title.");
      return;
    }
    if (author.trim() === "") {
      Alert.alert("Missing Author", "Please enter the author's name.");
      return;
    }
    if (!file) {
      Alert.alert("Missing Image", "Please select a cover image for the book.");
      return;
    }

    let data = {
      file,
      title: title,
      author: author,
      link: link,
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
      setLink("");
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
            <PostHeader
              item={user}
              forPostCard={false}
              style={{ paddingHorizontal: 0 }}
            />

            {/* the text-field with actions */}
            <CustomInput
              value={title}
              label={"Title"}
              multiline={false}
              autoCorrect={true}
              onChangeText={setTitle}
              placeholder="Book Title"
              autoCapitalize={"words"}
              style={styles.textInputs}
            />
            <CustomInput
              value={author}
              label={"Author"}
              multiline={false}
              autoCorrect={true}
              onChangeText={setAuthor}
              autoCapitalize={"words"}
              placeholder="Book Author"
              style={styles.textInputs}
            />
            <CustomInput
              label={"Link"}
              value={link}
              multiline={false}
              autoCorrect={true}
              onChangeText={setLink}
              style={styles.textInputs}
              placeholder="Enter link to the book (optional)"
            />

            {/* media will display here once selected */}
            {file && (
              <View style={styles.file}>
                {getFileType(file) == "image" && (
                  <Image
                    style={{ flex: 1 }}
                    source={{ uri: getFileUri(file) }}
                  />
                )}
                <AppIoniconTouchable
                  name="close"
                  size={20}
                  style={styles.deleteIcon}
                  color={activeColors.white}
                  onPress={() => setFile(null)}
                />
              </View>
            )}

            {/* attach media label & icons */}
            <View style={styles.mediaContainer}>
              <AppText style={styles.addMediaText}> Add Picture </AppText>
              <AppIoniconTouchable
                size={24}
                name="image"
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
              autoPlay
              loop={false}
              style={styles.lottie}
              source={require("../../../assets/images/success.json")}
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

export default AddBook;
