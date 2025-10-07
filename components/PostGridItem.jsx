import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { theme } from "../constants/theme";
import { getSupabaseFileUrl } from "../services/imageService";
import AppText from "./AppText";

const PostGridItem = ({ item, router }) => {
  const post = item?.post || item;

  return (
    <View style={styles.postContainer}>
      {post?.file && post?.file?.includes("postImages") ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "postDetails",
              params: { postId: post?.id },
            })
          }
        >
          <Image
            source={getSupabaseFileUrl(post?.file)}
            transition={100}
            contentFit="cover"
            style={styles.media}
          />
        </Pressable>
      ) : (
        <View style={styles.textOnly}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "postDetails",
                params: { postId: post?.id },
              })
            }
          >
            <AppText style={styles.textOnlyContent}>{post.body}</AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 1,
    backgroundColor: theme.colors.veryLightGrey,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  textOnly: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: theme.colors.lightGrey,
  },
  textOnlyContent: {
    textAlign: "center",
    color: theme.colors.dark,
    fontSize: 12,
  },
});

export default PostGridItem;
