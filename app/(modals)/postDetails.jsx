import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AddComment from "../../components/AddComment";
import AppIoniconTouchable from "../../components/AppIoniconTouchable";
import AppText from "../../components/AppText";
import CommentItem from "../../components/CommentItem";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  addNewComment,
  fetchPostDetails,
  removePostComment,
} from "../../services/postService";
import { getUserData } from "../../services/userService";
import { useScreensStyles } from "../../styles/screensStyles";

const PostDetails = () => {
  const { styles } = useScreensStyles();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const { postId, commentId } = useLocalSearchParams();
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

  const onNewComment = async () => {
    await addNewComment({
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
      headerTitle: post?.user?.name
        ? `${post.user.name}'s post`
        : "Post details",
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
      <View style={styles.startLoadingContainer}>
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
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <PostCard
              item={{ ...post, comments: [{ count: post.comments.length }] }}
              currentUser={user}
              router={router}
              homeScreen={false}
            />

            {/*  text-input & btn to add comment */}
            <AddComment
              comment={comment}
              setComment={setComment}
              loadingSend={loadingSend}
              onNewComment={onNewComment}
            />

            {/* all the comments */}
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
                  key={comment?.id?.toString()}
                  item={comment}
                  highlight={comment.id == commentId}
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

export default PostDetails;
