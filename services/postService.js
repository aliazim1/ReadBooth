import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

// function to create a new post including (image/video, caption )
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

// function to edit the post
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

// function to fetch all the posts with a limit of 10 posts first
export const fetchPosts = async (limit = 10, userId) => {
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

// function to add a new like to the post
export const createPostLike = async (postLike) => {
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
    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

// function to remove the like from post
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
    return { success: true };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};

// function to save the post
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

// function to unsave the post
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

// function to fetch the posts details
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

// function to remove the comment from post
export const removePostComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove the comment" };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

// function to delete the post
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
