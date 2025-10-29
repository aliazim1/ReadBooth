import { useState } from "react";
import { TextInput, View } from "react-native";

import { useComponentsStyles } from "../styles/componentsStyles";
import AppText from "./AppText";

const CustomInput = ({
  value,
  label,
  onChangeText,
  placeholder = "Enter text",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles, activeColors } = useComponentsStyles();

  return (
    <View style={{ flex: 1 }}>
      {label && <AppText style={styles.inputLabel}>{label}</AppText>}
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
        style={[
          styles.textInput,
          {
            color: activeColors.text,
            borderColor: isFocused
              ? activeColors.primary
              : activeColors.mediumGrey,
          },
          style,
        ]}
      />
    </View>
  );
};

export default CustomInput;
