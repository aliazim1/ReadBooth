import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { Text, View } from "react-native";

import AppIoniconTouchable from "../../../components/AppIoniconTouchable";
import { useAuth } from "../../../contexts/AuthContext";

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, setAuth } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppIoniconTouchable
            name="search-outline"
            size={24}
            style={{ marginRight: 30 }}
            // onPress={() => router.push("/")}
          />
          <AppIoniconTouchable
            name="add"
            size={22}
            onPress={() => router.push("/createPost")}
          />
        </View>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Hello, {user?.name}</Text>
    </View>
  );
};

export default Home;
