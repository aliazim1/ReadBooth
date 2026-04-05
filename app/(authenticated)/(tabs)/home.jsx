import { useNavigation, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";

import {
  AppMaterialCommunityIcon,
  AppText,
  HeaderIcons,
  Loading,
  PostCard,
} from "../../components";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabsStyles } from "../../../styles/tabsStyles";
import { fetchPosts } from "../../../services/postService";
import { getUserData } from "../../../services/userService";

// global variable for the number of posts (limit)
var limit = 0;

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const { styles, activeColors } = useTabsStyles();
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // once user add a post, it updates the posts array
  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }

    if (payload.eventType == "DELETE" && payload.old.id) {
      setPosts((prev) => {
        let updatedPosts = prev.filter((post) => post.id != payload.old.id);
        return updatedPosts;
      });
    }

    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prev) => {
        let updatedPosts = prev.map((post) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return updatedPosts;
        });
      });
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    getPosts(); // fetch posts once on mount

    // refresh posts when the screen is focused
    const unsubscribeFocus = navigation.addListener("focus", () => {
      getPosts();
    });

    // setup supabase subscription once
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent,
      )
      .subscribe();

    // cleanup on unmount
    return () => {
      unsubscribeFocus(); // remove navigation focus listener
      supabase.removeChannel(postChannel); // remove subscription
    };
  }, [navigation]);

  // function: fetching the posts
  const getPosts = async () => {
    // if no more post, do not call the API
    if (!hasMorePosts) return null;
    // increase the number of posts to fetch
    limit = limit + 10;
    let res = await fetchPosts(limit, user?.id); // call the API here
    if (res.success) {
      if (posts.length == res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  // used for header + icons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <HeaderIcons
            size={24}
            icon2="search"
            onPress2={() => router.push("/searchScreen")}
          />
          <Pressable onPress={() => router.push("/createPost")}>
            <AppMaterialCommunityIcon name="square-edit-outline" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, router, activeColors]);

  return (
    <View style={styles.outerContainer}>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.homeContentContainerStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            currentUser={user}
            router={router}
            homeScreen={true}
            show3dots={true}
            setPosts={setPosts}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.ItemSeparatorComponent} />
        )}
        onEndReached={() => {
          getPosts();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={
          <View style={styles.loadingContainer}>
            {hasMorePosts ? (
              <Loading style={{ marginVertical: 20 }} />
            ) : (
              <AppText style={styles.noMorePost}>No more posts</AppText>
            )}
          </View>
        }
      />
    </View>
  );
};

export default Home;
