import { Image } from "expo-image";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";

import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { getSupabaseFileUrl } from "../services/imageService";
import AppIoniconTouchable from "./AppIoniconTouchable";
import AppText from "./AppText";
import Avatar from "./Avatar";
import ExpoVideoPlayer from "./ExpoVideoPlayer";

// styles for each of the RichText (bold, link, italic, p)
const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.6),
};

const tagStyles = {
  div: textStyle,
  p: textStyle,
  strong: { fontWeight: "bold", color: theme.colors.dark },
  em: { fontStyle: "italic", color: theme.colors.dark },
  a: { color: theme.colors.blue },
};

const PostCard = ({ item, currentUser, router }) => {
  // formats the created_at time as (min/hr ago)
  const createdAt = moment(item?.created_at).fromNow();

  // function to oepn the psot details
  const openPostDetails = () => {};

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
          <RenderHTML
            contentWidth={wp(100)}
            source={{ html: item?.body }}
            tagsStyles={tagStyles}
          />
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
          videoUri={getSupabaseFileUrl(item?.file)?.uri}
          style={styles.postMedia}
        />
      )}

      {/* row container: post's footer (interactions: like, comment, save, share) */}
      <View style={styles.postFooterContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1.2),
    // borderWidth: 1.5,
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
    marginTop: hp(1),
    paddingHorizontal: wp(4),
  },
  postMedia: {
    height: hp(30),
    width: "100%",
    marginTop: hp(1),
    borderCurve: "continuous",
  },
  postFooterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});
export default PostCard;
