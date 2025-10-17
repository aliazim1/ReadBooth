import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import BookItem from "../../../components/BookItem";
import FollowButton from "../../../components/FollowButton";
import HorizontalPadding from "../../../components/HorizontalPadding";
import Loading from "../../../components/Loading";
import OptionsModal from "../../../components/OptionsModal";
import PostGridItem from "../../../components/PostGridItem";
import SafeScreen from "../../../components/SafeScreen";
import StatsItem from "../../../components/StatsItem";
import { appTheme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp } from "../../../helpers/common";
import { fetchBooks } from "../../../services/bookServices";
import { fetchPosts } from "../../../services/postService";
import { getUserData } from "../../../services/userService";
import { useTabsStyles } from "../../../styles/tabsStyles";

// global variable for the number of posts (limit)
var limit = 0;

const UserDetails = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const { userId } = useLocalSearchParams();
  const [follow, setFollow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [startLoading, setStartLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [books, setBooks] = useState([]);

  // fetch user info on mount
  useEffect(() => {
    fetchUserInfo();
    getPosts();
    getBooks();
  }, [userId]);

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
    limit += 9;
    let res = await fetchPosts(limit, userId);
    if (res.success) {
      if (posts.length === res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  const getBooks = async () => {
    if (!hasMoreBooks) return null;
    limit += 9;
    let res = await fetchBooks(limit, userId);
    if (res.success) {
      if (books.length === res.data.length) setHasMoreBooks(false);
      setBooks((prevBooks) => {
        // Only replace if data actually changed
        if (JSON.stringify(prevBooks) === JSON.stringify(res.data))
          return prevBooks;
        return res.data;
      });
    }
  };

  // used for header + icons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: userData?.name || "User Details",
      headerRight: () => (
        <AppIoniconTouchable
          size={20}
          name="ellipsis-horizontal"
          onPress={() => setMenuVisible(true)}
        />
      ),
    });
    getPosts();
    getBooks();
  }, [navigation, router, userData, posts, books]);

  // refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      getPosts();
      getBooks();
    }, [userId])
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
        numColumns={3}
        data={currentData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 5 }}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.profileDetails}>
            <HorizontalPadding>
              <View style={styles.profileColumn}>
                <View style={styles.imgNameRow}>
                  <Avatar uri={userData?.image} />
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

              <FollowButton
                title={follow ? "Following" : "Follow"}
                onPress={() => {
                  setFollow(!follow);
                  setLoadingFollow(!loadingFollow);
                }}
                // after the following is completed, tunr the loading to False
                // isLoading={loadingFollow}
                containerStyle={{
                  backgroundColor: follow
                    ? activeColors.primary
                    : activeColors.mediumGrey,
                }}
              />

              {userData?.bio && (
                <AppText style={styles.bio}>{userData.bio}</AppText>
              )}
            </HorizontalPadding>

            <HorizontalPadding>
              <View style={styles.statRow}>
                <StatsItem title="Followers" value="0" />
                <StatsItem title="Following" value="0" />
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
            <BookItem item={item} router={router} currentUser={user} />
          )
        }
        onEndReached={activeTab === "posts" ? getPosts : getBooks}
        onEndReachedThreshold={0}
      />
      <OptionsModal
        visible={menuVisible}
        owner={userId == user?.id}
        usedForUserDetails={true}
        onClose={() => setMenuVisible(false)}
        onBlock={() => {}}
      />
    </SafeScreen>
  );
};

export default UserDetails;
