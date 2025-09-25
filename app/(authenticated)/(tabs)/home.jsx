import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import PostCard from "../../../components/PostCard";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { fetchPosts } from "../../../services/postService";

// global variable for the number of posts (limit)
var limit = 0;

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setAuth } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    limit = limit + 3;

    // call the API here
    let res = await fetchPosts(limit);
    if (res.success) {
      setPosts(res.data);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppIoniconTouchable
            name="search"
            size={22}
            style={{ marginRight: 30 }}
            // onPress={() => router.push("/")}
          />
          <AppIoniconTouchable
            name="add"
            size={28}
            onPress={() => router.push("/createPost")}
          />
        </View>
      ),
    });
  }, [navigation, router]);

  return (
    <SafeScreen>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 2,
              backgroundColor: "#e0e0e0",
              marginVertical: 10,
            }}
          />
        )}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
  },
});

export default Home;
