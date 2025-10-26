import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// enable smooth animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Collapsible({ title = "This is the Title", children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="white"
          />
        </View>
      </TouchableOpacity>

      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    backgroundColor: "#444",
    marginTop: 6,
    padding: 10,
    borderRadius: 6,
  },
});
