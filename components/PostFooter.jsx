import { View } from "react-native";

import { memo } from "react";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import CustomAlert from "./CustomAlert";

const PostFooter = memo(
  ({
    item,
    likes,
    liked,
    saved,
    onLike,
    onShare,
    onHidePost,
    homeScreen,
    onSavePost,
    owner = false,
    openPostComments,
    showHideOption = true,
  }) => {
    const { styles, activeColors } = useComponentsStyles();

    return (
      <View style={styles.postFooterContainer}>
        <View style={{ flexDirection: "row" }}>
          <AppPressableIoniconIcon
            onPress={onLike}
            size={21}
            label={likes?.length}
            name={liked ? "heart" : "heart-outline"}
            color={liked ? activeColors.danger : activeColors.iconsColor}
          />
          <AppPressableIoniconIcon
            name="chatbubble-outline"
            label={item?.comments?.[0]?.count || "0"}
            onPress={homeScreen ? openPostComments : null}
          />
          <AppPressableIoniconIcon
            onPress={onShare}
            label={"Save"}
            name="arrow-redo-outline"
          />

          {/* only allow to hide psot if not post owner & is in home feeds */}
          {!owner && showHideOption && (
            <AppPressableIoniconIcon
              onPress={() => {
                CustomAlert({
                  title: "Hide this post?",
                  message: "You won’t see this post in your feed anymore.",
                  onConfirm: onHidePost,
                });
              }}
              label={"Hide"}
              name="eye-off"
            />
          )}
        </View>
        {!owner && (
          <AppPressableIoniconIcon
            onPress={onSavePost}
            label={saved ? "Saved" : "Save"}
            name={saved ? "bookmark" : "bookmark-outline"}
          />
        )}
      </View>
    );
  }
);

export default PostFooter;
