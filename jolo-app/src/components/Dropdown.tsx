import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DropdownProps {
  label: string;
  value: string;
  onChange: (itemValue: string, itemIndex: number) => void;
  options: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <View>
      <Text>{label}</Text>
      <Picker selectedValue={value} onValueChange={onChange}>
        {options.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};
