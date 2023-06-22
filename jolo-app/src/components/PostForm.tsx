import React, { useState } from "react";
import {
  Box,
  Button,
  CheckIcon,
  Heading,
  Input,
  Select,
  VStack,
} from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PostForm({ onSubmit, children }) {
  const [departure, setDeparture] = useState("Дархан");
  const [destination, setDestination] = useState("Улаанбаатар");
  const [date, setDate] = useState(new Date(1598051730000));
  const [timeOfDay, setTimeOfDay] = useState("Өглөө");
  const [description, setDescription] = useState("явна явна");

  const timeOfDayOptions = ["Өглөө", "Өдөр", "Орой", "Хамаагүй"];

  const handleSubmit = () => {
    const requestData = {
      departure,
      destination,
      date,
      timeOfDay,
      description,
    };
    onSubmit(requestData);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <Box mt="5">
      <Input
        variant="rounded"
        placeholder="Хаанаас"
        value={departure}
        onChangeText={setDeparture}
      />
      <Input
        variant="rounded"
        placeholder="Хаашаа"
        value={destination}
        onChangeText={setDestination}
      />
      <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      <Select
        selectedValue={timeOfDay}
        placeholder="Хэдэн цагаас?"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />,
        }}
        onValueChange={(value) => {
          setTimeOfDay(value);
        }}
        mt="1"
      >
        {timeOfDayOptions.map((item, index) => {
          return <Select.Item label={item} value={item} key={index} />;
        })}
      </Select>
      {children}
      <Input
        placeholder="Нэмэлт Мэдээлэл"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button onPress={handleSubmit}>Оруулах</Button>
    </Box>
  );
}
