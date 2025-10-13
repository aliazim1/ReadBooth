import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import HeaderRight from "../../../components/HeaderRight";
import HorizontalPadding from "../../../components/HorizontalPadding";
import PostGridItem from "../../../components/PostGridItem";
import SafeScreen from "../../../components/SafeScreen";
import StatsItem from "../../../components/StatsItem";
import { appTheme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { fetchBooks } from "../../../services/bookServices";
import { fetchPosts, fetchSavedPosts } from "../../../services/postService";
import { useTabsStyles } from "../../../styles/tabsStyles";

// global variable for the number of posts (limit)
var limit = 0;

const Profile = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedBooks, setSavedBookss] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const getPosts = async () => {
    if (!hasMorePosts) return null;
    limit += 9;
    let res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (posts.length === res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  const getBooks = async () => {
    if (!hasMoreBooks) return null;
    limit += 9;
    let res = await fetchBooks(limit, user.id);
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

  const getSavedPosts = async () => {
    if (!hasMorePosts) return null;
    limit += 9;
    let res = await fetchSavedPosts(limit, user.id);
    if (res.success) {
      if (savedPosts.length === res.data.length) setHasMorePosts(false);
      setSavedPosts(res.data);
    }
  };

  const getSavedBooks = async () => {
    if (!hasMorePosts) return null;
    limit += 9;
    let res = await fetchSavedPosts(limit, user.id);
    if (res.success) {
      if (savedPosts.length === res.data.length) setHasMorePosts(false);
      setSavedPosts(res.data);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.name ? user.name : "Profile",
      headerRight: () => (
        <HeaderRight
          icon2="menu"
          size={24}
          style={{ marginRight: 10 }}
          onPress2={() => router.push("/settings")}
        />
      ),
    });

    // initial load for posts and savedPosts
    getPosts();
    getBooks();
    getSavedPosts();
    getSavedBooks();
  }, [navigation, router]);

  // refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      getPosts();
      getBooks();
      getSavedPosts();
      getSavedBooks();
    }, [user?.id])
  );

  // Get correct content based on active tab
  const getCurrentData = () => {
    return activeTab == "posts"
      ? posts
      : activeTab == "saved"
      ? savedPosts
      : getSavedBooks;
  };

  const currentData = getCurrentData();

  return (
    <SafeScreen>
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 5 }}
        ListHeaderComponent={
          <View style={styles.profileDetails}>
            <HorizontalPadding>
              <View style={styles.profileColumn}>
                <Avatar uri={user?.image} />
                <View style={{ width: wp(61) }}>
                  <AppText style={{ fontWeight: appTheme.fonts.extraBold }}>
                    {user?.name}
                  </AppText>
                  {user?.username && <AppText>@{user?.username}</AppText>}
                  {user?.address && <AppText>{user?.address}</AppText>}
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/edit-profile-details")}
                >
                  <AppMaterialCommunityIcon name="square-edit-outline" />
                </TouchableOpacity>
              </View>
              {user?.bio && <AppText style={styles.bio}>{user.bio}</AppText>}
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
              {["posts", "saved", "books"].map((tab) => {
                const icons = {
                  posts: "grid-outline",
                  saved: "bookmark-outline",
                  books: "bookmark-outline",
                };

                const activeIcons = {
                  posts: "grid",
                  saved: "bookmark",
                  books: "bookmark",
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
              No{" "}
              {activeTab === "posts"
                ? "posts"
                : activeTab === "saved"
                ? "saved posts"
                : "saved books"}{" "}
              yet
            </AppText>
          </View>
        }
        renderItem={({ item }) => <PostGridItem item={item} router={router} />}
        onEndReached={getPosts}
        onEndReachedThreshold={0}
      />
    </SafeScreen>
  );
};

export default Profile;
