import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
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

  return (
    <View style={styles.container}>
      {label && (
        <AppText style={{ marginTop: 20, fontWeight: theme.fonts.bold }}>
          {label}
        </AppText>
      )}
      <TextInput
        {...props}
        clearButtonMode="while-editing"
        autoCapitalize={props.autoCapitalize}
        autoCorrect={props.autoCorrect}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.mediumGrey}
        className="input"
        style={[
          styles.textInput,
          {
            borderColor: isFocused
              ? theme.colors.primary
              : theme.colors.darkLight,
          },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    padding: hp(1.3),
    borderWidth: 0.7,
    borderRadius: theme.radius.md,
  },
});
export default CustomInput;
