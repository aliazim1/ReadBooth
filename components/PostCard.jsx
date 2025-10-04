import { Ionicons } from "@expo/vector-icons";
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
  deletePost,
  removePostLike,
} from "../services/postService";
import AppText from "./AppText";
import Avatar from "./Avatar";
import CustomAlert from "./CustomAlert";
import ExpoVideoPlayer from "./ExpoVideoPlayer";
import PostOptionsModal from "./PostOptionasModal";

const PostCard = ({ item, router, currentUser, homeScreen = true }) => {
  const [likes, setLikes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

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

  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
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
        <Pressable style={styles.actions} onPress={() => setMenuVisible(true)}>
          <Ionicons
            name={"ellipsis-horizontal"}
            color={theme.colors.dark}
            size={hp(1.8)}
          />
        </Pressable>
      </View>

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
      {/* container: if post's media is video */}
      {item?.file && item?.file?.includes("postVideos") && (
        <ExpoVideoPlayer
          videoUri={getSupabaseFileUrl(item?.file)}
          style={styles.postMedia}
        />
      )}

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

      {/* row container: post's footer (interactions: like, comment, save, share) */}
      <View style={styles.postFooterContainer}>
        {/* </View> */}
        <Pressable style={styles.footerBtnContainer} onPress={onShare}>
          <Ionicons
            name="arrow-redo-outline"
            size={19}
            color={theme.colors.dark}
          />
          <AppText style={styles.footerLabel}>Save</AppText>
        </Pressable>
        <Pressable onPress={onLike} style={styles.footerBtnContainer}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            color={liked ? theme.colors.danger : theme.colors.dark}
            size={21}
          />
          <AppText style={styles.footerLabel}>{likes?.length}</AppText>
        </Pressable>
        <Pressable
          onPress={homeScreen ? openPostComments : null}
          style={styles.footerBtnContainer}
        >
          <Ionicons
            name="chatbubble-outline"
            size={19}
            color={theme.colors.dark}
          />
          <AppText style={styles.footerLabel}>
            {item?.comments[0]?.count}
          </AppText>
        </Pressable>
        <Pressable style={styles.footerBtnContainer}>
          <Ionicons
            name="bookmark-outline"
            size={19}
            color={theme.colors.dark}
          />
          <AppText style={styles.footerLabel}>Save</AppText>
        </Pressable>
      </View>
      <PostOptionsModal
        visible={menuVisible}
        homeScreen={homeScreen}
        owner={item?.user?.id == currentUser?.id}
        onClose={() => setMenuVisible(false)}
        onShare={onShare}
        onEdit={onEditPost}
        onSave={() => {}}
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
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    height: "100%",
    width: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerFirstRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: hp(1.8),
    color: theme.colors.dark,
    fontWeight: theme.fonts.semibold,
  },
  username: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  createdAt: {
    fontSize: hp(1.2),
    marginTop: -14,
  },
  captionContainer: {
    paddingHorizontal: wp(4),
    marginTop: hp(1),
  },
  text: {
    fontSize: 16,
    color: theme.colors.dark,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp(1),
    paddingHorizontal: wp(4),
  },
  footerBtnContainer: {
    gap: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  footerLabel: {
    fontSize: hp(1),
  },
});

export default PostCard;

// the old footer icons...
{
  /* <View style={styles.footerBtnContainer}>
          <AppIoniconTouchable
            name={liked ? "heart" : "heart-outline"}
            color={liked ? theme.colors.rose : theme.colors.dark}
            size={21}
            onPress={onLike}
            style={{ marginLeft: 0 }}
          />

          <AppText style={styles.footerLabel}>
            {likes?.length} 
          </AppText>
        </View>
        <View style={styles.footerBtnContainer}>
          <AppIoniconTouchable
            name="chatbubble-outline"
            size={19}
            color={theme.colors.dark}
            style={{ marginLeft: 0 }}
            onPress={showMoreIcons ? openPostDetails : null}
          />
          <AppText style={styles.footerLabel}>
            {item?.comments[0]?.count}
          </AppText>
        </View>

        <View style={styles.footerBtnContainer}>
          <AppIoniconTouchable
            name="arrow-redo-outline"
            size={20}
            color={theme.colors.dark}
            style={{ marginLeft: 0 }}
            onPress={onShare}
          />
          <AppText style={styles.footerLabel}>Share post</AppText>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.footerBtnContainer}>
            <AppIoniconTouchable
              name="bookmark-outline"
              size={19}
              color={theme.colors.dark}
              style={{ marginLeft: 0 }}
            />

            <AppText style={styles.footerLabel}>Save post</AppText>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.footerBtnContainer}>
            <AppIoniconTouchable
              name="ban-outline"
              size={20}
              color={theme.colors.dark}
              style={{ marginLeft: 0 }}
            />

            <AppText style={styles.footerLabel}>Hide post</AppText>
          </View>
        </View> */
}
