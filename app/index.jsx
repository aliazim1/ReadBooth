import { View } from "react-native";

import Loading from "../components/Loading";
import { useComponentsStyles } from "../styles/componentsStyles";

const Index = () => {
  const { activeColors } = useComponentsStyles();
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
