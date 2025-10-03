import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import HorizontalPadding from "../../../components/HorizontalPadding";
import Loading from "../../../components/Loading";
import PostCard from "../../../components/PostCard";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { fetchPosts } from "../../../services/postService";

const StatsItem = ({ title, value }) => {
  return (
    <TouchableOpacity style={styles.column}>
      <AppText style={{ fontSize: 14 }}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </TouchableOpacity>
  );
};

// global variable for the number of posts (limit)
var limit = 0;

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // function: fetching the posts
  const getPosts = async () => {
    // if no more post, do not call the API
    if (!hasMorePosts) return null;
    // increase the number of posts to fetch
    limit = limit + 10;
    let res = await fetchPosts(limit, user.id); // call the API here
    if (res.success) {
      if (posts.length == res.data.length) setHasMorePosts(false);
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
  }, [navigation, router]);

  return (
    <SafeScreen>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.profileDetails}>
            <HorizontalPadding>
              <View style={styles.profileColumn}>
                <Avatar uri={user?.image} />

                <View style={{ width: wp(61) }}>
                  <AppText style={styles.value}>{user?.name}</AppText>
                  {user?.username && <AppText>@{user?.username}</AppText>}
                  {user?.address && <AppText>{user?.address}</AppText>}
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => router.push("/edit-profile-details")}
                  >
                    <AppMaterialCommunityIcon name="square-edit-outline" />
                  </TouchableOpacity>
                </View>
              </View>
              {user?.bio && <AppText style={styles.bio}>{user?.bio}</AppText>}
            </HorizontalPadding>

            <HorizontalPadding>
              <View style={styles.statRow}>
                <StatsItem title="Followers" value="23" />
                <StatsItem title="Following" value="31" />
                <StatsItem title="Posts" value={posts.length} />
                <StatsItem title="Books" value="5" />
              </View>
            </HorizontalPadding>

            {/* <ScrollView horizontal contentContainerStyle={{ flex: 1, gap: 20 }}>
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
              <AppIoniconTouchable name="send" />
            </ScrollView> */}
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            item={item}
            currentUser={user}
            router={router}
            homeScreen={true}
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
          <View style={styles.container}>
            {hasMorePosts ? (
              <Loading style={{ marginVertical: 20 }} />
            ) : (
              <AppText style={styles.noMorePost}>No more posts</AppText>
            )}
          </View>
        }
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
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: hp(2),
  },
  column: {
    alignItems: "center",
    width: "25%",
  },
  value: {
    fontWeight: theme.fonts.bold,
  },
  bio: {
    marginTop: 15,
    marginLeft: wp(2),
  },
  ItemSeparatorComponent: {
    height: 1,
    marginVertical: 10,
    backgroundColor: theme.colors.itemSeparator,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  noMorePost: {
    fontSize: hp(1.3),
    marginVertical: 20,
  },
});

export default Profile;
