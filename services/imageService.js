import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { supabaseUrl } from "../constants";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return { uri: getSupabaseFileUrl(imagePath) };
  } else {
    return require("../assets/images/user.png");
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
  }
  return null;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);

    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to Uint8Array
    const fileBytes = new Uint8Array(decode(fileBase64));

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, fileBytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/png" : "video/mp4",
      });

    if (error) {
      console.log("file upload error: ", error);
      return { success: false, msg: "Could not upload media." };
    }

    return { success: true, data: data.path };
  } catch (error) {
    console.log("file upload error: ", error);
    return { success: false, msg: "Could not upload media." };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
