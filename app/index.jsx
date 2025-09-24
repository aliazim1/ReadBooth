import { useRouter } from "expo-router";
import { View } from "react-native";

import Loading from "../components/Loading";
import { theme } from "../constants/theme";

const Index = () => {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.white,
      }}
    >
      <Loading />
    </View>
  );
};

export default Index;
