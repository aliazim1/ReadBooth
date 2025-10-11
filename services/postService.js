import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

//
// function to create a new post including image & caption
//
export const createPost = async (post) => {
  try {
    // if there’s a file, upload it first
    if (post.file && typeof post.file === "object") {
      let folderName = "postImages";
      let fileResult = await uploadFile(folderName, post?.file?.uri);

      if (fileResult.success) {
        post.file = fileResult.data; // replace with uploaded file path
      } else {
        return fileResult; // return error if upload failed
      }
    } else {
      // if no file, make sure it's explicitly null so DB stays clean
      post.file = null;
    }

    // always upsert, whether caption only or with file
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("Create Post: ", error);
      return { success: false, msg: "Could not create your post" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Create Post: ", error);
    return { success: false, msg: "Could not create your post" };
  }
};

//
// function to edit the post
//
export const updatePost = async ({ id, body }) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update({ body })
      .eq("id", Number(id)) // 👈 ensure it's a number if your DB column is int
      .select()
      .maybeSingle(); // 👈 use maybeSingle to avoid crash if no rows

    if (error) {
      console.log("updatePost: ", error);
      return { success: false, msg: "Could not update the post" };
    }

    if (!data) {
      return { success: false, msg: "No post found with that id" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("updatePost: ", error);
    return { success: false, msg: "Could not update the post" };
  }
};

//
// function to delete the post
//
export const deletePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("deletePost error: ", error);
      return { success: false, msg: "Could not delete the post" };
    }
    return { success: true, data: { postId } };
  } catch (error) {
    console.log("deletePost error: ", error);
    return { success: false, msg: "Could not delete the post" };
  }
};

//
// function to fetch all the posts with a limit of 10 posts first
//
export const fetchPosts = async (limit = 9, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
        user: users (id, name, username, image ),
        postLikes(*),
        savedPosts(*),
        comments(count)
        `
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the posts" };
      }
      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
        user: users (id, name, username, image ),
        postLikes(*),
        savedPosts(*),
        comments(count)
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the posts" };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

//
// function to fetch the posts details
//
export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user: users (id, name, username, image ),
        postLikes(*),
        savedPosts(*),
        comments(*, user: users(id, name, username, image))
        `
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, referencedTable: "comments" })
      .single();

    if (error) {
      console.log("fetchPostDetails error: ", error);
      return { success: false, msg: "Could not fetch the post's details" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetchPostDetails error: ", error);
    return { success: false, msg: "Could not fetch the post's details" };
  }
};
