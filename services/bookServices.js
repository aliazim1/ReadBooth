import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

//
// function to add a new book to the shelve including image, title, author, link
//
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
// function to fetch all the books with a limit of 9 posts first
//
export const fetchBooks = async (limit = 9, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("books")
        .select(`*`)
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.log("fetchBooks error: ", error);
        return { success: false, msg: "Could not fetch the books" };
      }
      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
        *,
        user: users (id, name, username, image ),
        `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetchBooks error: ", error);
        return { success: false, msg: "Could not fetch the books" };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetchBooks error: ", error);
    return { success: false, msg: "Could not fetch the books" };
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
export const createSavePost = async (saveBook) => {
  try {
    const { data, error } = await supabase
      .from("savedBooks")
      .insert(saveBook)
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
