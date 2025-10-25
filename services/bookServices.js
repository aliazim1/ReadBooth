import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

//
// function to add a new book to the shelve including image, title, author, link
export const addBook = async (book) => {
  try {
    // if there’s a file, upload it first
    if (book.file && typeof book.file === "object") {
      let folderName = "postImages";
      let fileResult = await uploadFile(folderName, book?.file?.uri);

      if (fileResult.success) {
        book.file = fileResult.data; // replace with uploaded file path
      } else {
        return fileResult; // return error if upload failed
      }
    } else {
      // if no file, make sure it's explicitly null so DB stays clean
      book.file = null;
    }

    // always upsert, whether caption only or with file
    const { data, error } = await supabase
      .from("books")
      .upsert(book)
      .select()
      .single();

    if (error) {
      console.log("Add Book: ", error);
      return { success: false, msg: "Could not add your book" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Add Book: ", error);
    return { success: false, msg: "Could not add your book" };
  }
};

//
// function to fetch all the books based on active tab
export const fetchBooks = async (filterType, userId, limit = 9) => {
  try {
    let data, error;

    if (filterType === "all") {
      // Fetch all general books (not owned by the user)
      ({ data, error } = await supabase
        .from("books")
        .select("*")
        .neq("userId", userId)
        .order("created_at", { ascending: false }));
    } else if (filterType === "myBook") {
      // Fetch only books created by the user
      ({ data, error } = await supabase
        .from("books")
        .select("*")
        .eq("userId", userId)
        .order("created_at", { ascending: false })
        .limit(limit));
    } else if (filterType === "savedBook") {
      // Fetch saved book IDs first
      const { data: saved, error: savedErr } = await supabase
        .from("savedBooks")
        .select("bookId")
        .eq("userId", userId)
        .limit(limit);

      if (savedErr) throw savedErr;

      const savedIds = saved.map((s) => s.bookId);
      if (savedIds.length === 0) return { success: true, data: [] };

      // Fetch the actual saved books
      ({ data, error } = await supabase
        .from("books")
        .select("*")
        .in("id", savedIds)
        .order("created_at", { ascending: false })
        .limit(limit));
    }

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("fetchBooks error:", error.message);
    return { success: false, msg: error.message };
  }
};

//
// function to edit the post
export const editBook = async ({ id, title, author, link }) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .update({ title, author, link })
      .eq("id", Number(id)) // ensure it's a number if DB column is int
      .select()
      .maybeSingle(); // use maybeSingle to avoid crash if no rows

    if (error) {
      console.log("editBook: ", error);
      return { success: false, msg: "Could not edit the book details" };
    }

    if (!data) {
      return { success: false, msg: "No book found with this id" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("editBook: ", error);
    return { success: false, msg: "Could not edit the book details" };
  }
};

//
// function to delete the book
export const deleteBook = async (bookId) => {
  try {
    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) {
      console.log("deleteBook error: ", error);
      return { success: false, msg: "Could not delete the book." };
    }
    return { success: true, data: { bookId } };
  } catch (error) {
    console.log("deleteBook error: ", error);
    return { success: false, msg: "Could not delete the book." };
  }
};

//
// function to save the post
export const createSaveBook = async (data) => {
  try {
    const { error } = await supabase
      .from("savedBooks")
      .insert([
        {
          userId: data.userId,
          bookId: data.bookId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("saveBook error: ", error);
      return { success: false, msg: "Could save the book." };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("saveBook error: ", error);
    return { success: false, msg: "Could save the book." };
  }
};

//
// gets all the saved books for the user (by userId)
export const getSavedBookIdsForUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("savedBooks")
      .select("bookId")
      .eq("userId", userId);

    if (error) throw error;

    // return just an array of bookIds
    return { success: true, data: data.map((b) => b.bookId) };
  } catch (error) {
    console.log("getSavedBookIdsForUser error:", error.message);
    return { success: false, msg: error.message };
  }
};

//
// function to unsave the book
export const removeSaveBook = async (bookId, userId) => {
  try {
    const { error } = await supabase
      .from("savedBooks")
      .delete()
      .eq("userId", userId)
      .eq("bookId", bookId);

    if (error) {
      console.log("unsaveBook error: ", error);
      return { success: false, msg: "Could not unsave the book." };
    }
    return { success: true };
  } catch (error) {
    console.log("unsaveBook error: ", error);
    return { success: false, msg: "Could not unsave the book." };
  }
};

//
// function to get the numbero of books I've listed
export const fetchBooksCount = async (userId) => {
  const { count, error } = await supabase
    .from("books")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId);

  if (error) {
    console.log("Error fetching book count:", error);
    return 0;
  }
  return count;
};
