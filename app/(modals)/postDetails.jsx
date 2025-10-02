import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppIoniconTouchable from "../../components/AppIoniconTouchable";
import AppText from "../../components/AppText";
import CommentItem from "../../components/CommentItem";
import CustomInput from "../../components/CustomInput";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import {
  createComment,
  fetchPostDetails,
  removePostComment,
} from "../../services/postService";
import { getUserData } from "../../services/userService";

const PostDetails = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const { postId } = useLocalSearchParams();
  const [comment, setComment] = useState("");
  const [startLoading, setStartLoading] = useState(true);
  const [loadingSend, setLoadingSend] = useState(false);

  const handleNewComment = async (payload) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.user);

      newComment.user = res.success ? res.data : {};
      setPost((prevPost) => {
        // avoid duplicates
        const exists = prevPost.comments.some((c) => c.id === newComment.id);
        if (exists) return prevPost;
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    // setup supabase subscription once
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();
    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [navigation]);

  // function to get the post's details
  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  // function to add a new comment
  const onNewComment = async () => {
    if (comment.trim() === "") return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: comment,
    };

    setLoadingSend(true); // create the comment
    let res = await createComment(data);
    setLoadingSend(false);
    setComment("");

    if (res.success) {
      let userRes = await getUserData(res.data.userId);
      let newComment = {
        ...res.data,
        user: userRes.success ? userRes.data : {},
      };

      setPost((prevPost) => {
        const exists = prevPost.comments.some((c) => c.id === newComment.id);
        if (exists) return prevPost;
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  // function to delet the comment (by ownership)
  const onDeleteComment = async (comment) => {
    let res = await removePostComment(comment?.id);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  // used for header + icons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: post?.user?.name
        ? `${post.user.name}'s post`
        : "Post details",
      headerRight: () => (
        <AppIoniconTouchable
          style={{ marginLeft: 3.5 }}
          name="close"
          onPress={() => router.back()}
        />
      ),
    });
  }, [navigation, router, post]);

  if (startLoading) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.notFound}>
        <Text>Post not found.</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <PostCard
              item={{ ...post, comments: [{ count: post.comments.length }] }}
              currentUser={user}
              router={router}
              homeScreen={false}
            />

            {/* comments & text-input to add comment */}
            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Type a comment..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={5}
              />
              {loadingSend ? (
                <View style={styles.sendBtn}>
                  <Loading color={theme.colors.white} />
                </View>
              ) : (
                <AppIoniconTouchable
                  name="navigate"
                  size={20}
                  color={theme.colors.white}
                  style={[{ marginLeft: 0 }, styles.sendBtn]}
                  onPress={onNewComment}
                />
              )}
            </View>

            {/* all the comments */}
            <View style={styles.commentsListContainer}>
              {post?.comments?.length == 0 && (
                <AppText style={{ fontSize: hp(1.4), marginLeft: 5 }}>
                  Be the first to comment!
                </AppText>
              )}
              {post?.comments?.map((comment) => (
                <CommentItem
                  key={comment?.id?.toString()}
                  item={comment}
                  canDelete={
                    user.id == comment.userId || user.id == post.userId
                  }
                  onDelete={() => onDeleteComment(comment)}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: "#fff",
  },

  input: {
    width: "100%",
    borderWidth: 0,
    lineHeight: 20,
    maxHeight: 5 * 20,
    paddingVertical: 8,
    marginVertical: hp(2),
    textAlignVertical: "top",
  },
  sendBtn: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.primary,
  },
  commentsListContainer: {
    gap: 17,
    marginVertical: 16,
    paddingHorizontal: wp(4),
  },
});
export default PostDetails;
