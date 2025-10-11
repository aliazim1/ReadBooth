import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddComment from "../../components/AddComment";
import AppIoniconTouchable from "../../components/AppIoniconTouchable";
import AppText from "../../components/AppText";
import CommentItem from "../../components/CommentItem";
import Loading from "../../components/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  addNewCommentService,
  removePostComment,
} from "../../services/commentService";
import { fetchPostDetails } from "../../services/postService";
import { getUserData } from "../../services/userService";
import { modalsStyles } from "../../styles/modalsStyles";

const Comments = () => {
  const { styles, activeColors } = modalsStyles();
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

  const onNewComment = async () => {
    await addNewCommentService({
      user,
      post,
      comment,
      setPost,
      setComment,
      setLoadingSend,
    });
  };

  // used for header + icons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AppIoniconTouchable
          style={{ marginLeft: 3.5 }}
          name="chevron-down"
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
    <View style={styles.container}>
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
            {/*  text-input & btn to add comment */}
            <AddComment
              comment={comment}
              setComment={setComment}
              loadingSend={loadingSend}
              onNewComment={onNewComment}
            />

            {/* all comments list */}
            <View style={styles.commentsListContainer}>
              {post?.comments?.length == 0 ? (
                <AppText style={styles.beFirst}>
                  Be the first to comment!
                </AppText>
              ) : (
                <View style={styles.commentCountContainer}>
                  <AppText style={styles.commentCountLabel}>Comments</AppText>
                  <AppText style={styles.commentCount}>
                    {post?.comments?.length}
                  </AppText>
                </View>
              )}
              {post?.comments?.map((comment) => (
                <CommentItem
                  item={comment}
                  key={comment?.id?.toString()}
                  canDelete={
                    user.id == comment.userId || user.id == post.userId
                  }
                  onDelete={() => removePostComment(comment?.id, setPost)}
                />
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Comments;
