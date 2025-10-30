import { Image } from "expo-image";
import { View } from "react-native";

import { getSupabaseFileUrl } from "../services/imageService";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppPressableIoniconIcon from "./AppPressableIoniconIcon";
import AppText from "./AppText";

const BookSerachListItem = ({ item, style }) => {
  const { styles } = useComponentsStyles();

  return (
    <View style={[styles.bookContainer, style]}>
      <Image source={getSupabaseFileUrl(item?.file)} style={styles.image} />
      <View style={styles.bookNameContainer}>
        <AppText style={styles.bookName}>{item?.title}</AppText>
        <AppText>Author: {item?.author}</AppText>

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
    </View>
  );
};

export default BookSerachListItem;
