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

const Comments = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [startLoading, setStartLoading] = useState(true);
  const [loadingSend, setLoadingSend] = useState(false);
  const [comment, setComment] = useState("");

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

    // cleanup on unmount & remove subscription
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [navigation]);

  // function to get the post's details
  const getPostDetails = async () => {
    // fetch post details here
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

  // function to delet the comment (only for comment and post owner)
  const onDelete = async (comment) => {
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

            {/* all comments list */}
            <View style={styles.commentsListContainer}>
              {post?.comments?.length == 0 ? (
                <AppText style={styles.beFirst}>
                  Be the first to comment!
                </AppText>
              ) : (
                <View style={styles.commentCountContainer}>
                  <AppText style={styles.commentCount}>Comments</AppText>
                  <AppText
                    style={{
                      fontSize: hp(1.4),
                    }}
                  >
                    {post?.comments?.length}
                  </AppText>
                </View>
              )}
              {post?.comments?.map((comment) => (
                <CommentItem
                  key={comment?.id?.toString()}
                  item={comment}
                  canDelete={
                    user.id == comment.userId || user.id == post.userId
                  }
                  onDelete={() => onDelete(comment)}
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
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: "#fff",
  },

  input: {
    maxHeight: 5 * 20,
    lineHeight: 20,
    paddingVertical: 8,
    textAlignVertical: "top",
    width: "100%",
    borderWidth: 0,
    marginVertical: hp(2),
  },
  sendBtn: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.primary,
  },
  commentsListContainer: {
    paddingHorizontal: wp(4),
    marginVertical: 16,
    gap: 17,
  },
  commentCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  beFirst: {
    fontSize: hp(1.4),
  },
  commentCount: {
    fontSize: hp(1.4),
    marginRight: 5,
    fontWeight: theme.fonts.bold,
  },
});
export default Comments;
