import { View } from "react-native";

import Loading from "../components/Loading";
import { modalsStyles } from "../styles/modalsStyles";

const Index = () => {
  const { activeColors } = modalsStyles();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: activeColors.background,
      }}
    >
      <Loading />
    </View>
  );
};

export default Index;
