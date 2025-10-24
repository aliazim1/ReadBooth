import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";

import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import HeaderIcons from "../../../components/HeaderIcons";
import HorizontalPadding from "../../../components/HorizontalPadding";
import PostGridItem from "../../../components/PostGridItem";
import SafeScreen from "../../../components/SafeScreen";
import StatsItem from "../../../components/StatsItem";
import { appTheme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { fetchBooksCount } from "../../../services/bookServices";
import { fetchPosts, fetchSavedPosts } from "../../../services/postService";
import { getFollows } from "../../../services/userService";
import { useTabsStyles } from "../../../styles/tabsStyles";

// global variable for the number of posts (limit)
var limit = 0;

const Profile = () => {
  const { styles, activeColors } = useTabsStyles();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [bookCount, setBookCount] = useState(0);
  const [savedPosts, setSavedPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // function to load followers/following count
  const loadFollowsCount = async () => {
    const { success: s1, data: f1 } = await getFollows(user.id, "followers");
    if (s1) setFollowers(f1);

    const { success: s2, data: f2 } = await getFollows(user.id, "following");
    if (s2) setFollowing(f2);
  };

  const getPosts = async () => {
    if (!hasMorePosts) return null;
    limit += 9;
    let res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (posts.length === res.data.length) setHasMorePosts(false);
      setPosts(res.data);
    }
  };

  // get the number of books I have listed
  const getBookCount = async () => {
    const count = await fetchBooksCount(user.id);
    setBookCount(count);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppText style={styles.nbpHeaderTitle}>
          {user?.username ? `@${user.username}` : "Profile"}
        </AppText>
      ),

      headerRight: () => (
        <HeaderIcons
          icon2="menu"
          size={24}
          style={{ marginRight: 12 }}
          onPress2={() => router.push("/settings")}
        />
      ),
    });

    // initial load for posts and savedPosts
    getPosts();
    getBookCount();
    getSavedPosts();
    loadFollowsCount();
  }, [navigation, router]);

  // refresh when navigating back
  useFocusEffect(
    useCallback(() => {
      getPosts();
      getBookCount();
      getSavedPosts();
      loadFollowsCount();
    }, [user?.id])
  );

  // Get correct content based on active tab
  const getCurrentData = () => {
    return activeTab == "posts" ? posts : savedPosts;
  };

  const currentData = getCurrentData();

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
                  <Avatar uri={user?.image} />
                  <View style={{ width: wp(61) }}>
                    <AppText style={{ fontWeight: appTheme.fonts.extraBold }}>
                      {user?.name}
                    </AppText>
                    {user?.username && <AppText>@{user?.username}</AppText>}
                    {user?.address && <AppText>{user?.address}</AppText>}
                  </View>
                </View>
                <Pressable onPress={() => router.push("/edit-profile-details")}>
                  <AppMaterialCommunityIcon name="square-edit-outline" />
                </Pressable>
              </View>
              {user?.bio && <AppText style={styles.bio}>{user.bio}</AppText>}
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
                        userId: user.id,
                        username: user?.username,
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
                        userId: user.id,
                        username: user?.username,
                      },
                    })
                  }
                />
                <StatsItem title="Posts" value={posts.length} />
                <StatsItem title="Books" value={bookCount} />
              </View>
            </HorizontalPadding>

            {/* Tabs under stats */}
            <View style={styles.tabsContainer}>
              {["posts", "bookmarks"].map((tab) => {
                const icons = {
                  posts: "grid-outline",
                  bookmarks: "bookmark-outline",
                };

                const activeIcons = {
                  posts: "grid",
                  bookmarks: "bookmark",
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
