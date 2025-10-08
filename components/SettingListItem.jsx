import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const SettingListItem = ({
  label,
  labelColor = "",
  icon,
  iconColor = "",
  chevron = true,
  notification = false,
  toggle = false,
  description,
  value,
  onValueChange,
  onPress,
  style,
}) => {
  const { styles, activeColors } = useComponentsStyles();

  return toggle ? (
    <View style={[styles.settingItemContainer, style]}>
      <View style={[styles.rowContainer]}>
        <View style={styles.left}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              color={activeColors.gray || iconColor}
              size={22}
              style={{ marginRight: 7 }}
            />
          )}
          <AppText style={{ color: labelColor || activeColors.text }}>
            {label}
          </AppText>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: activeColors.gray, true: activeColors.primary }}
        />
      </View>
      {description && (
        <AppText style={styles.descriptionText}>{description}</AppText>
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
            <View style={[styles.notificationIcon]}>
              <MaterialCommunityIcons
                name={icon}
                color={iconColor || activeColors.gray}
                size={28}
              />
            </View>
          )}
          <View>
            <AppText style={{ color: labelColor || activeColors.text }}>
              {label}
            </AppText>
            <AppText style={styles.descriptionText}>
              {"description will display here"}
            </AppText>
          </View>
        </View>
        {chevron && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={iconColor || activeColors.gray}
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
          <MaterialCommunityIcons
            name={icon}
            color={iconColor || activeColors.gray}
            size={22}
          />
        )}
        <AppText style={{ color: labelColor || activeColors.text }}>
          {label}
        </AppText>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={activeColors.gray}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(SettingListItem);
