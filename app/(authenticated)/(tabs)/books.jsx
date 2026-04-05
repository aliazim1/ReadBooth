import { Alert, FlatList, Pressable, View } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import {
  AppMaterialCommunityIcon,
  BookItem,
  CustomAlert,
  HeaderIcons,
  NotExist,
  SafeScreen,
} from "../../components";
import {
  deleteBook,
  fetchBooks,
  getSavedBookIdsForUser,
} from "../../../services/bookServices";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabsStyles } from "../../../styles/tabsStyles";

const Tab = createMaterialTopTabNavigator();

// global variable for the number of posts (limit)
var limit = 0;

// reusable BookList component for each tab
const BookList = ({ user, filterType, saves, setSaves }) => {
  const router = useRouter();
  const { styles } = useTabsStyles();
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
    if (!user?.id) return;
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
    }, [user?.id]),
  );

  const filteredBooks =
    filterType === "savedBook"
      ? books.filter((b) => saves.includes(b.id))
      : books;

  return (
    <SafeScreen>
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
        ListEmptyComponent={
          <NotExist iconName={"bookshelf"} message="No books to display" />
        }
      />
    </SafeScreen>
  );
};

const Books = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuth();
  const [saves, setSaves] = useState([]);
  const { activeColors, styles } = useTabsStyles();

  useEffect(() => {
    if (!user?.id) return; // prevent crash when user logs out
    const loadSavedBooks = async () => {
      const res = await getSavedBookIdsForUser(user.id);
      if (res.success) setSaves(res.data);
    };
    loadSavedBooks();
  }, [user?.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <HeaderIcons
            size={24}
            icon2="search"
            onPress2={() =>
              router.push({
                pathname: "/searchScreen",
                params: { searchingForBooks: true },
              })
            }
          />
          <Pressable onPress={() => router.push("/addBook")}>
            <AppMaterialCommunityIcon name="square-edit-outline" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, router]);

  // if user is null (logged out), don’t render anything
  if (!user) return null;

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
