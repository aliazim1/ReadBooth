import { useRouter } from "expo-router";
import _ from "lodash";
import { useCallback, useState } from "react";
import { FlatList, Keyboard, TouchableWithoutFeedback } from "react-native";

import CustomInput from "../../components/CustomInput";
import FollowsListItem from "../../components/FollowsListItem";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/AuthContext";
import { searchUsers } from "../../services/userService";
import { useScreensStyles } from "../../styles/screensStyles";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const { styles } = useScreensStyles();

  // debounced function that calls the API
  const debouncedSearch = useCallback(
    _.debounce(async (text) => {
      if (text.trim().length === 0) {
        setResults([]);
        return;
      }
      const res = await searchUsers(text.trim());
      if (res.success) setResults(res.data);
    }, 500), // 500ms delay after user stops typing
    []
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const onDissmiss = () => {
    if (searchQuery.length != 0) {
      Keyboard.dismiss;
    } else {
      Keyboard.dismiss;
      router.back();
    }
  };

  return (
    <SafeScreen style={styles.contentContainerStyer}>
      <TouchableWithoutFeedback onPress={() => onDissmiss()} accessible={false}>
        <FlatList
          data={results}
          contentContainerStyle={{ gap: 10 }}
          ListHeaderComponent={
            <CustomInput
              placeholder="Search by name or username"
              value={searchQuery}
              autoFocus={true}
              onChangeText={handleSearch}
              style={{ marginVertical: 20 }}
            />
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FollowsListItem
              item={item}
              currentUserId={user.id}
              router={router}
              showFollowBtn={false}
            />
          )}
        />
      </TouchableWithoutFeedback>
    </SafeScreen>
  );
};

export default SearchScreen;
