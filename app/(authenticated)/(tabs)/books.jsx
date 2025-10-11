import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";

import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import BookItem from "../../../components/BookItem";
import CustomAlert from "../../../components/CustomAlert";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { deleteBook, fetchBooks } from "../../../services/bookServices";
import { useTabsStyles } from "../../../styles/tabsStyles";

// global variable for the number of posts (limit)
var limit = 0;

const Books = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  // function: fetching the posts
  const getBooks = async () => {
    if (!hasMoreBooks) return null;
    limit += 9;
    let res = await fetchBooks(limit, user.id);
    if (res.success) {
      if (books.length === res.data.length) setHasMoreBooks(false);
      setBooks(res.data);
    }
  };

  // function to delete the book
  const onDeleteBook = async (item) => {
    const res = await deleteBook(item?.id);
    if (res.success) {
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== item.id));
      getBooks(); // Refresh quietly
    } else {
      Alert.alert("Book", res.msg || "Failed to delete book");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Book Shelf",
      headerRight: () => (
        <View style={styles.headerIconsContainer}>
          <Pressable onPress={() => {}}>
            <Feather name="search" size={24} color={activeColors.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/addBook")}>
            <AppMaterialCommunityIcon name="square-edit-outline" />
          </Pressable>
        </View>
      ),
    });

    // initial load for books
    getBooks();
  }, [navigation, router]);

  // refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      getBooks();
    }, [user?.id])
  );

  return (
    <SafeScreen>
      {books.length > 0 ? (
        <FlatList
          data={books}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookItem
              item={item}
              currentUser={user}
              onDeleteBook={() => {
                CustomAlert({
                  title: "Delete Book",
                  message: "Are you sure you want to delete this book?",
                  onConfirm: () => onDeleteBook(item),
                });
              }}
            />
          )}
          onEndReached={() => {
            getBooks();
          }}
          onEndReachedThreshold={0}
        />
      ) : (
        <View style={styles.noNofiticationsContainer}>
          <AppMaterialCommunityIcon
            name="bookshelf"
            color={activeColors.text}
          />
          <AppText>Your book shelf is empty</AppText>
        </View>
      )}
    </SafeScreen>
  );
};

export default Books;
