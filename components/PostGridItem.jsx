import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { getSupabaseFileUrl } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const PostGridItem = ({ item, router }) => {
  const post = item?.post || item;
  const { styles } = useComponentsStyles();
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

export default PostGridItem;
