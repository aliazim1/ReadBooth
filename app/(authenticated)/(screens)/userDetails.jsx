import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";

import {
  Avatar,
  AppText,
  BookItem,
  HorizontalPadding,
  Loading,
  OptionsModal,
  PostGridItem,
  StatsItem,
  SafeScreen,
} from "../../../components";
import {
  fetchBooks,
  getSavedBookIdsForUser,
} from "../../../services/bookServices";
import {
  getFollows,
  getUserData,
  toggleFollow,
} from "../../../services/userService";
import { hp } from "../../../lib/common";
import { appTheme } from "../../../config/theme";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { useTabsStyles } from "../../../styles/tabsStyles";
import { fetchPostsByUserId } from "../../../services/postService";

// global variable for the number of posts (limit)
var limit = 0;

const UserDetails = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [startLoading, setStartLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [books, setBooks] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [saves, setSaves] = useState([]);

  // function to load followers/following count
  const loadFollowsCount = async () => {
    const { success: s1, data: f1 } = await getFollows(userId, "followers");
    if (s1) setFollowers(f1);

    const { success: s2, data: f2 } = await getFollows(userId, "following");
    if (s2) setFollowing(f2);
  };

  // fetch user info on mount & check if already following
  useEffect(() => {
    const checkFollowing = async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("followerId", user.id)
        .eq("followingId", userId)
        .single();

      if (!error && data) setIsFollowing(true);
    };
    if (user && userId) {
      checkFollowing();
      loadFollowsCount();
    }
    fetchUserInfo();
    getPosts();
    getBooks();
    getSavedBooks();
  }, [user, userId]);

  const getSavedBooks = async () => {
    if (!user?.id) return;
    const res = await getSavedBookIdsForUser(user.id);
    if (res.success) setSaves(res.data); // res.data = [bookId, bookId, ...]
  };

  // handle follow/unfollow
  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);
    const res = await toggleFollow(user.id, userId, isFollowing);
    if (res.success) setIsFollowing(res.following);

    setLoading(false);
  };

  // fetch the user details
  const fetchUserInfo = async () => {
    if (!userId) return;
    let res = await getUserData(userId);
    if (res.success) {
      setUserData(res.data);
    } else {
      console.log("Failed to fetch user data:", res.msg);
    }
    setStartLoading(false);
  };

  const getPosts = async () => {
    if (!hasMorePosts) return null;
    limit += 10;
    let res = await fetchPostsByUserId(limit, userId);
    if (res.success) {
      if (posts.length === res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  const getBooks = async () => {
    if (!hasMoreBooks) return;
    limit += 9;
    let res = await fetchBooks("myBook", userId, limit);
    if (res.success) {
      setBooks(res.data);
      if (books.length === res.data.length) setHasMoreBooks(false);
    }
  };

  // used for header + icons (only show if not own profile)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: userData?.name || "User Details",
      // headerRight: () =>
      //   userId !== user.id ? (
      //     <AppIoniconTouchable
      //       style={{ marginLeft: 7 }}
      //       size={20}
      //       name={"ellipsis-horizontal"}
      //       onPress={() => setMenuVisible(true)}
      //     />
      //   ) : null,
    });
    getPosts();
    getBooks();
    getSavedBooks();
    loadFollowsCount();
  }, [navigation, router, userData, posts, books]);

  // refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      getPosts();
      getBooks();
      getSavedBooks();
      loadFollowsCount();
    }, [userId]),
  );

  // Get correct content based on active tab
  const getCurrentData = () => {
    return activeTab == "posts" ? posts : books;
  };

  const currentData = getCurrentData();

  if (startLoading) {
    return (
      <View style={styles.startLoadingContainer}>
        <Loading />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.startLoadingContainer}>
        <Loading />
      </View>
    );
  }

  //  function to block the user
  const handleBlock = async () => {};

  return (
    <SafeScreen>
      <FlatList
        key={activeTab === "posts" ? "grid" : "list"}
        numColumns={activeTab === "posts" ? 3 : 1}
        data={currentData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 5 }}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.profileDetails}>
            <HorizontalPadding>
              <View style={styles.profileColumn}>
                <View style={styles.imgNameRow}>
                  <Pressable onPress={handleFollow}>
                    <Avatar uri={userData?.image} />
                    {user?.id != userId && (
                      <View style={styles.followBtnContainer}>
                        <Ionicons
                          name={isFollowing ? "checkmark-circle" : "add-circle"}
                          color={
                            isFollowing
                              ? activeColors.success
                              : activeColors.text
                          }
                          size={18}
                        />
                        <AppText style={styles.followLabel}>
                          {`${isFollowing ? "Following " : "Follow"}`}
                        </AppText>
                      </View>
                    )}
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontWeight: appTheme.fonts.extraBold }}>
                      {userData?.name}
                    </AppText>
                    {userData?.username && (
                      <AppText>@{userData?.username}</AppText>
                    )}
                    {userData?.address && (
                      <AppText>{userData?.address}</AppText>
                    )}
                  </View>
                </View>
              </View>

              {userData?.bio && (
                <AppText
                  style={[
                    styles.bio,
                    { marginTop: user?.id != userId ? 20 : 10 },
                  ]}
                >
                  {userData.bio}
                </AppText>
              )}
            </HorizontalPadding>

            <HorizontalPadding>
              <View style={styles.statRow}>
                <StatsItem
                  title="Followers"
                  value={followers.length}
                  onPress={() =>
                    router.push({
                      pathname: "/follows",
                      params: {
                        initialTab: "Followers",
                        userId: userId,
                        username: userData?.username,
                      },
                    })
                  }
                />
                <StatsItem
                  title="Following"
                  value={following.length}
                  onPress={() =>
                    router.push({
                      pathname: "/follows",
                      params: {
                        initialTab: "Following",
                        userId: userId,
                        username: userData?.username,
                      },
                    })
                  }
                />
                <StatsItem title="Posts" value={posts.length} />
                <StatsItem title="Books" value={books.length} />
              </View>
            </HorizontalPadding>

            {/* Tabs under stats */}
            <View style={styles.tabsContainer}>
              {["posts", "books"].map((tab) => {
                const icons = {
                  posts: "grid-outline",
                  books: "book-outline",
                };

                const activeIcons = {
                  posts: "grid",
                  books: "book",
                };

                const iconName =
                  activeTab === tab ? activeIcons[tab] : icons[tab];

                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabButton,
                      activeTab === tab && styles.activeTabButton,
                    ]}
                  >
                    <View style={styles.tabContent}>
                      <AppText
                        style={[
                          styles.tabText,
                          activeTab === tab && styles.activeTabText,
                        ]}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </AppText>
                      <Ionicons
                        name={iconName}
                        size={16}
                        color={
                          activeTab === tab
                            ? activeColors.text
                            : activeColors.mediumGrey
                        }
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: hp(10),
            }}
          >
            <AppText style={{ color: activeColors.mediumGrey, fontSize: 16 }}>
              No {activeTab === "posts" ? "posts to display" : "books listed"}{" "}
              yet
            </AppText>
          </View>
        }
        renderItem={({ item }) =>
          activeTab == "posts" ? (
            <PostGridItem item={item} router={router} />
          ) : (
            <HorizontalPadding>
              <BookItem
                item={item}
                saves={saves}
                router={router}
                currentUser={user}
                setSaves={setSaves}
                style={{ marginBottom: 10 }}
              />
            </HorizontalPadding>
          )
        }
        onEndReached={activeTab === "posts" ? getPosts : getBooks}
        onEndReachedThreshold={0}
      />
      <OptionsModal
        visible={menuVisible}
        usedForUserDetails={true}
        owner={userId === user?.id}
        onClose={() => setMenuVisible(false)}
        onBlock={handleBlock}
      />
    </SafeScreen>
  );
};

export default UserDetails;
