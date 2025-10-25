import { supabase } from "../lib/supabase";
import { removeNotification, sendNotification } from "./notificationService";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Got Error: ", error);
    return { success: false, msg: error.message };
  }
};

export const updateUserData = async (userId, data) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Got Error: ", error);
    return { success: false, msg: error.message };
  }
};

//
// function to follow/unfollow a user
export const toggleFollow = async (followerId, followingId, isFollowing) => {
  try {
    if (isFollowing) {
      // unfollow user (delete the existing record)
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("followerId", followerId)
        .eq("followingId", followingId);
      if (error) throw error;

      const { error: notifError } = await removeNotification({
        senderId: followerId,
        receiverId: followingId,
        type: "follow",
      });

      if (notifError) {
        console.log("removeFollowNotification error:", notifError);
      }
      return { success: true, following: false };
    } else {
      const { error } = await supabase
        .from("follows")
        .insert([{ followerId, followingId }]);
      if (error) throw error;

      sendNotification(
        followerId, // sender id
        followingId, // receiver id
        "follow", // type
        "started following you" // message
      );
      return { success: true, following: true };
    }
  } catch (error) {
    console.log("Error toggling follow:", error.message);
    return { success: false, msg: error.message };
  }
};

export const getFollows = async (userId, type) => {
  try {
    let query = supabase.from("follows").select(`
      id,
      created_at,
      followerId,
      followingId,
      follower:followerId ( id, name, username, image ),
      following:followingId ( id, name, username, image )
    `);

    if (type === "followers") {
      // who follows this user
      query = query.eq("followingId", userId);
    } else if (type === "following") {
      // who this user follows
      query = query.eq("followerId", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    console.log("Error fetching follows:", err.message);
    return { success: false, msg: err.message };
  }
};
