import { memo } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import AppText from "./AppText";

const SettingListItem = ({
  label,
  icon,
  iconColor = theme.colors.mediumGrey,
  labelColor = theme.colors.dark,
  iconBgColor = theme.colors.lightGrey,
  chevron = true,
  labelCenter = false,
  notification = false,
  bgColor = "red",
  toggle = false,
  description,
  value,
  onValueChange,
  onPress,
  style,
}) => {
  return toggle ? (
    <View style={[styles.container, { paddingHorizontal: 16 }, style]}>
      <View style={[styles.rowContainer]}>
        <View style={styles.left}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              color={iconColor}
              size={22}
              style={{ marginRight: 7 }}
            />
          )}
          <AppText style={styles.label}>{label}</AppText>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.gray, true: theme.colors.primary }}
        />
      </View>
      {description && (
        <AppText
          style={{ color: theme.colors.gray, marginTop: 8, fontSize: 12 }}
        >
          {description}
        </AppText>
      )}
    </View>
  ) : notification ? (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* the row contents  */}
      <View style={[styles.rowContainer]}>
        <View style={styles.leftSide}>
          {icon && (
            <View
              style={[
                styles.notificationIcon,
                { backgroundColor: iconBgColor },
              ]}
            >
              <MaterialCommunityIcons
                name={icon}
                color={theme.colors.white}
                size={28}
              />
            </View>
          )}
          <View>
            <AppText style={styles.label}>{label}</AppText>
            <AppText
              style={{ color: theme.colors.gray, marginTop: 2, fontSize: 12 }}
            >
              {"description will display here"}
            </AppText>
          </View>
        </View>
        {chevron && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.gray}
          />
        )}
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[styles.chevronContainer, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        {icon && (
          <MaterialCommunityIcons name={icon} color={iconColor} size={22} />
        )}
        <AppText style={[styles.label, { color: labelColor }]}>{label}</AppText>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.mediumGrey}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notificationIcon: {
    padding: 12,
    borderRadius: 50,
  },
  chevronContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 16,
  },
});

export default memo(SettingListItem);
