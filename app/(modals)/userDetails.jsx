// import { Ionicons } from "@expo/vector-icons";
// import { Pressable, Text, View } from "react-native";
// import AppText from "../../components/AppText";
// import Avatar from "../../components/Avatar";
// import { useComponentsStyles } from "../../styles/componentsStyles";

// const UserDetails = ({ item, createdAt }) => {
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
//       <Pressable onPress={() => setMenuVisible(true)}>
//         <Ionicons
//           size={hp(1.8)}
//           color={activeColors.Text}
//           name={"ellipsis-horizontal"}
//         />
//       </Pressable>
//       {/* <AppPressableIoniconIcon
//               onPress={() => setMenuVisible(true)}
//               name={"ellipsis-horizontal"}
//               size={hp(1.8)}
//               showLabel={false}
//               width={20}
//             /> */}
//     </View>
//   );
// };

// export default UserDetails;
