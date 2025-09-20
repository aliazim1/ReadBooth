import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import AppText from "./AppText";
const CustomInput = ({
  value,
  label,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  placeholder = "Enter text",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
    // style={style}
    >
      {label && (
        <AppText style={{ marginTop: 20, fontWeight: theme.fonts.bold }}>
          {label}
        </AppText>
      )}
      <TextInput
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.mediumGrey}
        className="input"
        style={[
          styles.searchBox,

          { borderColor: isFocused ? theme.colors.primary : theme.colors.dark },
          ,
          style,
        ]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    paddingVertical: hp(2),
    paddingHorizontal: 2,
    borderBottomWidth: 0.7,
  },
  searchBox: {
    borderRadius: 12,
    padding: hp(1.5),
    borderWidth: 0.7,
  },
});
export default CustomInput;
