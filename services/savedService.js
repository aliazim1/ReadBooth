import { supabase } from "../lib/supabase";

//
// function to save the post
//
export const createSavePost = async (savePost) => {
  try {
    const { data, error } = await supabase
      .from("savedPosts")
      .insert(savePost)
      .select()
      .single();

    if (error) {
      console.log("savePost error: ", error);
      return { success: false, msg: "Could save the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("savePost error: ", error);
    return { success: false, msg: "Could save the post" };
  }
};

//
// function to unsave the post
//
export const removeSavePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("savedPosts")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("unsavePost error: ", error);
      return { success: false, msg: "Could not unsave the post" };
    }
    return { success: true };
  } catch (error) {
    console.log("unsavePost error: ", error);
    return { success: false, msg: "Could not unsave the post" };
  }
};

//
// function to fetch all the posts with a limit of 10 posts first
//
export const fetchSavedPosts = async (limit = 9, userId) => {
  try {
    const query = supabase
      .from("savedPosts")
      .select(
        `
        id,
        created_at,
        post: posts (
          id,
          body,
          file,
          created_at,
          user: users (id, name, username, image),
          postLikes (*),
          savedPosts (*),
          comments (count)
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (userId) query.eq("userId", userId);

    const { data, error } = await query;

    if (error) {
      console.log("fetchSavedPosts error:", error);
      return { success: false, msg: "Could not fetch saved posts" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetchSavedPosts error:", error);
    return { success: false, msg: "Could not fetch saved posts" };
  }
};
