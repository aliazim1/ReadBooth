import { Image } from "expo-image";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Linking, Share, StyleSheet, Text, View } from "react-native";
import ParsedText from "react-native-parsed-text";

import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import { getSupabaseFileUrl } from "../services/imageService";
import { createPostLike, removePostLike } from "../services/postService";
import AppIoniconTouchable from "./AppIoniconTouchable";
import AppText from "./AppText";
import Avatar from "./Avatar";
import ExpoVideoPlayer from "./ExpoVideoPlayer";

const PostCard = ({ item, currentUser, router }) => {
  const [likes, setLikes] = useState([]);

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
      params: { posdId: item?.id },
    });
  };

  // function to share the post
  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) }; // only shares the caption here
    Share.share(content);
  };

  // opens the link if the body is as link
  const handleUrlPress = (url) => {
    Linking.openURL(url);
  };

  // formats the created_at time as (min/hr ago)
  const createdAt = moment(item?.created_at).fromNow();

  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    // column container: for post
    <View style={styles.container}>
      {/* row container: user's avatar, name, username, post created_at, 3-dots */}
      <View style={styles.postHeader}>
        {/* avatar */}
        <View style={styles.headerFirstRow}>
          <Avatar size={hp(5)} uri={item?.user?.image} />

          {/* name & user name as column */}
          <View>
            <Text style={styles.name}>{item?.user?.name}</Text>
            <AppText style={styles.username}>@{item?.user?.username}</AppText>
          </View>

          {/* created_at  */}
          <View style={styles.createdAtContainer}>
            <AppText style={styles.createdAt}>{createdAt}</AppText>
          </View>
        </View>

        {/* 3-dots on the right */}
        <AppIoniconTouchable
          name="ellipsis-horizontal"
          size={hp(2.2)}
          onPress={openPostDetails}
        />
      </View>

      {/* container: post's caption */}
      {item?.body && (
        <View style={styles.captionContainer}>
          <ParsedText
            style={styles.text}
            parse={[
              { type: "url", style: styles.link, onPress: handleUrlPress },
            ]}
          >
            {item?.body}
          </ParsedText>
        </View>
      )}

      {/* container: if post's media is image */}
      {item?.file && item?.file?.includes("postImages") && (
        <Image
          source={getSupabaseFileUrl(item?.file)}
          transition={100}
          contentFit="cover"
          style={styles.postMedia}
        />
      )}

      {/* container: if post's media is video */}
      {item?.file && item?.file?.includes("postVideos") && (
        <ExpoVideoPlayer
          videoUri={getSupabaseFileUrl(item?.file)}
          style={styles.postMedia}
        />
      )}

      {/* row container: post's footer (interactions: like, comment, save, share) */}
      <View style={styles.postFooterContainer}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.footerBtn}>
            <AppIoniconTouchable
              name="bookmark-outline"
              size={22}
              color={theme.colors.dark}
              style={{ marginLeft: 0 }}
            />
            <AppText style={styles.footerLabel}>143.54M</AppText>
          </View>
        </View>

        <View style={styles.footerBtn}>
          <AppIoniconTouchable
            name="share-outline"
            size={24}
            color={theme.colors.dark}
            style={{ marginLeft: 0 }}
            onPress={onShare}
          />
          <AppText style={styles.footerLabel}>143.54M</AppText>
        </View>

        <View style={styles.footerBtn}>
          <AppIoniconTouchable
            name="chatbubble-outline"
            size={23}
            color={theme.colors.dark}
            style={{ marginLeft: 0 }}
          />
          <AppText style={styles.footerLabel}>42K</AppText>
        </View>
        <View style={styles.footerBtn}>
          <AppIoniconTouchable
            name={liked ? "heart" : "heart-outline"}
            color={liked ? theme.colors.rose : theme.colors.dark}
            size={26}
            onPress={onLike}
            style={{ marginLeft: 0 }}
          />
          <AppText style={styles.footerLabel}>{likes?.length}</AppText>
        </View>
      </View>
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
  headerFirstRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: hp(1.8),
    color: theme.colors.textDark,
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
    height: hp(35),
    marginTop: hp(1),
    width: "100%",
    borderCurve: "continuous",
  },
  postFooterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: hp(1),
    paddingHorizontal: wp(5),
  },
  footerBtn: {
    gap: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  footerLabel: {
    fontSize: hp(1),
  },
});

export default PostCard;
