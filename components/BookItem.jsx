import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { wp } from "../helpers/common";
import { getSupabaseFileUrl } from "../services/imageService";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";

const BookItem = ({ item, currentUser, onDeleteBook }) => {
  return (
    <View style={styles.container}>
      <Image source={getSupabaseFileUrl(item?.file)} style={styles.image} />

      <View style={styles.bookNameContainer}>
        <AppText style={styles.bookName}>{item?.title}</AppText>
        <AppText>By: {item?.author}</AppText>
        <View style={styles.bottomRow}>
          <View style={styles.linkContainer}>
            <AppText style={styles.link}>Links:</AppText>
            {/* )} */}
            {item?.link1 && (
              <AppPressableIoniconIcon
                name={"logo-amazon"}
                size={14}
                width={20}
              />
            )}
          </View>
          <Pressable onPress={onDeleteBook} style={styles.deleteIcon}>
            <Ionicons name={"trash"} size={10} color={theme.colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    borderWidth: 0.5,
    borderRadius: 12,
    paddingVertical: 12,
    borderColor: theme.colors.mediumGrey,
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
  image: {
    width: wp(20),
    aspectRatio: 1,
    borderRadius: 8,
  },
  bookNameContainer: {
    gap: 5,
    width: wp(65),
  },
  bookName: {
    fontWeight: theme.fonts.bold,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkContainer: {
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  link: {
    fontWeight: theme.fonts.semibold,
  },
  deleteIcon: {
    padding: 4,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: theme.colors.danger,
  },
});

export default BookItem;
