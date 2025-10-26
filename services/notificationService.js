import { supabase } from "../lib/supabase";

// helper Function: to create & send notifications (flexible for like, comment, follow)
export const sendNotification = async (
  senderId,
  receiverId,
  type,
  message,
  postId = null,
  commentId = null
) => {
  if (senderId === receiverId) return; // don't notify myself
  try {
    const notification = {
      senderId: senderId,
      receiverId: receiverId,
      type: type,
      message: message,
      postId: postId,
      commentId: commentId,
    };
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("Notification error: ", error);
      return {
        success: false,
        msg: "Something went wrong while creating notification",
      };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Notification error: ", error);
    return {
      success: false,
      msg: "Something went wrong while creating notification",
    };
  }
};

// function to fetch notifications
export const fetchNotifications = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        sender: senderId(id, name, username, image)
        `
      )
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("fetchNotifications error: ", error);
      return { success: false, msg: "Could not fetch notification" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("fetchNotifications error: ", error);
    return { success: false, msg: error.message };
  }
};

//
//  mark a single notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log("markNotificationRead error:", error.message);
    return { success: false };
  }
};

//
// mark all notifications as read
export const markAllNotificationsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("receiverId", userId)
      .eq("isRead", false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log("markAllNotificationsRead error:", error.message);
    return { success: false };
  }
};

// function to remove notification
export const removeNotification = async ({
  notificationId,
  senderId,
  receiverId,
  postId,
  type, // "like", "comment", "follow"
}) => {
  try {
    const query = supabase.from("notifications").delete();

    if (notificationId) query.eq("id", notificationId);
    if (senderId) query.eq("senderId", senderId);
    if (receiverId) query.eq("receiverId", receiverId);
    if (postId) query.eq("postId", postId);
    if (type) query.eq("type", type);

    const { error } = await query;

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.log("removeNotification error:", error.message);
    return { success: false, msg: "Could not remove the notification" };
  }
};
