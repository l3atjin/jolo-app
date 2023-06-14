import {
  Box,
  Button,
  CheckIcon,
  Heading,
  Input,
  Select,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { View } from "react-native";
import { supabase } from "../api/supabase";

export default function RequestForm() {
  const [departure, setDeparture] = useState("Дархан");
  const [destination, setDestination] = useState("Улаанбаатар");
  const [date, setDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [description, setDescription] = useState("");

  const timeOfDayOptions = ["Өглөө", "Өдөр", "Орой", "Хамаагүй"];

  async function makeRequest() {
    console.log("before insertRequest");
    await insertRequest({
      departure,
      destination,
      date,
      timeOfDay,
      description,
    });
    alert("Request posted!");
  }

  return (
    <Box mt="10">
      <Heading>Унаа хайж байна уу?</Heading>
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
      <Input
        placeholder="Нэмэлт Мэдээлэл"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button onPress={makeRequest}>Оруулах</Button>
    </Box>
  );
}

async function insertRequest(params: RequestType) {
  console.log("PARAMS ARE:", params);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("after auth.user()");
  console.log("user is", user);
  console.log("user id is", user.id);

  if (user) {
    // Get the IDs for the departure and destination locations
    const { data: departureData, error: departureError } = await supabase
      .from("locations")
      .select("id")
      .eq("location_name", params.departure);

    const { data: destinationData, error: destinationError } = await supabase
      .from("locations")
      .select("id")
      .eq("location_name", params.destination);

    if (
      departureError ||
      destinationError ||
      !departureData.length ||
      !destinationData.length
    ) {
      console.error("Error getting location IDs");
      return;
    }

    const departureId = departureData[0].id;
    const destinationId = destinationData[0].id;

    const { data, error } = await supabase
      .from("requests")
      .insert([
        {
          user_id: user.id,
          departure_location_id: departureId,
          destination_location_id: destinationId,
        },
      ]);

    // handle response
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  } else {
    // handle case where no user is logged in
    console.error("No user logged in");
  }
}
