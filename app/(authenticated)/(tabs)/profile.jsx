import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import HorizontalPadding from "../../../components/HorizontalPadding";
import PostGridItem from "../../../components/PostGridItem";
import SafeScreen from "../../../components/SafeScreen";
import StatsItem from "../../../components/StatsItem";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { fetchPosts, fetchSavedPosts } from "../../../services/postService";

// global variable for the number of posts (limit)
var limit = 0;

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const getSavedPosts = async () => {
    if (!hasMorePosts) return null;
    limit += 9;
    let res = await fetchSavedPosts(limit, user.id);
    if (res.success) {
      if (savedPosts.length === res.data.length) setHasMorePosts(false);
      setSavedPosts(res.data);
    }
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user?.name ? user.name : "Profile",
      headerRight: () => (
        <AppIoniconTouchable
          name="menu"
          size={24}
          style={{ marginRight: 10 }}
          onPress={() => router.push("/settings")}
        />
      ),
    });

    // initial load for posts and savedPosts
    getPosts();
    getSavedPosts();
  }, [navigation, router]);

  useFocusEffect(
    useCallback(() => {
      // refresh when navigating back
      getPosts();
      getSavedPosts();
    }, [user?.id])
  );

  // Get correct content based on active tab
  const getCurrentData = () => {
    return activeTab == "bookmarks" ? savedPosts : posts;
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
                  <AppText style={{ fontWeight: theme.fonts.extraBold }}>
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
                <StatsItem title="Books" value="0" />
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
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === tab && styles.activeTabText,
                        ]}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                      <Ionicons
                        name={iconName}
                        size={16}
                        color={
                          activeTab === tab
                            ? theme.colors.primary
                            : theme.colors.gray
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
        renderItem={({ item }) => <PostGridItem item={item} router={router} />}
        onEndReached={getPosts}
        onEndReachedThreshold={0}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  profileDetails: {
    marginTop: hp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  profileColumn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginVertical: hp(1.5),
  },

  bio: {
    marginTop: 8,
    color: theme.colors.text,
  },

  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 4,
    borderColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.gray,
    fontWeight: "500",
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});

export default Profile;
