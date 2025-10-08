import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppIonicon from "../../../components/AppIonicon";
import AppText from "../../../components/AppText";
import { theme } from "../../../constants/theme";
import { useNotifications } from "../../../contexts/NotificationsContext";
import { hp, wp } from "../../../helpers/common";

export default function TabLayout() {
  const { badgeCount } = useNotifications();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyling,
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.mediumGrey,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "",
          headerLeft: () => (
            <AppText style={styles.homeHeaderTItle}>ReadBooth</AppText>
          ),
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? theme.colors.primary
                    : "transparent",
                },
              ]}
            >
              <Octicons
                name="home-fill"
                size={18}
                color={focused ? theme.colors.text : theme.colors.mediumGrey}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{
          title: "Book Shelf",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? theme.colors.primary
                    : "transparent",
                },
              ]}
            >
              <MaterialIcons
                name="menu-book"
                size={20}
                color={focused ? theme.colors.text : theme.colors.mediumGrey}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.danger,
            color: "white",
          },
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? theme.colors.primary
                    : "transparent",
                },
              ]}
            >
              <AppIonicon
                name={"notifications"}
                size={20}
                color={focused ? theme.colors.text : theme.colors.mediumGrey}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.tabBarIcons,
                {
                  backgroundColor: focused
                    ? theme.colors.primary
                    : "transparent",
                },
              ]}
            >
              <AppIonicon
                name={"person"}
                size={20}
                color={focused ? theme.colors.text : theme.colors.mediumGrey}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyling: {
    bottom: 20,
    height: 63,
    paddingTop: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderTopWidth: 1,
    position: "absolute",
    alignItems: "center",
    borderColor: "#333",
    borderTopColor: "#333",
    justifyContent: "center",
    marginHorizontal: wp(14),
    backgroundColor: theme.colors.background,
  },
  homeHeaderTItle: {
    fontSize: hp(2),
    marginLeft: 12,
    color: theme.colors.text,
    fontWeight: theme.fonts.extraBold,
  },
  tabBarIcons: {
    width: 40,
    height: 40,
    padding: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

{
  /* <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.mediumGrey,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    > */
}
