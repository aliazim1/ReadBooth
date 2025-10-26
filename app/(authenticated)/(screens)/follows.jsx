import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, View } from "react-native";

import AppText from "../../../components/AppText";
import FollowsListItem from "../../../components/FollowsListItem";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/AuthContext";
import { hp } from "../../../lib/common";
import { supabase } from "../../../lib/supabase";
import { getFollows } from "../../../services/userService";
import { useScreensStyles } from "../../../styles/screensStyles";

const Tab = createMaterialTopTabNavigator();

// reusable UserList component for each tab
const UserList = ({ userId, filterType }) => {
  const { styles } = useScreensStyles();
  const { user } = useAuth();
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollows();
  }, [filterType, user.id]);

  const fetchFollows = async () => {
    setLoading(true);
    const { success, data } = await getFollows(userId, filterType);
    if (success) {
      const formatted = await Promise.all(
        data.map(async (item) => {
          const userObj =
            filterType === "followers" ? item.follower : item.following;

          const { data: followCheck } = await supabase
            .from("follows")
            .select("id")
            .eq("followerId", user.id)
            .eq("followingId", userObj.id)
            .maybeSingle();

          return { ...userObj, followed: !!followCheck };
        })
      );
      setList(formatted);
    }
    setLoading(false);
  };

  const handleFollowToggle = async (targetUserId, isFollowed) => {
    if (isFollowed) {
      await supabase
        .from("follows")
        .delete()
        .eq("followerId", user.id)
        .eq("followingId", targetUserId);
    } else {
      await supabase
        .from("follows")
        .insert([{ followerId: user.id, followingId: targetUserId }]);
    }
    // refresh the list
    fetchFollows();
  };

  return (
    <SafeScreen>
      <FlatList
        data={list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FollowsListItem
            item={item}
            router={router}
            currentUserId={user?.id}
            onPress={() => handleFollowToggle(item.id, item.followed)}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View
              style={{
                marginTop: hp(30),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText>No user found.</AppText>
            </View>
          )
        }
      />
    </SafeScreen>
  );
};

const Follows = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { activeColors, styles } = useScreensStyles();
  const { initialTab, username, userId } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `@${username}`,
    });
  }, [navigation, router, username]);

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      backBehavior="none" // prevents switching tabs on back press
      screenOptions={{
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: activeColors.text,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarStyle: { backgroundColor: activeColors.background },
      }}
    >
      <Tab.Screen name="Followers">
        {() => <UserList userId={userId} filterType="followers" />}
      </Tab.Screen>
      <Tab.Screen name="Following">
        {() => <UserList userId={userId} filterType="following" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Follows;
