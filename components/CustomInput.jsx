import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  searchBox = false,
  secureTextEntry = false,
  keyboardType = "default",
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={style}>
      {label && <Text style={{ marginTop: 20 }}>{label}</Text>}
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
        placeholderTextColor={theme.colors.dark}
        className="input"
        style={[
          searchBox ? styles.searchBox : styles.inputField,
          searchBox
            ? {
                borderColor: isFocused
                  ? theme.colors.primary
                  : theme.colors.dark,
              }
            : {
                borderBottomColor: isFocused
                  ? theme.colors.primary
                  : theme.colors.dark,
              },
        ]}
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
