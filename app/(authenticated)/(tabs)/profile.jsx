import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppMaterialCommunityIcon from "../../../components/AppMaterialCommunityIcon";
import AppText from "../../../components/AppText";
import Avatar from "../../../components/Avatar";
import HorizontalPadding from "../../../components/HorizontalPadding";
import SafeScreen from "../../../components/SafeScreen";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";

const StatsItem = ({ title, value }) => {
  return (
    <TouchableOpacity style={styles.column}>
      <AppText style={{ fontSize: 14 }}>{title}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
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

  const renderTabContent = () => {
    return <AppText>The Footer contents</AppText>;
  };

  return (
    <SafeScreen>
      <FlatList
        data={[1]} // just a single item
        keyExtractor={(item, index) => index.toString()}
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
              <View style={styles.row}>
                <StatsItem title="Followers" value="23" />
                <StatsItem title="Following" value="31" />
                <StatsItem title="Posts" value="93" />
                <StatsItem title="Community" value="5" />
              </View>
            </HorizontalPadding>
          </View>
        }
        renderItem={() => (
          <HorizontalPadding>
            <AppText>The renderItem contents </AppText>
            <View style={{ paddingBottom: 50 }}>{renderTabContent()}</View>
          </HorizontalPadding>
        )}
        scrollEnabled
        showsVerticalScrollIndicator={false}
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
    // backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  add: {
    position: "absolute",
    bottom: 8,
    right: 0,
    borderRadius: 50,
    padding: 5,
    backgroundColor: theme.colors.white,
    shadowColor: "#0000006b",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: hp(2),
  },
  column: {
    alignItems: "center",
    width: "25%",
  },
  value: {
    fontWeight: theme.fonts.bold,
  },
  bio: {
    marginLeft: wp(24.5),
  },
});

export default Profile;
