import { Image } from "expo-image";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ParsedText from "react-native-parsed-text";

import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import { getSupabaseFileUrl } from "../services/imageService";
import {
  createPostLike,
  createSavePost,
  deletePost,
  removePostLike,
  removeSavePost,
} from "../services/postService";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";
import Avatar from "./Avatar";
import CustomAlert from "./CustomAlert";
import PostOptionsModal from "./PostOptionasModal";

const PostCard = ({ item, router, currentUser, homeScreen = true }) => {
  const [likes, setLikes] = useState([]);
  const [saves, setSaves] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes);
    setSaves(item?.savedPosts);
  }, [item]);

  // funtion for liking a post
  const onLike = async () => {
    if (liked) {
      // remove the like
      let updatedLikes = likes.filter((like) => like.userId != currentUser?.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) Alert.alert("Like", "Something went wrong.");
    } else {
      // add the like
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };

      setLikes([...likes, data]);
      let res = await createPostLike(data);
      if (!res.success) Alert.alert("Dislike", "Something went wrong.");
    }
  };

  // funtion for saving the post(s)
  const onSavePost = async () => {
    if (saved) {
      // remove the like
      let updatedSaves = saves.filter((save) => save.userId != currentUser?.id);
      setSaves([...updatedSaves]);
      let res = await removeSavePost(item?.id, currentUser?.id);
      if (!res.success) Alert.alert("Save", "Something went wrong.");
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };

      setSaves([...saves, data]);
      let res = await createSavePost(data);
      if (!res.success) Alert.alert("Unsave", "Something went wrong.");
    }
  };

  // function to open the post details
  const openPostDetails = () => {
    router.push({
      pathname: "postDetails",
      params: { postId: item?.id },
    });
  };

  // function to open the post comments only
  const openPostComments = () => {
    router.push({
      pathname: "comments",
      params: { postId: item?.id },
    });
  };

  // function to share the post
  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) }; // only shares the caption here
    Share.share(content);
  };

  // function to delete the post (by ownership)
  const onDeletePost = async () => {
    let res = await deletePost(item?.id);
    if (res.success) {
      setMenuVisible(false);
      router.back();
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  // alert to ensure the user want to delete the post
  const handleDeletePost = () => {
    CustomAlert({
      title: "Delete Post",
      message: "Are you sure you want to delete this post?",
      onConfirm: onDeletePost,
    });
  };

  // function to navigate to the EditPost
  const onEditPost = async () => {
    if (!homeScreen) {
      router.back();
    }

    router.push({ pathname: "editPost", params: { ...item } });
  };

  // function to open the link if the body is as link
  const handleUrlPress = (url) => {
    Linking.openURL(url);
  };

  // formats the created_at time as (min/hr ago)
  const createdAt = moment(item?.created_at).fromNow();

  // toggle the like icon
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  // toggle the save icon
  const saved = saves.filter((save) => save.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    <View style={styles.container}>
      {/* user's avatar, name, username, post created_at, 3-dots */}
      <View style={styles.postHeader}>
        {/* avatar */}
        <View style={styles.headerFirstRow}>
          <Avatar size={hp(5)} uri={item?.user?.image} />
          <View>
            <Text style={styles.name}>{item?.user?.name}</Text>
            <AppText style={styles.username}>@{item?.user?.username}</AppText>
          </View>
          <View style={styles.createdAtContainer}>
            <AppText style={styles.createdAt}>{createdAt}</AppText>
          </View>
        </View>
        <AppPressableIoniconIcon
          onPress={() => setMenuVisible(true)}
          name={"ellipsis-horizontal"}
          size={hp(1.8)}
          showLabel={false}
          width={20}
        />
      </View>

      {/* container: post's caption */}
      {item?.body && (
        <View style={styles.captionContainer}>
          <Pressable onPress={homeScreen ? openPostDetails : () => {}}>
            <ParsedText
              style={styles.text}
              parse={[
                { type: "url", style: styles.link, onPress: handleUrlPress },
              ]}
            >
              {item?.body}
            </ParsedText>
          </Pressable>
        </View>
      )}

      {/* container: if post's media is image */}
      {item?.file && item?.file?.includes("postImages") && (
        <Pressable onPress={homeScreen ? openPostDetails : () => {}}>
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            contentFit="cover"
            style={styles.postMedia}
          />
        </Pressable>
      )}

      {/* row container: post's footer (interactions: like, comment, save, share) */}
      <View style={styles.postFooterContainer}>
        <View style={{ flexDirection: "row" }}>
          <AppPressableIoniconIcon
            onPress={onLike}
            size={21}
            label={likes?.length}
            name={liked ? "heart" : "heart-outline"}
            color={liked ? theme.colors.danger : theme.colors.text}
          />
          <AppPressableIoniconIcon
            name="chatbubble-outline"
            label={item?.comments[0]?.count}
            onPress={homeScreen ? openPostComments : null}
          />
          <AppPressableIoniconIcon
            onPress={onShare}
            label={"Save"}
            name="arrow-redo-outline"
          />
        </View>
        <AppPressableIoniconIcon
          onPress={onSavePost}
          label={saved ? "Saved" : "Save"}
          name={saved ? "bookmark" : "bookmark-outline"}
        />
      </View>
      <PostOptionsModal
        visible={menuVisible}
        homeScreen={homeScreen}
        owner={item?.user?.id == currentUser?.id}
        onClose={() => setMenuVisible(false)}
        onShare={onShare}
        onEdit={onEditPost}
        onHide={() => {}}
        onReport={() => {}}
        onDelete={handleDeletePost}
        item={item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1.2),
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: wp(3),
    justifyContent: "space-between",
  },

  headerFirstRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold,
  },
  username: {
    fontSize: hp(1.5),
    color: theme.colors.mediumGrey,
    fontWeight: theme.fonts.medium,
  },
  createdAt: {
    marginTop: -14,
    fontSize: hp(1.2),
    color: theme.colors.mediumGrey,
  },
  captionContainer: {
    marginTop: hp(1),
    paddingHorizontal: wp(4),
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  postMedia: {
    width: "100%",
    aspectRatio: 1,
    marginTop: hp(1),
    borderCurve: "continuous",
  },
  postFooterContainer: {
    marginTop: hp(1),
    paddingLeft: wp(4),
    paddingRight: wp(1),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PostCard;
