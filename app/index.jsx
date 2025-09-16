import { Redirect, useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return <Redirect href="welcome" />;
};

export default Index;
