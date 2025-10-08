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
            <AppText style={styles.linkText}>Links:</AppText>
            {item?.link1 && (
              <AppPressableIoniconIcon
                name={"logo-amazon"}
                size={14}
                width={20}
              />
            )}
          </View>
          <Pressable onPress={onDeleteBook} style={styles.deleteIcon}>
            <Ionicons name={"trash"} size={10} color={activeColors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BookItem;
