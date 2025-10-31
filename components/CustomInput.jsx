import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const CustomInput = ({
  value,
  label,
  onChangeText,
  iconSize = 20,
  showSearchIcon = false,
  placeholder = "Enter text",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles, activeColors } = useComponentsStyles();

  return (
    <View style={{ flex: 1 }}>
      {label && <AppText style={styles.inputLabel}>{label}</AppText>}

      <View
        style={[
          styles.textInput,
          {
            flexDirection: "row",
            alignItems: "center",
            borderColor: isFocused
              ? activeColors.mediumGrey
              : activeColors.tabBarBorder,
          },
          style,
        ]}
      >
        {showSearchIcon && (
          <Ionicons
            name="search-outline"
            size={18}
            color={activeColors.mediumGrey}
            style={{ marginRight: 5 }}
          />
        )}

        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          autoFocus={props.autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={activeColors.mediumGrey}
          clearButtonMode="while-editing"
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType}
          style={{
            flex: 1,
            color: activeColors.text,
          }}
        />
      </View>
    </View>
  );
};

export default CustomInput;
