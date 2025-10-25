import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";

import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import BookItem from "../../../components/BookItem";
import CustomAlert from "../../../components/CustomAlert";
import HeaderIcons from "../../../components/HeaderIcons";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import {
  deleteBook,
  fetchBooks,
  getSavedBookIdsForUser,
} from "../../../services/bookServices";
import { useTabsStyles } from "../../../styles/tabsStyles";
const Tab = createMaterialTopTabNavigator();

// global variable for the number of posts (limit)
var limit = 0;

// reusable BookList component for each tab
const BookList = ({ user, filterType, saves, setSaves }) => {
  const { styles, activeColors } = useTabsStyles();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);

  const getBooks = async () => {
    if (!hasMoreBooks) return;
    limit += 9;
    let res = await fetchBooks(filterType, user.id, limit);
    if (res.success) {
      setBooks(res.data);
      if (books.length === res.data.length) setHasMoreBooks(false);
    }
  };

  useEffect(() => {
    if (filterType === "savedBook") {
      getBooks();
    }
  }, [saves]);

  const onDeleteBook = async (item) => {
    const res = await deleteBook(item?.id);
    if (res.success) {
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== item.id));
      getBooks();
    } else {
      Alert.alert("Book", res.msg || "Failed to delete book");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBooks();
    }, [user?.id])
  );

  const filteredBooks =
    filterType === "savedBook"
      ? books.filter((b) => saves.includes(b.id))
      : books;

  return (
    <SafeScreen>
      {filteredBooks.length > 0 ? (
        <FlatList
          data={filteredBooks}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={(item) => item.id.toString()}
          extraData={saves}
          renderItem={({ item }) => (
            <BookItem
              item={item}
              saves={saves}
              router={router}
              currentUser={user}
              setSaves={setSaves}
              onDeleteBook={() => {
                CustomAlert({
                  title: "Delete Book",
                  message: "Are you sure you want to delete this book?",
                  onConfirm: () => onDeleteBook(item),
                });
              }}
            />
          )}
          onEndReached={getBooks}
          onEndReachedThreshold={0}
        />
      ) : (
        <View style={styles.noNofiticationsContainer}>
          <AppMaterialCommunityIcon
            name="bookshelf"
            color={activeColors.text}
          />
          <AppText>No books to display</AppText>
        </View>
      )}
    </SafeScreen>
  );
};

const Books = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const [saves, setSaves] = useState([]);
  const { activeColors, styles } = useTabsStyles();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <HeaderIcons size={24} icon2="search" />
          <Pressable onPress={() => router.push("/addBook")}>
            <AppMaterialCommunityIcon name="square-edit-outline" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, router]);

  useEffect(() => {
    const loadSavedBooks = async () => {
      const res = await getSavedBookIdsForUser(user.id);
      if (res.success) setSaves(res.data); // array of saved bookIds
    };

    loadSavedBooks();
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: activeColors.text,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarStyle: { backgroundColor: activeColors.background },
      }}
    >
      <Tab.Screen name="For You">
        {() => (
          <BookList
            user={user}
            filterType="all"
            saves={saves}
            setSaves={setSaves}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="My Books">
        {() => (
          <BookList
            user={user}
            filterType="myBook"
            saves={saves}
            setSaves={setSaves}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Saved">
        {() => (
          <BookList
            user={user}
            filterType="savedBook"
            saves={saves}
            setSaves={setSaves}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Books;
