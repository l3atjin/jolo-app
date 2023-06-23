import { Box, Button, Input } from 'native-base'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { SearchFormProps } from '../screens/types';

export default function SearchForm( onSearchSubmit: SearchFormProps ) {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());

  const [searchParams, setSearchParams] = useState({
    departure: "",
    destination: "",
    date: new Date(),
    //...add more search parameters as needed
  });

  const handleChange = (name: string, value: string | Date | undefined) => {
    setSearchParams(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSearch = () => {
    onSearchSubmit(searchParams);
  };
  return (
    <Box>
      <Input
          variant="outline"
          placeholder="Хаанаас"
          value={departure}
          onChangeText={(text) => handleChange('departure', text)}
        />
        <Input
          variant="outline"
          placeholder="Хаашаа"
          value={destination}
          onChangeText={(text) => handleChange('destination', text)}
        />
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={(event, selectedDate) => handleChange('date', selectedDate)}
        />
        <Button onPress={onSearch}>
          Хайх
        </Button>
    </Box>
  )
}
