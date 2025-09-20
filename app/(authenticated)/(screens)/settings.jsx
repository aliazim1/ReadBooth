import { useNavigation, useRouter } from "expo-router";
import { Alert, ScrollView, View } from "react-native";

import { useLayoutEffect } from "react";
import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import AppText from "../../../components/AppText";
import CustomAlert from "../../../components/CustomAlert";
import SafeScreen from "../../../components/SafeScreen";
import SettingListItem from "../../../components/SettingListItem";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";

const Settings = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setAuth } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppIoniconTouchable
          name="chevron-back"
          size={28}
          color="white"
          onPress={() => router.back()}
        />
      ),
    });
  }, [navigation, router]);

  const onLogout = async () => {
    try {
      setAuth(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Sign Out", "Error signing out");
      }
    } catch (err) {
      Alert.alert("Sign Out", "Something went wrong. Please try again.");
    }
  };

  const handleLogOutBtn = () => {
    CustomAlert({
      title: "Log out",
      message: "Are you sure you want to log out?",
      onConfirm: onLogout,
    });
  };

  return (
    <SafeScreen>
      <ScrollView>
        <SettingListItem
          icon={"account"}
          label={"Account information"}
          style={{ paddingVertical: 16 }}
          onPress={() =>
            router.push("/(authenticated)/(screens)/edit-profile-details")
          }
        />
        <SettingListItem
          icon={"lock"}
          label={"Password"}
          style={{ paddingVertical: 16 }}
          onPress={() => router.push("/(authenticated)/(screens)/password")}
        />
        <SettingListItem
          icon={"shield"}
          label={"Privacy"}
          style={{ paddingVertical: 16 }}
        />
        <SettingListItem
          icon={"file-document"}
          label={"Terms & Policies "}
          style={{ paddingVertical: 16 }}
        />
        <SettingListItem
          icon={"logout"}
          label={"Log out"}
          chevron={false}
          iconColor={theme.colors.rose}
          labelColor={theme.colors.rose}
          style={{ paddingVertical: 16 }}
          onPress={() => handleLogOutBtn()}
        />

        <View style={{ alignItems: "center", marginVertical: hp(5) }}>
          <AppText>v1.0.0 (100000)</AppText>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default Settings;
