import { Video } from "expo-av";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/AppButton";
import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import RichTextEditor from "../../../components/RichTextEditor";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { createOrUpdatePost } from "../../../services/postService";

const CreatePost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onPick = async (isImage) => {
    try {
      const mediaConfig = {
        mediaTypes: isImage ? "images" : "videos",
        allowsEditing: isImage ? true : false, // trimming for videos on iOS
        aspect: isImage ? [4, 3] : undefined,
        quality: 0.7,
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
      let file = null;

      // iOS trimmed video may return top-level URI instead of assets
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          file = result.assets[0];
        } else if (result.uri) {
          // fallback for single file (trimmed video)
          file = { uri: result.uri };
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
    return "video";
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
    if (!bodyRef.current && !file) {
      Alert.alert("Empty Post", "Your post can’t be empty.");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };

    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");

      // show animation
      setShowSuccess(true);

      // wait for animation, then navigate
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 4000); // show for 4s which is the animation duration,
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  return (
    <SafeScreen style={{ paddingHorizontal: wp(4) }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* the profile details  */}
        <View style={styles.header}>
          <Avatar uri={user?.image} size={hp(6.5)} />
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.publicText}>Public</Text>
          </View>
        </View>

        {/* the rich-text-field with actions */}
        <RichTextEditor
          editorRef={editorRef}
          onChange={(body) => (bodyRef.current = body)}
        />

        {/* media will display here once selected */}
        {file && (
          <View style={styles.file}>
            {getFileType(file) == "video" ? (
              <Video
                style={{ flex: 1 }}
                source={{ uri: getFileUri(file) }}
                useNativeControls
                resizeMode="cover"
                isLooping
              />
            ) : (
              <Image source={{ uri: getFileUri(file) }} style={{ flex: 1 }} />
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
          <AppText style={styles.addMediaText}>Photo/Video </AppText>
          <View style={styles.mediaIcon}>
            <AppIoniconTouchable
              name="image"
              size={26}
              color={theme.colors.primary}
              onPress={() => onPick(true)}
            />
            <AppIoniconTouchable
              name="videocam"
              color={theme.colors.primary}
              size={32}
              onPress={() => onPick(false)}
            />
          </View>
        </View>
      </ScrollView>
      {/* publish button won't be scrollable  */}
      <AppButton title="Publish" onPress={onSubmit} isLoading={loading} />

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
    color: theme.colors.textDark,
    fontWeight: theme.fonts.semibold,
  },
  publicText: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
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
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    justifyContent: "space-between",
  },
  mediaIcon: {
    gap: 25,
    alignItems: "center",
    flexDirection: "row",
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white, // dim background behind the box
    // backgroundColor: "rgba(0,0,0,0.3)", // dim background behind the box
    zIndex: 999,
  },
  animationContainer: {
    width: wp(55),
    height: wp(55),
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
export default CreatePost;
