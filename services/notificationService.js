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
export const fetchNotifications = async (receiverId, setNotifications) => {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
         id,
          created_at,
          message,
          type,
          isRead,
          type,
          message,
          postId,
          commentId,
          sender:senderId ( id, name, username, image )
        `
    )
    .eq("receiverId", receiverId)
    .order("created_at", { ascending: false });

  if (!error) setNotifications(data);
  else console.log("fetchNotifications error:", error);
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
export const deleteNotification = async ({
  notificationId,
  senderId,
  receiverId,
  postId,
  type,
}) => {
  try {
    // step 1: Build query for matching notifications
    let query = supabase.from("notifications").select("id");

    if (notificationId) query = query.eq("id", notificationId);
    if (senderId) query = query.eq("senderId", senderId);
    if (receiverId) query = query.eq("receiverId", receiverId);
    if (postId) query = query.eq("postId", postId);
    if (type) query = query.eq("type", type);

    const { data, error: selectError } = await query;

    // if query failed, throw it
    if (selectError) throw selectError;

    // step 2: If nothing found, return success silently
    if (!data || data.length === 0) {
      return { success: true, msg: "No notification to delete" };
    }

    // step 3: Delete found notification(s)
    const { error: deleteError } = await supabase
      .from("notifications")
      .delete()
      .in(
        "id",
        data.map((n) => n.id)
      );

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.log("removeNotification error:", error.message);
    return { success: false, msg: "Could not remove the notification" };
  }
};

export const clearAllNotifications = async (userId) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("receiverId", userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log("clearAllNotifications error:", error.message);
    return { success: false };
  }
};
