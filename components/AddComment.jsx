import { Pressable, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";
import CustomInput from "./CustomInput";
import Loading from "./Loading";

const AddComment = ({ comment, setComment, loadingSend, onNewComment }) => {
  const { styles, activeColors } = useComponentsStyles();
  return (
    <View style={styles.inputContainer}>
      <CustomInput
        multiline
        value={comment}
        numberOfLines={5}
        autoCorrect={true}
        onChangeText={setComment}
        placeholder="Leave a comment..."
      />
      {loadingSend ? (
        <View style={styles.sendBtn}>
          <Loading color={activeColors.text} />
        </View>
      ) : (
        <Pressable style={styles.sendBtn} onPress={onNewComment}>
          <AppText style={styles.sendbtnText}>Post</AppText>
        </Pressable>
      )}
    </View>
  );
};

export default AddComment;
