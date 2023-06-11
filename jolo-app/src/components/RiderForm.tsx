import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Menu } from 'react-native-paper';
import { supabase } from '../api/supabase';

interface RequestType {
  departure: string,
  destination: string,
  date: string,
  timeOfDate: string,
  description: string
}

export default function RiderForm() {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(false);

  const timeOfDayOptions = ['Өглөө', 'Өдөр', 'Орой', 'Хамаагүй'];

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  async function makeRequest() {
    console.log("before insertRequest")
    await insertRequest({ departure, destination, date, timeOfDay, description })
    console.log("after insertRequest")
  }

  return (
    <View>
      <TextInput
        label="Хаанаас"
        value={departure}
        onChangeText={setDeparture}
      />
      <TextInput
        label="Хаашаа"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        label="Өдөр"
        value={date}
        onChangeText={setDate}
      />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>{timeOfDay}</Button>}
      >
        {timeOfDayOptions.map((option, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              setTimeOfDay(option);
              closeMenu();
            }}
            title={option}
          />
        ))}
      </Menu>
      <TextInput
        label="Нэмэлт Мэдээлэл"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button onPress = {makeRequest}>Оруулах</Button>
    </View>
  );
}

async function insertRequest(params:RequestType) {
  console.log("PARAMS ARE:", params)
  const { data: { user } } = await supabase.auth.getUser()
  console.log("after auth.user()")
  console.log("user is", user)
  console.log("user id is", user.id)

  if (user) {
    // Get the IDs for the departure and destination locations
    const { data: departureData, error: departureError } = await supabase
      .from('locations')
      .select('id')
      .eq('location_name', params.departure);
      
    const { data: destinationData, error: destinationError } = await supabase
      .from('locations')
      .select('id')
      .eq('location_name', params.destination);
    
    if (departureError || destinationError || !departureData.length || !destinationData.length) {
      console.error('Error getting location IDs');
      return;
    }

    const departureId = departureData[0].id;
    const destinationId = destinationData[0].id;

    const { data, error } = await supabase
    .from('requests')
    .insert([
      { user_id: user.id, departure_location_id: departureId, destination_location_id: destinationId },
    ]);

    // handle response
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  } else {
    // handle case where no user is logged in
    console.error('No user logged in');
  }
  
}
