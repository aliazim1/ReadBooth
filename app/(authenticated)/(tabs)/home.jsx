import { useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import Loading from "../../../components/Loading";
import PostCard from "../../../components/PostCard";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import { fetchPosts } from "../../../services/postService";
import { getUserData } from "../../../services/userService";

// global variable for the number of posts (limit)
var limit = 0;

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setAuth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // once user add a post, it updates the posts array
  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  // function: fetching the posts
  const getPosts = async () => {
    // if no more post, do not call the API
    if (!hasMorePosts) return null;

    // increase the number of posts to fetch
    limit = limit + 3;

    // call the API here
    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length == res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  // used for header + icons
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

  // displaying the posts using FlatList
  return (
    <SafeScreen>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} currentUser={user} router={router} />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.ItemSeparatorComponent} />
        )}
        onEndReached={() => {
          getPosts();
          console.log("got to the end");
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={
          <View style={styles.container}>
            {hasMorePosts ? (
              <Loading size="small" style={styles.loading} />
            ) : (
              <AppText style={styles.noMorePost}>No more posts</AppText>
            )}
            {/* ) : ( 
              <View style={styles.noPostContainer}>
                <Text>No posts yet.</Text>
              </View>
            )}*/}
          </View>
        }
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  ItemSeparatorComponent: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    marginVertical: 20,
  },
  noMorePost: {
    marginVertical: 20,
    fontSize: hp(1.3),
  },
});

export default Home;
