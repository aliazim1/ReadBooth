import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { sendNotification } from "./notificationService";
import { getUserData } from "./userService";

//
// function to add a new comment to the post
export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("comment error: ", error);
      return { success: false, msg: "Could not create the comment" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("comment error: ", error);
    return { success: false, msg: "Could not create the comment" };
  }
};

//
// function to remove the comment from comments table and also it will
// remove its notification from notifications table, no need to do it manually
export const removePostComment = async (commentId, setPost) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove the comment" };
    }

    setPost((prevPost) => {
      let updatedPost = { ...prevPost };
      updatedPost.comments = updatedPost.comments.filter(
        (c) => c.id != commentId
      );
      return updatedPost;
    });

    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

//
// Add new comment
export const addNewCommentService = async ({
  user,
  post,
  comment,
  setPost,
  setComment,
  setLoadingSend,
}) => {
  if (comment.trim() === "") return null;

  const commentData = {
    userId: user?.id,
    postId: post?.id,
    text: comment,
  };

  try {
    setLoadingSend(true);
    let res = await createComment(commentData);
    setLoadingSend(false);
    setComment("");

    if (!res.success) {
      Alert.alert("Comment", res.msg);
      return;
    }

    // send notification
    sendNotification(
      user.id, // sender id
      post.userId, // receiver id
      "comment", // type
      "commented on your post", // message
      post.id, // postId
      res?.data?.id // commentId
    );

    // fetch comment user data
    let userRes = await getUserData(res.data.userId);
    let newComment = {
      ...res.data,
      user: userRes.success ? userRes.data : {},
    };

    // update post state
    setPost((prevPost) => {
      if (prevPost.comments.some((c) => c.id === newComment.id))
        return prevPost;
      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      };
    });
  } catch (err) {
    console.log("addNewCommentService error:", err);
    setLoadingSend(false);
  }
};
