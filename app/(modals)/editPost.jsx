import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import AppButton from "../../components/AppButton";
import AppIoniconTouchable from "../../components/AppIoniconTouchable";
import CustomInput from "../../components/CustomInput";
import PostHeader from "../../components/PostHeader";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../lib/common";
import { updatePost } from "../../services/postService";

const EditPost = () => {
  const post = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bodyContent, setBodyContent] = useState("");

  //   initially fill the textInputs with book's info
  useEffect(() => {
    if (post && post.id) {
      setBodyContent(post.body);
    }
  }, [post.body]);

  // function to publish the post
  const onSave = async () => {
    // if user tries to post an empty post
    if (bodyContent.trim() === "") {
      Alert.alert("Required Fields", "Please fill out the required fields.");
      return;
    }

    // add the book to the shelve
    setLoading(true);
    let res = await updatePost({
      id: post.id,
      body: post.body,
    });
    setLoading(false);
    if (res.success) {
      setBodyContent("");
      setTimeout(() => {
        router.back();
      }, 1000);
    } else {
      Alert.alert("Edit Post", res.msg);
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
    <SafeScreen>
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
            <PostHeader item={user} forPostCard={false} />

            {/* the text-field with actions */}
            <CustomInput
              placeholder="Edit your post caption...?"
              value={bodyContent}
              onChangeText={setBodyContent}
              multiline={true}
              numberOfLines={5}
              style={{
                height: hp(15),
                marginHorizontal: 18,
                marginVertical: hp(2),
                textAlignVertical: "top",
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      {/* add button won't be scrollable  */}
      <View style={{ paddingHorizontal: wp(4) }}>
        <AppButton title="Update" onPress={onSave} isLoading={loading} />
      </View>
    </SafeScreen>
  );
};

export default EditPost;
