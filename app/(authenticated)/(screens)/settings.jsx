import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import AppText from "../../../components/AppText";
import CustomAlert from "../../../components/CustomAlert";
import SafeScreen from "../../../components/SafeScreen";
import SettingListItem from "../../../components/SettingListItem";
import { useAuth } from "../../../contexts/AuthContext";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { supabase } from "../../../lib/supabase";
import { useScreensStyles } from ".././../../styles/screensStyles";

const Settings = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { styles, activeColors } = useScreensStyles();
  const { theme, updateTheme } = useContext(ThemeContext);
  const [darkMode, setDarkMode] = useState(theme.mode == "dark");

  const toggleMode = () => {
    updateTheme();
    setDarkMode((prev) => !prev);
  };

  const onLogout = async () => {
    try {
      setAuth(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("Sign Out", "Error signing out");
      }
      router.replace("/welcome");
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
          onPress={() => router.push("/edit-profile-details")}
        />
        <SettingListItem
          icon={"lock"}
          label={"Password"}
          style={{ paddingVertical: 16 }}
          onPress={() => router.push("/password")}
        />
        <SettingListItem
          label={"Dark Mode"}
          style={{ paddingVertical: 16 }}
          toggle={true}
          value={darkMode}
          onValueChange={toggleMode}
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
          iconColor={activeColors.danger}
          labelColor={activeColors.danger}
          style={{ paddingVertical: 16 }}
          labelStyle={{ fontWeight: "bold" }}
          onPress={() => handleLogOutBtn()}
        />

        <View style={styles.version}>
          <AppText>v1.0.0 (100000)</AppText>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default Settings;
