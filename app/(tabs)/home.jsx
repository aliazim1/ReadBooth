import { Alert, Text } from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

import AppButton from "../../components/AppButton";

const Home = () => {
  const { user, setAuth } = useAuth();
  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign Out", "Error signing out");
    }
  };

  return (
    <SafeScreen>
      <Text>Home</Text>

      <AppButton title="Sign Out" onPress={onLogout} />
    </SafeScreen>
  );
};

export default Home;
