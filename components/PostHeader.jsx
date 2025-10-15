// import { Ionicons } from "@expo/vector-icons";
// import { Pressable, Text, View } from "react-native";

// import { hp } from "../helpers/common";
// import { useComponentsStyles } from "../styles/componentsStyles";
// import AppText from "./AppText";
// import Avatar from "./Avatar";

// const PostHeader = ({ item, createdAt, onPress, forPostCard = false }) => {
//   const { styles, activeColors } = useComponentsStyles();
//   return (
//     <View style={styles.postHeader}>
//       <View style={styles.headerFirstRow}>
//         <Avatar size={hp(5)} uri={item?.user?.image} />
//         <View>
//           <Text style={styles.name}>{item?.user?.name}</Text>
//           <AppText style={styles.username}>@{item?.user?.username}</AppText>
//         </View>
//         <View style={styles.createdAtContainer}>
//           <AppText style={styles.createdAt}>{createdAt}</AppText>
//         </View>
//       </View>
//       <Pressable onPress={onPress}>
//         <Ionicons
//           size={hp(1.8)}
//           color={activeColors.Text}
//           name="ellipsis-horizontal"
//         />
//       </Pressable>
//     </View>
//   );
// };

// export default PostHeader;
