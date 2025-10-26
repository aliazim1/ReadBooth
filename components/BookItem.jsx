import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import moment from "moment";
import { useState } from "react";
import { Alert, Pressable, Share, View } from "react-native";

import { stripHtmlTags } from "../lib/common";
import { createSaveBook, removeSaveBook } from "../services/bookServices";
import { getSupabaseFileUrl } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";
import BookOptionsModal from "./BookOptionsModal";

const BookItem = ({
  item,
  currentUser,
  saves, // array of saved book IDs
  setSaves,
  onDeleteBook,
  router,
  style,
}) => {
  const { styles, activeColors } = useComponentsStyles();
  const [menuVisible, setMenuVisible] = useState(false);

  // Check if this specific book is saved
  const saved = saves.includes(item?.id);

  // Toggle save/unsave book
  const onSaveBook = async () => {
    if (saved) {
      // Remove saved book
      const updatedSaves = saves.filter((id) => id !== item?.id);
      setSaves(updatedSaves);

      const res = await removeSaveBook(item?.id, currentUser?.id);
      if (!res.success) Alert.alert("Save Book", "Something went wrong.");
    } else {
      // Save new book
      setSaves([...saves, item?.id]);

      const data = { userId: currentUser?.id, bookId: item?.id };
      const res = await createSaveBook(data);
      if (!res.success) Alert.alert("Unsave", "Something went wrong.");
    }
  };

  // Navigate to EditBook page
  const onEditBook = () => {
    setMenuVisible(false);
    router.push({ pathname: "editBook", params: { ...item } });
  };

  // Share book info
  const onShare = async () => {
    const content = { message: stripHtmlTags(item?.title) };
    await Share.share(content);
  };

  // Format created date
  const date = moment(item?.created_at);
  const createdAt = date.isSame(moment(), "day")
    ? date.format("h:mm A")
    : date.format("MM/DD/YYYY h:mm A");

  return (
    <View style={[styles.bookContainer, style]}>
      <Image source={getSupabaseFileUrl(item?.file)} style={styles.image} />
      <View style={styles.bookNameContainer}>
        <AppText style={styles.bookName}>{item?.title}</AppText>
        <AppText>Author: {item?.author}</AppText>
        <AppText>{createdAt}</AppText>

        <View style={styles.bottomRow}>
          <View style={styles.linkContainer}>
            {item?.link && (
              <>
                <AppText style={styles.linkText}>Link to book:</AppText>
                <AppPressableIoniconIcon name="link" size={14} width={20} />
              </>
            )}
          </View>
        </View>
      </View>

      {/* Menu button */}
      <Pressable
        onPress={() => setMenuVisible(true)}
        style={styles.bookDeleteIcon}
      >
        <Ionicons
          size={16}
          strokeWidth={3}
          color={activeColors.text}
          name="ellipsis-horizontal"
        />
      </Pressable>
      <BookOptionsModal
        item={item}
        visible={menuVisible}
        onEdit={onEditBook}
        onShare={onShare}
        onDelete={onDeleteBook}
        onSave={onSaveBook}
        saved={saved}
        onClose={() => setMenuVisible(false)}
        owner={item?.userId === currentUser?.id}
      />
    </View>
  );
};

export default BookItem;
