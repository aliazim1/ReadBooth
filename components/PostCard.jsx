import { Image } from "expo-image";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, Share, View } from "react-native";
import ParsedText from "react-native-parsed-text";

import { stripHtmlTags } from "../lib/common";
import { getSupabaseFileUrl } from "../services/imageService";
import {
  createPostLike,
  createSavePost,
  deletePost,
  hidePost,
  removePostLike,
  removeSavePost,
} from "../services/postService";
import { useComponentsStyles } from "../styles/componentsStyles";
import CustomAlert from "./CustomAlert";
import OptionsModal from "./OptionsModal";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

const PostCard = ({
  item,
  router,
  currentUser,
  setPosts,
  homeScreen = true,
  show3dots = false,
}) => {
  const { styles } = useComponentsStyles();
  const [likes, setLikes] = useState(item?.postLikes || []);
  const [saves, setSaves] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes || []);
    setSaves(item?.savedPosts || []);
  }, [item]);

  // funtion for liking a post
  const onLike = async () => {
    if (!likes) setLikes([]);

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
      let res = await createPostLike(data, item, currentUser);
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
      params: {
        postId: item?.id,
        show3dots: item?.user?.id === currentUser?.id,
      },
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
  const onEditPost = () => {
    setMenuVisible(false);
    router.push({ pathname: "editPost", params: { ...item } });
  };

  const onHidePost = async () => {
    let res = await hidePost(item?.id, currentUser.id);
    if (!res.success) Alert.alert("Hide Post", "Could not hide the post.");
    if (res.success) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== item?.id));
    }
  };

  // function to open the link if the post caption hsa a link
  const handleUrlPress = (url) => {
    Linking.openURL(url);
  };

  // formats the created_at time as (min/hr ago)
  // const createdAt = moment(item?.created_at).calendar(); // today/yesterday at time or date format
  const date = moment(item?.created_at);
  const createdAt = date.isSame(moment(), "day")
    ? date.format("h:mm A")
    : date.format("MM/DD/YYYY");

  // toggle the like icon
  const liked = (likes || []).some((like) => like.userId === currentUser?.id);

  // toggle the save icon
  const saved = saves.filter((save) => save.userId == currentUser?.id)[0]
    ? true
    : false;

  return (
    <View style={styles.container}>
      <PostHeader
        item={item}
        verifyBadge={true}
        createdAt={createdAt}
        show3dots={show3dots}
        onNavigate={() => {
          router.push({
            pathname: "userDetails",
            params: {
              userId: item?.user?.id,
            },
          });
        }}
        onPress={() => setMenuVisible(true)}
      />

      {/* container: post's caption */}
      {item?.body && (
        <View style={styles.captionContainer}>
          <Pressable onPress={homeScreen ? openPostDetails : () => {}}>
            <ParsedText
              style={styles.appText}
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

      {/* post's footer (like, comment, save, share ,hide) */}
      <PostFooter
        item={item}
        likes={likes}
        liked={liked}
        saved={saved}
        onLike={onLike}
        onShare={onShare}
        onHidePost={onHidePost}
        homeScreen={homeScreen}
        onSavePost={onSavePost}
        owner={item?.user?.id == currentUser?.id}
        openPostComments={openPostComments}
        showHideOption={show3dots}
      />

      <OptionsModal
        visible={menuVisible}
        homeScreen={homeScreen}
        owner={item?.user?.id == currentUser?.id}
        onClose={() => setMenuVisible(false)}
        onShare={onShare}
        onEdit={onEditPost}
        onHide={() => {
          CustomAlert({
            title: "Hide this post?",
            message: "You won’t see this post in your feed anymore.",
            onConfirm: onHidePost,
          });
        }}
        onDelete={handleDeletePost}
        item={item}
      />
    </View>
  );
};

export default PostCard;
