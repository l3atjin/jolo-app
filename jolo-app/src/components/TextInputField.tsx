import React from "react";
import { TextInput, View, Text } from "react-native";

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
}

export default function TextInputField({
  label,
  value,
  onChange,
}: TextInputFieldProps) {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput value={value} onChangeText={onChange} />
    </View>
  );
}
