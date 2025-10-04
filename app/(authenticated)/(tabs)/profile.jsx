import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

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
import { fetchPosts } from "../../../services/postService";

// global variable for the number of posts (limit)
var limit = 0;

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

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
  }, [navigation, router]);

  return (
    <SafeScreen>
      <FlatList
        data={posts}
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
    color: theme.colors.dark,
  },
});

export default Profile;
