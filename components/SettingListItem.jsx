import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Switch, TouchableOpacity, View } from "react-native";

import { hp } from "../helpers/common";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const SettingListItem = ({
  label,
  labelColor = "",
  icon,
  iconColor = "",
  chevron = true,
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
              color={activeColors.iconsColor || iconColor}
              size={22}
              style={{ marginRight: 7 }}
            />
          )}
          <AppText
            style={{
              color: labelColor || activeColors.text,
              fontSize: hp(1.8),
            }}
          >
            {label}
          </AppText>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: activeColors.iconsColor,
            true: activeColors.primary,
          }}
        />
      </View>
      {description && (
        <AppText style={styles.descriptionText}>{description}</AppText>
      )}
    </View>
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
            color={iconColor || activeColors.iconsColor}
            size={22}
          />
        )}
        <AppText
          style={{
            color: labelColor || activeColors.text,
            fontSize: hp(1.8),
          }}
        >
          {label}
        </AppText>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={activeColors.iconsColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default memo(SettingListItem);
