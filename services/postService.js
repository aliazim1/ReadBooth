import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";
import { deleteNotification, sendNotification } from "./notificationService";
import { getUserData } from "./userService";

//
// function to create a new post including image & caption
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
export const updatePost = async ({ id, body }) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .update({ body })
      .eq("id", Number(id)) // ensure it's a number if your DB column is int
      .select()
      .maybeSingle(); // use maybeSingle to avoid crash if no rows

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
export const fetchPosts = async (limit = 9, currentUserId) => {
  try {
    // 1️⃣ Get all users the current user is following
    const { data: following, error: followingError } = await supabase
      .from("follows") // your follows table
      .select("followingId")
      .eq("followerId", currentUserId);

    if (followingError) throw followingError;

    const followingIds = following?.map((f) => f.followingId) || [];

    // Include the user's own posts too
    followingIds.push(currentUserId);

    // 2️⃣ Get all hidden posts for this user
    const { data: hidden, error: hiddenError } = await supabase
      .from("hiddenPosts")
      .select("postId")
      .eq("userId", currentUserId);

    if (hiddenError) throw hiddenError;

    const hiddenIds = hidden?.map((h) => h.postId) || [];

    // 3️⃣ Fetch posts only from followed users, excluding hidden posts
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
      .in("userId", followingIds.length ? followingIds : [null]) // prevent empty array error
      .not("id", "in", `(${hiddenIds.join(",") || 0})`) // exclude hidden posts
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.log("fetchPosts error:", error.message);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

export const fetchPostsByUserId = async (limit = 9, userId) => {
  try {
    if (!userId) return null;
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
  } catch (error) {
    console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};

//
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

//
// function to hide the post
export const hidePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("hiddenPosts")
      .insert([{ userId, postId }]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.log("Error hiding post:", error.message);
    return { success: false, message: error.message };
  }
};

//
// function to unhide the post
export const unhidePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("hiddenPosts")
      .delete()
      .eq("postId", postId)
      .eq("userId", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.log("Error unhiding post:", error.message);
    return { success: false, message: error.message };
  }
};
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
    const { error: notifError } = await deleteNotification({
      senderId: userId,
      postId: postId,
      type: "like",
    });

    if (notifError) {
      console.log("remove like notification error:", notifError);
    }
    return { success: true };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};

//
// Add new comment
export const addNewComment = async ({
  user,
  post,
  comment,
  setPost,
  setComment,
  setLoadingSend,
}) => {
  if (!comment.trim()) return null;

  const commentData = {
    userId: user.id,
    postId: post.id,
    text: comment,
  };

  try {
    setLoadingSend(true);
    const { data, error } = await supabase
      .from("comments")
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;
    setComment("");
    setLoadingSend(false);

    // send notification only if commenting on someone else’s post
    if (post.userId !== user.id) {
      await sendNotification(
        user.id, // senderId
        post.userId, // receiverId
        "comment", // type
        "commented on your post", // message
        post.id, // postId
        data.id // commentId
      );
    }

    // fetch comment user data
    const userRes = await getUserData(data.userId);
    const newComment = {
      ...data,
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

    return { success: true, data };
  } catch (error) {
    console.log("addNewComment error:", error.message);
    setLoadingSend(false);
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
      return { success: false, msg: "Could save the post." };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("savePost error: ", error);
    return { success: false, msg: "Could save the post." };
  }
};

//
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

//
// function to fetch all the posts with a limit of 10 posts first
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
