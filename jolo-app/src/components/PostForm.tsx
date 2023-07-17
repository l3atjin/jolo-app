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
  const [date, setDate] = useState(new Date());
  const [exactTime, setExactTime] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState("Өглөө");
  const [description, setDescription] = useState("явна явна");

  const timeOfDayOptions = ["morning", "afternoon", "evening", "Цаг оруулах"];

  const handleSubmit = () => {
    const requestData = {
      departure,
      destination,
      date,
      timeOfDay,
      description,
      exactTime
    };
    onSubmit(requestData);
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
          testID="datePicker"
          value={date}
          mode="date"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate)
            }
          }}/>
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
      { timeOfDay === "Цаг оруулах" && 
        <DateTimePicker
          testID="timePicker"
          value={exactTime}
          mode="time"
          is24Hour={true}
          onChange={(event, selectedTime) => {
            if (selectedTime) {
              setExactTime(selectedTime)
            }
          }}/> }
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
