// import { StyleSheet, View } from "react-native";
// import {
//   actions,
//   RichEditor,
//   RichToolbar,
// } from "react-native-pell-rich-editor";

// import { theme } from "../constants/theme";
// import { hp } from "../helpers/common";

// const RichTextEditor = ({ editorRef, onChange }) => {
//   return (
//     <View style={{ minHeight: 285 }}>
//       <RichToolbar
//         actions={[actions.setBold, actions.setItalic, actions.insertLink]}
//         style={styles.richBar}
//         editor={editorRef}
//         disabled={false}
//       />
//       <RichEditor
//         ref={editorRef}
//         containerStyle={styles.rich}
//         editorStyle={styles.contentStyle}
//         placeholder={"What’s on your bookshelf today?"}
//         onChange={onChange}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   richBar: {
//     marginTop: hp(1.5),
//     alignItems: "flex-start",
//     backgroundColor: theme.colors.gray,
//     borderTopRightRadius: theme.radius.xl,
//     borderTopLeftRadius: theme.radius.xl,
//   },
//   flatStyle: {
//     paddingHorizontal: 8,
//   },
//   rich: {
//     flex: 1,
//     minHeight: 200,
//     borderWidth: 1.5,
//     borderTopWidth: 0,
//     borderBottomLeftRadius: theme.radius.xl,
//     borderBottomRightRadius: theme.radius.xl,
//     borderColor: theme.colors.gray,
//     padding: 5,
//   },
//   contentStyle: {
//     color: theme.colors.text,
//     placeholderColor: theme.colors.textLight,
//   },
// });
// export default RichTextEditor;
