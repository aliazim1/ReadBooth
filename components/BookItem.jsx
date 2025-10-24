import { Image } from "expo-image";
import { Alert, Pressable, Share, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { stripHtmlTags } from "../helpers/common";
import {
  checkIfBookSaved,
  createSaveBook,
  removeSaveBook,
} from "../services/bookServices";
import { getSupabaseFileUrl } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";
import BookOptionsModal from "./BookOptionsModal";

const BookItem = ({
  item,
  currentUser,
  saves,
  setSaves,
  onDeleteBook,
  router,
  style,
}) => {
  const { styles, activeColors } = useComponentsStyles();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchSavedState = async () => {
      const res = await checkIfBookSaved(currentUser?.id, item?.id);
      if (res.success && res.data.length > 0) {
        setSaves(res.data);
      }
    };

    fetchSavedState();
  }, [item?.id, currentUser?.id]);

  // toggle the save icon
  const saved = saves.some((save) => save.userId === currentUser?.id);

  // funtion for saving the post(s)
  const onSaveBook = async () => {
    if (saved) {
      // remove the book
      let updatedSaves = saves.filter((save) => save.userId != currentUser?.id);
      setSaves([...updatedSaves]);
      let res = await removeSaveBook(item?.id, currentUser?.id);
      if (!res.success) Alert.alert("Save Book", "Something went wrong.");
    } else {
      let data = {
        userId: currentUser?.id,
        bookId: item?.id,
      };

      setSaves([...saves, data]);
      let res = await createSaveBook(data);
      if (!res.success) Alert.alert("Unsave", "Something went wrong.");
    }
  };

  // function to navigate to the EditBook
  const onEditBook = () => {
    setMenuVisible(false);
    router.push({ pathname: "editBook", params: { ...item } });
  };

  // function to share the book
  // TODO: add the book link to share it
  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.title) }; // only shares the caption here
    Share.share(content);
  };

  const date = moment(item?.created_at);
  const createdAt = date.isSame(moment(), "day")
    ? date.format("h:mm A")
    : date.format("MM/DD/YYYY h:mm A");

  return (
    <View style={[styles.bookContainer, style]}>
      <Image source={getSupabaseFileUrl(item?.file)} style={styles.image} />
      <View style={styles.bookNameContainer}>
        <AppText style={styles.bookName}>{item?.title}</AppText>
        <AppText>By: {item?.author}</AppText>
        <AppText>{createdAt}</AppText>
        <View style={styles.bottomRow}>
          <View style={styles.linkContainer}>
            {item?.link && (
              <AppText style={styles.linkText}>Link to book:</AppText>
            )}
            {item?.link && (
              <AppPressableIoniconIcon name={"link"} size={14} width={20} />
            )}
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => setMenuVisible(true)}
        style={styles.bookDeleteIcon}
      >
        <Ionicons
          size={16}
          strokeWidth={3}
          color={activeColors.text}
          name={"ellipsis-horizontal"}
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
        owner={item?.userId == currentUser?.id}
      />
    </View>
  );
};

export default BookItem;
