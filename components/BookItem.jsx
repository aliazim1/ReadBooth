import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { getSupabaseFileUrl } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";

const BookItem = ({ item, currentUser, onDeleteBook }) => {
  const { styles, activeColors } = useComponentsStyles();
  return (
    <View style={styles.bookContainer}>
      <Image source={getSupabaseFileUrl(item?.file)} style={styles.image} />

      <View style={styles.bookNameContainer}>
        <AppText style={styles.bookName}>{item?.title}</AppText>
        <AppText>By: {item?.author}</AppText>
        <View style={styles.bottomRow}>
          <View style={styles.linkContainer}>
            {item?.link1 && (
              <AppText style={styles.linkText}>Link to book:</AppText>
            )}
            {item?.link1 && (
              <AppPressableIoniconIcon name={"link"} size={14} width={20} />
            )}
          </View>
        </View>
      </View>
      <Pressable onPress={onDeleteBook} style={styles.bookDeleteIcon}>
        <Ionicons
          name={"ellipsis-horizontal"}
          size={16}
          color={activeColors.white}
        />
      </Pressable>
    </View>
  );
};

export default BookItem;
