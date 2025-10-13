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
import Avatar from "../../components/Avatar";
import CustomInput from "../../components/CustomInput";
import HeaderRight from "../../components/HeaderRight";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { editBook } from "../../services/bookServices";
import { useScreensStyles } from ".././../styles/screensStyles";

const EditBook = () => {
  const { styles, activeColors } = useScreensStyles();
  const book = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [link, setLink] = useState("");

  //   initially fill the textInputs with book's info
  useEffect(() => {
    if (book && book.id) {
      setTitle(book.title);
      setAuthor(book.author);
      setLink(book?.link);
    }
  }, [book.id, book.title, book.author, book.link]);

  // function to publish the post
  const onSave = async () => {
    // if user tries to post an empty post
    if (title.trim() === "" || author.trim() === "") {
      Alert.alert("Required Fields", "Please fill out the required fields.");
      return;
    }

    // add the book to the shelve
    setLoading(true);
    let res = await editBook({
      id: book.id,
      title: title,
      author: author,
      link: link,
    });
    setLoading(false);
    if (res.success) {
      setTitle("");
      setAuthor("");
      setLink("");
      setTimeout(() => {
        router.back();
      }, 1000);
    } else {
      Alert.alert("Edit Book", res.msg);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onPress2={() => router.back()} />,
    });
  }, [navigation, router]);

  return (
    <SafeScreen>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            {/* the profile details  */}
            <View style={styles.postHeader}>
              <Avatar uri={user?.image} size={hp(6.5)} />
              <View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            {/* the text-field with actions */}
            <CustomInput
              value={title}
              label={"Title"}
              multiline={false}
              autoCorrect={true}
              onChangeText={setTitle}
              placeholder="Book Title"
              autoCapitalize={"words"}
              style={styles.textInputs}
            />
            <CustomInput
              value={author}
              label={"Author"}
              multiline={false}
              autoCorrect={true}
              onChangeText={setAuthor}
              autoCapitalize={"words"}
              placeholder="Book Author"
              style={styles.textInputs}
            />
            <CustomInput
              label={"Link"}
              value={link}
              multiline={false}
              autoCorrect={true}
              onChangeText={setLink}
              style={styles.textInputs}
              placeholder="Enter link to the book"
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

export default EditBook;
