import { supabase } from "../lib/supabase";

// function to create notification
export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("notification error: ", error);
      return { success: false, msg: "Something went wrong" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("notification error: ", error);
    return { success: false, msg: "Something went wrong" };
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
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchNotifications error: ", error);
    return { success: false, msg: "Could not fetch notification" };
  }
};

// function to remove notification
export const removeNotification = async (notificationId) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.log("removeNotification error: ", error);
      return { success: false, msg: "Could not remove the notification" };
    }
    return { success: true, data: { notificationId } };
  } catch (error) {
    console.log("removeNotification error: ", error);
    return { success: false, msg: "Could not remove the notification" };
  }
};
