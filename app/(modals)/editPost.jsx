import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../components/AppButton";
import AppIoniconTouchable from "../../components/AppIoniconTouchable";
import Avatar from "../../components/Avatar";
import CustomInput from "../../components/CustomInput";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { updatePost } from "../../services/postService";
import { modalsStyles } from "../../styles/modalsStyles";

const EditPost = () => {
  const styles = modalsStyles();
  const post = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [bodyContent, setBodyContent] = useState("");

  useEffect(() => {
    if (post && post.id) {
      setBodyContent(post.body);
    }
  }, [post.id, post.body]);

  // function to publish the post
  const onSave = async () => {
    if (bodyContent.trim() === "") {
      Alert.alert("Empty Post", "Your post can’t be empty.");
      return;
    }

    setLoading(true);
    const res = await updatePost({ id: post.id, body: bodyContent.trim() });
    setLoading(false);

    if (res.success) {
      setBodyContent("");
      router.back();
      // router.replace("/home");
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AppIoniconTouchable
          style={{ marginLeft: 3.5 }}
          name="close"
          onPress={() => router.back()}
        />
      ),
    });
  }, [navigation, router]);

  return (
    <SafeScreen style={{ paddingHorizontal: wp(3.9) }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            {/* the profile details  */}
            <View style={styles.header}>
              <Avatar uri={user?.image} size={hp(6.5)} />
              <View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            {/* the text-field with actions */}
            <CustomInput
              placeholder="Edit your post caption...?"
              value={bodyContent}
              onChangeText={setBodyContent}
              multiline={true}
              numberOfLines={5}
              style={styles.bodyContent}
            />

            <AppButton title="Update" onPress={onSave} isLoading={loading} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeScreen>
  );
};

export default EditPost;
