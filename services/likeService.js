import { supabase } from "../lib/supabase";
import { sendNotification } from "./notificationService";

//
// function to like the post and create a notification
// in notifications table for it
export const createPostLike = async (postLike, post, currentUser) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the post" };
    }

    // send notification
    sendNotification(
      currentUser.id, // sender id
      post?.user?.id, // receiver id
      "like", // type
      "liked your post", // message
      post?.id // postId
    );
    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

//
// function to remove the like from post, the like from postLikes
//  table & its notification from notification table
export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not remove the post like" };
    }

    // also remove the "like's" notification
    const { error: notifError } = await supabase
      .from("notifications")
      .delete()
      .eq("postId", postId)
      .eq("senderId", userId)
      .eq("type", "like");

    if (notifError) {
      console.log("remove like notification error:", notifError);
    }
    return { success: true };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};
