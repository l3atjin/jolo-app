import React, { useState } from "react";
import { Box, Button, CheckIcon, Heading, Input, Select, VStack } from 'native-base';

export default function PostForm({ onSubmit, children }) {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [description, setDescription] = useState('');

  const timeOfDayOptions = ['Өглөө', 'Өдөр', 'Орой', 'Хамаагүй'];

  const handleSubmit = () => {
    const requestData = { departure, destination, date, timeOfDay, description };
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
      <Input
        variant="rounded"
        placeholder="Өдөр"
        value={date}
        onChangeText={setDate}
      />
      <Select 
        selectedValue={timeOfDay}
        placeholder="Хэдэн цагаас?"
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }}
        onValueChange={ value => {setTimeOfDay(value)}}
        mt="1">
          {
            timeOfDayOptions.map( (item, index) => {
              return (
                <Select.Item label={item} value={item} key={index}/>
              )
            })
          }
      </Select>
      { children }
      <Input
        placeholder="Нэмэлт Мэдээлэл"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button onPress = {handleSubmit}>Оруулах</Button>
    </Box>
  );
}
